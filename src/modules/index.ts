import { AutoPlayModule } from './autoplay';
import { AutoNavigationModule } from './auto-navigation';
import { AdblockModule } from './adblock';
import { PlayerElementsFocusModule } from './player-elements-focus'
import { Module, ModuleConstructor } from "./Module";
import { QualityModule } from './quality';

export const modules: ModuleConstructor[] = [
  AutoPlayModule,
  AutoNavigationModule,
  AdblockModule,
  PlayerElementsFocusModule,
  QualityModule
];