import { AutoPlayModule } from './autoplay';
import { AdblockModule } from './adblock';
import { Module, ModuleConstructor } from "./Module";

export const modules: ModuleConstructor[] = [
  AutoPlayModule,
  AdblockModule
];