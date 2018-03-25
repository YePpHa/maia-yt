import { Component, h } from "preact";
import { IContainerProps } from "../IContainerProps";

import Formfield from 'preact-material-components/FormField';
import Checkbox from 'preact-material-components/Checkbox';
import Snackbar from 'preact-material-components/Snackbar';
import { AutoNavigationApi } from "../../components/auto-navigation/api";
import { AutoNavigationState } from "../../youtube/PlayerApi";

export class AutoNavigation extends Component<IContainerProps, {}> {
  private _api?: AutoNavigationApi;

  private _snackbar?: Snackbar;

  getApi(): AutoNavigationApi {
    if (!this._api) {
      this._api = this.props.container.get<AutoNavigationApi>(AutoNavigationApi);
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

  onAutoPlayEnabled(e: Event): void {
    const target = e.target as HTMLInputElement;
    const checked = target.checked;

    this.getApi().setState(checked ? AutoNavigationState.Enabled : AutoNavigationState.Disabled);

    this.showSnackbar();
  }

  render(props: IContainerProps) {
    const onEnableChange = (e: Event) => this.onEnableChange(e);
    const onAutoPlayEnabled = (e: Event) => this.onAutoPlayEnabled(e);

    const api = this.getApi();

    return (
      <div>
        <h2>Auto Navigation</h2>
        <div>
          <Formfield>
            <Checkbox id="enable" onChange={onEnableChange} checked={api.isEnabled()}></Checkbox>
            <label for="enable">Enable Force Auto Navigation</label>
          </Formfield>
        </div>
        <div>
          <Formfield>
            <Checkbox id="enable_autoplay" onChange={onAutoPlayEnabled} checked={api.getState() === AutoNavigationState.Enabled}></Checkbox>
            <label for="enable_autoplay">Whether to set YouTube to auto-play next video or not</label>
          </Formfield>
        </div>

        <Snackbar ref={(el: any) => { this._snackbar = el as Snackbar; }} />
      </div>
    );
  }
}