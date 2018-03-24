import { AdblockApi } from "../app/components/adblock/api";
import { AutoNavigationApi } from "../app/components/auto-navigation/api";
import { AutoPlayApi } from "../app/components/autoplay/api";
import { PlayerElementsFocusApi } from "../app/components/player-elements-focus/api";
import { QualityApi } from "../app/components/quality/api";

/**
 * The provider for the APIs.
 */
export default [
  AdblockApi,
  AutoNavigationApi,
  AutoPlayApi,
  PlayerElementsFocusApi,
  QualityApi
] as { new(...args: any[]): any }[];

export const ApiProvider = Symbol.for("ApiProvider");