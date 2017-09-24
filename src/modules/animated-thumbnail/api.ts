import { ISettingsStorage } from "../../settings/ISettingsStorage";
import { getSettingsStorage } from "../Module";

export class Api {
  private storage: ISettingsStorage;
  
  constructor() {
    this.storage = getSettingsStorage("AnimatedThumbnail");
  }

  setEnabled(enabled: boolean): void {
    this.storage.set('enabled', enabled);
  }

  isEnabled(): boolean {
    return this.storage.get('enabled', false);
  }

  /**
   * Set the interval between each frame.
   * @param interval the interval in milliseconds
   */
  setInterval(interval: number): void {
    this.storage.set('interval', interval);
  }

  /**
   * Returns the interval between each frame in milliseconds.
   */
  getInterval(): number {
    return this.storage.get('interval', 1000);
  }

  /**
   * Set the delay before the animation should begin.
   * @param delay the delay in milliseconds
   */
  setDelay(delay: number): void {
    this.storage.set('delay', delay);
  }

  /**
   * Returns the delay in milliseconds.
   */
  getDelay(): number {
    return this.storage.get('delay', 1000);
  }
}