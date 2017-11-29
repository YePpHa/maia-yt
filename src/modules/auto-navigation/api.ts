import { AutoNavigationState } from "../../app/youtube/PlayerApi";
import { ModuleApi } from "../ModuleApi";

export class Api extends ModuleApi {
  constructor() {
    super("AutoNavigation");
  }

  isEnabled(): boolean {
    return this.getStorage().get('enabled', false);
  }
  
  setEnabled(enabled: boolean): void {
    this.getStorage().set('enabled', enabled);
  }

  setState(state: AutoNavigationState): void {
    this.getStorage().set('state', state);
  }

  getState(): AutoNavigationState {
    return this.getStorage().get('state', AutoNavigationState.DISABLED);
  }
}