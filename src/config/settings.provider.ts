import { AdblockSettings } from "../app/components/adblock/settings";
import { AutoNavigationSettings } from "../app/components/auto-navigation/settings";
import { AutoPlaySettings } from "../app/components/autoplay/settings";
import { PlayerElementsFocusSettings } from "../app/components/player-elements-focus/settings";
import { ISettingsReact } from "../app/settings-storage/ISettings";
import { QualitySettings } from "../app/components/quality/settings";

/**
 * The provider for the settings.
 */
export default [
  AdblockSettings,
  AutoNavigationSettings,
  AutoPlaySettings,
  PlayerElementsFocusSettings,
  QualitySettings
] as { new(...args: any[]): ISettingsReact }[];

export const SettingsProvider = Symbol.for("SettingsProvider");