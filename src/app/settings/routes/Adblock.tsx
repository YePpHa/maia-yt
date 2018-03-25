import { Component, h } from "preact";
import { IContainerProps } from "../IContainerProps";

import Formfield from 'preact-material-components/FormField';
import Checkbox from 'preact-material-components/Checkbox';
import Snackbar from 'preact-material-components/Snackbar';
import { AdblockApi } from "../../components/adblock/api";

export class Adblock extends Component<IContainerProps, {}> {
  private _api?: AdblockApi;

  private _snackbar?: Snackbar;

  getApi(): AdblockApi {
    if (!this._api) {
      this._api = this.props.container.get<AdblockApi>(AdblockApi);
    }
    return this._api;
  }

  showSnackbar(): void {
    if (this._snackbar) {
      this._snackbar.MDComponent.show({
        message: "Settings saved!"
      });
    }
  }

  onEnableChange(e: Event): void {
    const target = e.target as HTMLInputElement;
    const checked = target.checked;

    this.getApi().setEnabled(checked);

    this.showSnackbar();
  }

  onWhitelistSubscribedChannelsChange(e: Event): void {
    const target = e.target as HTMLInputElement;
    const checked = target.checked;

    this.getApi().setSubscribedChannelsWhitelisted(checked);

    this.showSnackbar();
  }

  render(props: IContainerProps) {
    const onEnableChange = (e: Event) => this.onEnableChange(e);
    const onWhitelistSubscribedChannelsChange = (e: Event) => this.onWhitelistSubscribedChannelsChange(e);

    const api = this.getApi();

    return (
      <div>
        <h2>Adblock</h2>
        <div>
          <Formfield>
            <Checkbox id="enable" onChange={onEnableChange} checked={api.isEnabled()}></Checkbox>
            <label for="enable">Enable adblock</label>
          </Formfield>
        </div>
        <div>
          <Formfield>
            <Checkbox id="whitelist_subscribed_channels" onChange={onWhitelistSubscribedChannelsChange} checked={api.isSubscribedChannelsWhitelisted()}></Checkbox>
            <label for="whitelist_subscribed_channels">Whitelist subscribed channels</label>
          </Formfield>
        </div>

        <Snackbar ref={(el: any) => { this._snackbar = el as Snackbar; }} />
      </div>
    );
  }
}