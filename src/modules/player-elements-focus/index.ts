import { Module } from "../Module";
import { onPlayerCreated, onSettingsReactRegister } from "../IModule";
import { Player } from "../../app/player/Player";
import { ISettingsReact } from "../../settings/ISettings";
import { Settings as SettingsReact } from './settings';
import { Logger } from "../../libs/logging/Logger";
import { EventHandler } from "../../libs/events/EventHandler";
import { Api } from "./api";

const logger = new Logger("PlayerElementsFocusModule");

/**
 * If you click on some of the elements on the YouTube player (volume, progress)
 * it will outline the clicked element and that element will then have focus.
 */
export class PlayerElementsFocusModule extends Module implements onPlayerCreated, onSettingsReactRegister {
  public name: string = "PlayerElementsFocus";
  private _api: Api;

  getApi(): Api {
    if (!this._api) {
      this._api = new Api(this.getStorage());
    }
    return this._api;
  }

  onPlayerCreated(player: Player) {
    const api = this.getApi();
    if (!api.isEnabled()) return;

    const element = player.getElement();
    if (!element) return;

    logger.debug("Removing `tabindex` attributes.");

    // Find all tabindex elements and remove tabindex attribute if they don't
    // have the value of `-1`.
    const tabIndexes = element.querySelectorAll("*[tabindex]");
    for (let i = 0; i < tabIndexes.length; i++) {
      let tabIndex = tabIndexes[i].getAttribute("tabindex");
      if (tabIndex === "-1") continue;

      tabIndexes[i].removeAttribute("tabindex");
    }
    
    const handler = new EventHandler();

    logger.debug("Attaching focus event listener to all player buttons.");

    // Find all buttons and attach a focus event listener to them. The listener
    // will focus the player element everytime the buttons gets focus.
    const buttons = element.querySelectorAll("button");
    for (let i = 0; i < buttons.length; i++) {
      handler.listen(buttons[i], 'focus', () => (element as HTMLElement).focus(), false);
    }

    // Make sure to dispose of the handler when the player is disposed.
    player.addOnDisposeCallback(() => handler.dispose());
  }
  
  onSettingsReactRegister(): ISettingsReact {
    return new SettingsReact(this.getApi());
  }
}