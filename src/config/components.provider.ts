import { AdblockComponent } from "../app/components/adblock";
import { AutoNavigationComponent } from "../app/components/auto-navigation";
import { AutoPlayComponent } from "../app/components/autoplay";
import { PlayerElementsFocusComponent } from "../app/components/player-elements-focus";
import { QualityComponent } from "../app/components/quality";

/**
 * The provider for the components.
 */
export default [
  AdblockComponent,
  AutoNavigationComponent,
  AutoPlayComponent,
  PlayerElementsFocusComponent,
  QualityComponent
] as { new(...args: any[]): any }[];

export const ComponentProvider = Symbol.for("ComponentProvider");