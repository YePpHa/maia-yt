import { Module } from "../Module";
import { onPlayerCreated, onSettingsReactRegister } from "../IModule";
import { Player } from "../../app/player/Player";
import { ISettingsReact } from "../../settings/ISettings";
import { Settings as SettingsReact } from './settings';
import { Logger } from "../../libs/logging/Logger";
import { EventHandler } from "../../libs/events/EventHandler";
import { Api } from "./api";
import { BrowserEvent } from "../../libs/events/BrowserEvent";

const logger = new Logger("PlayerElementsFocusModule");

/**
 * If you click on some of the elements on the YouTube player (volume, progress)
 * it will outline the clicked element and that element will then have focus.
 */
export class PlayerElementsFocusModule extends Module implements onSettingsReactRegister {
  private _api: Api;

  constructor() {
    super();

    this.getHandler()
      .listen(document.documentElement, "mouseover", this._handleMouseOver, { passive: true, capture: false })
      .listen(document.documentElement, "mouseout", this._handleMouseOut, { passive: true, capture: false })
  }
  
  private _handleMouseOver(e: BrowserEvent) {

  }
  
  private _handleMouseOut(e: BrowserEvent) {

  }

  getApi(): Api {
    if (!this._api) {
      this._api = new Api()
    }
    return this._api;
  }
  
  onSettingsReactRegister(): ISettingsReact {
    return new SettingsReact(this.getApi());
  }
}