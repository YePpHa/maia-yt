import { Component, h } from "preact";
import { IContainerProps } from "../IContainerProps";

import Formfield from 'preact-material-components/FormField';
import Checkbox from 'preact-material-components/Checkbox';
import Snackbar from 'preact-material-components/Snackbar';
import { PlayerElementsFocusApi } from "../../components/player-elements-focus/api";

export class PlayerElementsFocus extends Component<IContainerProps, {}> {
  private _api?: PlayerElementsFocusApi;

  private _snackbar?: Snackbar;

  getApi(): PlayerElementsFocusApi {
    if (!this._api) {
      this._api = this.props.container.get<PlayerElementsFocusApi>(PlayerElementsFocusApi);
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

  onGlobalShortcutsChange(e: Event): void {
    const target = e.target as HTMLInputElement;
    const checked = target.checked;

    this.getApi().setGlobalShortcutsEnabled(checked);

    this.showSnackbar();
  }

  render(props: IContainerProps) {
    const onEnableChange = (e: Event) => this.onEnableChange(e);
    const onGlobalShortcutsChange = (e: Event) => this.onGlobalShortcutsChange(e);

    const api = this.getApi();

    return (
      <div>
        <h2>Player elements focus</h2>
        <div>
          <Formfield>
            <Checkbox id="enable" onChange={onEnableChange} checked={api.isEnabled()}></Checkbox>
            <label for="enable">Prevent player elements from getting focus</label>
          </Formfield>
        </div>
        <div>
          <Formfield>
            <Checkbox id="global_shortcuts" onChange={onGlobalShortcutsChange} checked={api.isGlobalShortcutsEnabled()}></Checkbox>
            <label for="global_shortcuts">Make player shortcuts global</label>
          </Formfield>
        </div>

        <Snackbar ref={(el: any) => { this._snackbar = el as Snackbar; }} />
      </div>
    );
  }
}