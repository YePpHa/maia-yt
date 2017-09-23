import { AutoPlayModule } from './autoplay';
import { AdblockModule } from './adblock';
import { PlayerElementsFocusModule } from './player-elements-focus'
import { Module, ModuleConstructor } from "./Module";
import { QualityModule } from './quality';

export const modules: ModuleConstructor[] = [
  AutoPlayModule,
  AdblockModule,
  PlayerElementsFocusModule,
  QualityModule
];