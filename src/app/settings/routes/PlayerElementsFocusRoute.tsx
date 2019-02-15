import { Component, h } from "preact";

import Formfield from 'preact-material-components/FormField';
import Checkbox from 'preact-material-components/Checkbox';
import { PlayerElementsFocusApi } from "../../modules/player-elements-focus/api";

export class PlayerElementsFocusRoute extends Component<{}, {}> {
  private _api: PlayerElementsFocusApi;

  public constructor(api: PlayerElementsFocusApi) {
    super();

    this._api = api;
  }

  public onEnableChange(e: Event): void {
    const target = e.target as HTMLInputElement;
    const checked = target.checked;

    this._api.setEnabled(checked);
  }

  public onGlobalShortcutsChange(e: Event): void {
    const target = e.target as HTMLInputElement;
    const checked = target.checked;

    this._api.setGlobalShortcutsEnabled(checked);
  }

  public render() {
    const onEnableChange = (e: Event) => this.onEnableChange(e);
    const onGlobalShortcutsChange = (e: Event) => this.onGlobalShortcutsChange(e);

    return (
      <div>
        <h2>Player elements focus</h2>
        <div>
          <Formfield>
            <Checkbox id="enable" onChange={onEnableChange} checked={this._api.isEnabled()}></Checkbox>
            <label for="enable">Prevent player elements from getting focus</label>
          </Formfield>
        </div>
        <div>
          <Formfield>
            <Checkbox id="global_shortcuts" onChange={onGlobalShortcutsChange} checked={this._api.isGlobalShortcutsEnabled()}></Checkbox>
            <label for="global_shortcuts">Make player shortcuts global</label>
          </Formfield>
        </div>
      </div>
    );
  }
}