// my_panel-meta.ts
import * as i18n from "../../core/i18n/i18n.js";
import * as UI from "../../ui/legacy/legacy.js";

const UIStrings = {
  /**
   *@description Title of the State Panel
   */
  state: "State",
  /**
   *@description Command for showing the State Panel
   */
  showStatePanel: "Show State Panel",
  /**
   *@description Tooltip for the My Panel icon
   */
  customPanelForPageAnalysis: "Custom panel for page analysis",
};

const str_ = i18n.i18n.registerUIStrings(
  "panels/state/state-meta.ts",
  UIStrings
);
const i18nLazyString = i18n.i18n.getLazilyComputedLocalizedString.bind(
  undefined,
  str_
);

let loadedStateModule: typeof import("./state.js").State | null = null;

async function loadStateModule(): Promise<typeof import("./state.js").State> {
  if (!loadedStateModule) {
    loadedStateModule = (await import("./state.js")).State;
  }
  return loadedStateModule;
}

UI.ViewManager.registerViewExtension({
  location: UI.ViewManager.ViewLocationValues.PANEL,
  id: "state",
  title: i18nLazyString(UIStrings.state),
  commandPrompt: i18nLazyString(UIStrings.showStatePanel),
  order: 100,
  async loadView() {
    const MyPanel = await loadStateModule();
    return new MyPanel();
  },
});
