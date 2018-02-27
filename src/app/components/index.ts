import { AutoPlayComponent } from './autoplay';
import { AutoNavigationComponent } from './auto-navigation';
import { AdblockComponent } from './adblock';
import { PlayerElementsFocusComponent } from './player-elements-focus'
import { QualityComponent } from './quality';
import { ComponentConstructor } from "./Component";

export const components: ComponentConstructor[] = [
  AutoPlayComponent,
  AutoNavigationComponent,
  AdblockComponent,
  PlayerElementsFocusComponent,
  QualityComponent
];