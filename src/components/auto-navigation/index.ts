import { onPlayerCreated, onSettingsReactRegister, onPlayerApiCall, onPlayerApiCallResponse } from "../IComponent";
import { PlayerData } from "../../app/youtube/PlayerConfig";
import { Component } from "../Component";
import { Player } from "../../app/player/Player";
import { Logger } from '../../libs/logging/Logger';
import { EventType } from '../../app/youtube/EventType';
import { ISettingsReact } from "../../settings/ISettings";
import { Settings as SettingsReact } from './settings';
import { Api } from "./api";
import { AutoNavigationState } from "../../app/youtube/PlayerApi";
const logger = new Logger("AutoNavigationComponent");

export class AutoNavigationComponent extends Component implements onPlayerCreated, onSettingsReactRegister, onPlayerApiCall {
  private _autoNavigationCalls: {[key: string]: number} = {};
  private _api: Api;

  getApi(): Api {
    if (!this._api) {
      this._api = new Api()
    }
    return this._api;
  }

  onPlayerApiCall(player: Player, name: string, data: PlayerData): onPlayerApiCallResponse|undefined|void {
    const id = player.getId();
    if (name === "setAutonavState") {
      const api = this.getApi();
      if (api.isEnabled() && this._autoNavigationCalls[id] < 2) {
        this._autoNavigationCalls[id]++;
        const toggle = document.querySelector("#toggle");
        if (toggle) {
          if (api.getState() === AutoNavigationState.ENABLED) {
            toggle.setAttribute("checked", "");
            toggle.setAttribute("active", "");
          } else {
            toggle.removeAttribute("checked");
            toggle.removeAttribute("active");
          }
        }
        return { value: undefined };
      }
    }
  }
  
  onPlayerCreated(player: Player): void {
    const api = this.getApi();

    const id: string = player.getId();

    if (api.isEnabled() && player.isDetailPage()) {
      logger.debug("Setting auto navigation state to " + (api.getState() === AutoNavigationState.ENABLED ? "enabled" : "disabled") + ".");
      player.setAutoNavigationState(api.getState());
    }
    this._autoNavigationCalls[id] = 0;
  }

  onSettingsReactRegister(): ISettingsReact {
    return new SettingsReact(this.getApi());
  }
}