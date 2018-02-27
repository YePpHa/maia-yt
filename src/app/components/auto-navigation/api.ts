import { AutoNavigationState } from "../../youtube/PlayerApi";
import { ComponentApi } from "../ComponentApi";

export class Api extends ComponentApi {
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