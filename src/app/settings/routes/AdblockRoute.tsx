import { Component, h } from "preact";

import Formfield from 'preact-material-components/FormField';
import Checkbox from 'preact-material-components/Checkbox';
import { AdblockApi } from "../../modules/adblock/api";

export class AdblockRoute extends Component<{}, {}> {
  private _api: AdblockApi;

  public constructor(api: AdblockApi) {
    super();
    this._api = api;
  }

  public onEnableChange(e: Event): void {
    const target = e.target as HTMLInputElement;
    const checked = target.checked;

    this._api.setEnabled(checked);
  }

  public onWhitelistSubscribedChannelsChange(e: Event): void {
    const target = e.target as HTMLInputElement;
    const checked = target.checked;

    this._api.setSubscribedChannelsWhitelisted(checked);
  }

  public render() {
    const onEnableChange = (e: Event) => this.onEnableChange(e);
    const onWhitelistSubscribedChannelsChange = (e: Event) => this.onWhitelistSubscribedChannelsChange(e);

    return (
      <div>
        <h2>Adblock</h2>
        <div>
          <Formfield>
            <Checkbox id="enable" onChange={onEnableChange} checked={this._api.isEnabled()}></Checkbox>
            <label for="enable">Enable adblock</label>
          </Formfield>
        </div>
        <div>
          <Formfield>
            <Checkbox id="whitelist_subscribed_channels" onChange={onWhitelistSubscribedChannelsChange} checked={this._api.isSubscribedChannelsWhitelisted()}></Checkbox>
            <label for="whitelist_subscribed_channels">Whitelist subscribed channels</label>
          </Formfield>
        </div>
      </div>
    );
  }
}