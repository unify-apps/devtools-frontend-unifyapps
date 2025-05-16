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
  private enabled: boolean = false;
  private stateData: Protocol.State.SetStateData["state"] | null = null;
  private iframeUrl: string | null = null;
  private lastMessageTimeEpoch: number = -1;

  constructor(target: SDK.Target.Target) {
    super(target);

    target.registerStateDispatcher(this);
    this.enable();
  }

  enable(): void {
    this.enabled = true;
  }

  disable(): void {
    this.enabled = false;
  }

  setStateData(params: Protocol.State.SetStateData): void {
    if (this.enabled) {
      if (this.lastMessageTimeEpoch < params.messageTimeEpoch) {
        this.stateData = params.state;
        this.iframeUrl = params.iframeUrl;
        this.lastMessageTimeEpoch = params.messageTimeEpoch;
        this.dispatchEventToListeners(Events.SetStateData, params);
      }
    }
  }

  getStateData(): Protocol.State.SetStateData["state"] | null {
    if (this.enabled) {
      return this.stateData;
    }
    return null;
  }

  getIframeUrl(): string | null {
    if (this.enabled) {
      return this.iframeUrl;
    }
    return null;
  }
}

export const Events = {
  SetStateData: Symbol("setStateData"),
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
  private iframe: HTMLIFrameElement | null = null;

  constructor() {
    super("state");
    this.element.classList.add("state");

    this.contentElement = document.createElement("div");
    this.contentElement.classList.add("state-content");

    this.stateContainer = document.createElement("div");
    this.stateContainer.classList.add("state-container");

    this.contentElement.appendChild(this.stateContainer);
    this.element.appendChild(this.contentElement);

    SDK.TargetManager.TargetManager.instance().observeTargets(this);
  }

  override wasShown(): void {
    this.registerCSSFiles([stateStyles]);
    this.refreshStateDisplay();
  }

  private refreshStateDisplay(): void {
    if (!this.stateModel) {
      return;
    }

    const stateData = this.stateModel.getStateData();
    const iframeUrl = this.stateModel.getIframeUrl();

    this.stateContainer.textContent = "";

    if (iframeUrl) {
      this.iframe = document.createElement("iframe");
      this.iframe.src = iframeUrl;
      this.iframe.classList.add("state-iframe");
      this.iframe.setAttribute(
        "sandbox",
        "allow-scripts allow-same-origin allow-forms"
      );
      this.iframe.style.width = "100%";
      this.iframe.style.height = "100%";
      this.iframe.style.border = "none";

      this.iframe.onload = () =>
        setTimeout(() => {
          if (stateData && this.iframe?.contentWindow) {
            this.iframe.contentWindow.postMessage(
              { type: "devtools-state-update", state: stateData },
              "*"
            );
          }
        }, 300);

      this.stateContainer.appendChild(this.iframe);
    }
  }

  targetAdded(target: SDK.Target.Target): void {
    if (target.type() !== SDK.Target.Type.Frame) {
      return;
    }

    this.stateModel = target.model(StateModel);

    if (this.stateModel) {
      this.stateModel.addEventListener(
        Events.SetStateData,
        this.setStateData,
        this
      );

      this.refreshStateDisplay();
    }
  }

  targetRemoved(target: SDK.Target.Target): void {
    if (this.stateModel && this.stateModel.target() === target) {
      this.stateModel.removeEventListener(
        Events.SetStateData,
        this.setStateData,
        this
      );

      this.stateModel = null;
      this.stateContainer.textContent = "State target removed";
    }
  }

  private setStateData(
    event: Common.EventTarget.EventTargetEvent<Protocol.State.SetStateData>
  ): void {
    if (!this.iframe) {
      this.refreshStateDisplay();
    } else if (this.iframe?.contentWindow && event.data.state) {
      this.sendStateToIframe(event.data.state);
    }
  }

  private sendStateToIframe(state: any): void {
    if (this.iframe?.contentWindow) {
      this.iframe.contentWindow.postMessage(
        {
          type: "devtools-state-update",
          state: state,
        },
        "*"
      );
    }
  }
}
