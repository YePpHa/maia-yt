import { Component, h } from "preact";

import Formfield from 'preact-material-components/FormField';
import Checkbox from 'preact-material-components/Checkbox';
import { AutoNavigationApi } from "../../modules/auto-navigation/api";
import { AutoNavigationState } from "../../youtube/PlayerApi";

export class AutoNavigationRoute extends Component<{}, {}> {
  private _api: AutoNavigationApi;

  public constructor(api: AutoNavigationApi) {
    super();

    this._api = api;
  }

  public onEnableChange(e: Event): void {
    const target = e.target as HTMLInputElement;
    const checked = target.checked;

    this._api.setEnabled(checked);
  }

  public onAutoPlayEnabled(e: Event): void {
    const target = e.target as HTMLInputElement;
    const checked = target.checked;

    this._api.setState(checked ? AutoNavigationState.Enabled : AutoNavigationState.Disabled);
  }

  public render() {
    const onEnableChange = (e: Event) => this.onEnableChange(e);
    const onAutoPlayEnabled = (e: Event) => this.onAutoPlayEnabled(e);

    return (
      <div>
        <h2>Auto Navigation</h2>
        <div>
          <Formfield>
            <Checkbox id="enable" onChange={onEnableChange} checked={this._api.isEnabled()}></Checkbox>
            <label for="enable">Enable Force Auto Navigation</label>
          </Formfield>
        </div>
        <div>
          <Formfield>
            <Checkbox id="enable_autoplay" onChange={onAutoPlayEnabled} checked={this._api.getState() === AutoNavigationState.Enabled}></Checkbox>
            <label for="enable_autoplay">Whether to set YouTube to auto-play next video or not</label>
          </Formfield>
        </div>
      </div>
    );
  }
}