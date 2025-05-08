// front_end/panels/my_panel/my_panel.ts
import * as UI from "../../ui/legacy/legacy.js";
import * as i18n from "../../core/i18n/i18n.js";
import * as SDK from "../../core/sdk/sdk.js";
import * as Common from "../../core/common/common.js";
import * as Protocol from "../../generated/protocol.js";
import stateStyles from "./state.css.js";

const UIStrings = {};

const str_ = i18n.i18n.registerUIStrings("panels/state/state.ts", UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);

export class StateModel extends SDK.SDKModel.SDKModel {
  constructor(target: SDK.Target.Target) {
    super(target);

    target.registerStateDispatcher(this);
    const stateAgent = this.target().stateAgent();
    void stateAgent.invoke_enable();
  }

  stateInitialized(params: Protocol.State.StateInitialized): void {
    this.dispatchEventToListeners(Events.StateInitialized, params);
  }

  stateUpdated(params: Protocol.State.StateUpdated): void {
    this.dispatchEventToListeners(Events.StateUpdated, params);
  }
}

export const Events = {
  StateInitialized: Symbol("stateInitialized"),
  StateUpdated: Symbol("stateUpdated"),
};

SDK.SDKModel.SDKModel.register(StateModel, {
  capabilities: SDK.Target.Capability.State,
  autostart: true,
});

export class State
  extends UI.Panel.Panel
  implements SDK.TargetManager.Observer
{
  public override readonly contentElement: HTMLDivElement;
  private stateModel: StateModel | null = null;
  private stateContainer: HTMLDivElement;

  constructor() {
    super("state");
    this.element.classList.add("state");

    this.contentElement = document.createElement("div");
    this.contentElement.classList.add("state-content");

    this.stateContainer = document.createElement("div");
    this.stateContainer.textContent = "State (waiting for initialization...)";

    this.contentElement.appendChild(this.stateContainer);

    this.element.appendChild(this.contentElement);

    SDK.TargetManager.TargetManager.instance().observeTargets(this);
  }

  override wasShown(): void {
    this.registerCSSFiles([stateStyles]);
  }

  targetAdded(target: SDK.Target.Target): void {
    // Only handle frame targets (usually the main page)
    if (target.type() !== SDK.Target.Type.Frame) {
      return;
    }

    this.stateModel = target.model(StateModel);

    if (this.stateModel) {
      this.stateModel.addEventListener(
        Events.StateInitialized,
        this.onStateInitialized,
        this
      );

      this.stateModel.addEventListener(
        Events.StateUpdated,
        this.onStateUpdated,
        this
      );
    }
  }

  targetRemoved(target: SDK.Target.Target): void {
    if (this.stateModel && this.stateModel.target() === target) {
      this.stateModel.removeEventListener(
        Events.StateInitialized,
        this.onStateInitialized,
        this
      );

      this.stateModel.removeEventListener(
        Events.StateUpdated,
        this.onStateUpdated,
        this
      );

      this.stateModel = null;
    }
  }

  private onStateInitialized(
    event: Common.EventTarget.EventTargetEvent<Protocol.State.StateInitialized>
  ): void {
    const stateData = event.data;
    console.log("State initialized with data:", stateData);

    this.stateContainer.textContent = `State initialized: ${JSON.stringify(
      stateData,
      null,
      2
    )}`;
  }

  private onStateUpdated(
    event: Common.EventTarget.EventTargetEvent<Protocol.State.StateUpdated>
  ): void {
    const updateData = event.data;
    console.log("State updated with data:", updateData);

    this.stateContainer.textContent = `State updated: ${JSON.stringify(
      updateData,
      null,
      2
    )}`;
  }
}
