import { onPlayerCreated } from "../IModule";
import { Player } from "../../player/Player";
import { Logger } from "../../libs/logging/Logger";
import { EventHandler } from "../../libs/events/EventHandler";
import { PlayerElementsFocusApi } from "./api";
import { getPath } from "../../libs/dom";

const logger = new Logger("PlayerElementsFocusModule");

const BLACKLISTED_TAGNAMES: string[] = ["INPUT", "SELECT", "TEXTAREA", "EMBED"];

/**
 * If you click on some of the elements on the YouTube player (volume, progress)
 * it will outline the clicked element and that element will then have focus.
 */
export class PlayerElementsFocusModule implements onPlayerCreated {
  private _api: PlayerElementsFocusApi;
  
  constructor(api: PlayerElementsFocusApi) {
    this._api = api;
  }

  private _handleKeyDown(player: Player, e: KeyboardEvent) {
    if (e.altKey || e.shiftKey || e.metaKey || e.ctrlKey) return;
    const playerElement = player.getElement();
    if (playerElement && (playerElement === e.target || playerElement.contains(e.target as Node)))
      return;
    const path = getPath(e.target as Node)
      .map(node => (node as Element).tagName);
    if (path.findIndex(tagName => BLACKLISTED_TAGNAMES.indexOf(tagName) !== -1) !== -1) return;

    const api = this._api;
    if (!api.isGlobalShortcutsEnabled()) return;

    if (player.triggerKeyDown(e.keyCode, e.bubbles)) {
      e.preventDefault();
    }
  }

  onPlayerCreated(player: Player): void {
    const api = this._api;
    if (!api.isEnabled()) return;

    const element = player.getElement();
    if (!element) return;
    
    const handler = new EventHandler();
    if (player.getElementId() === "movie_player") {
      handler
        .listen(document, 'keydown', (e: KeyboardEvent) => this._handleKeyDown(player, e), false);
    }

    logger.debug("Removing `tabindex` attributes.");

    // Find all tabindex elements and remove tabindex attribute if they don't
    // have the value of `-1`.
    const tabIndexes = element.querySelectorAll("*[tabindex]");
    for (let i = 0; i < tabIndexes.length; i++) {
      let tabIndex = tabIndexes[i].getAttribute("tabindex");
      if (tabIndex === "-1") continue;

      tabIndexes[i].removeAttribute("tabindex");
    }

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
}