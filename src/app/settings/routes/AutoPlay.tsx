import { Component, h } from "preact";
import { IContainerProps } from "../IContainerProps";

import Formfield from 'preact-material-components/FormField';
import Checkbox from 'preact-material-components/Checkbox';
import Snackbar from 'preact-material-components/Snackbar';
import Select from 'preact-material-components/Select';
import { AutoPlayApi, AutoPlayMode } from "../../components/autoplay/api";

import * as style from '../../../style/settings.scss';

type SelectOnChangeEvent = Event & {target: EventTarget & {selectedIndex: number}};

export class AutoPlay extends Component<IContainerProps, {}> {
  private _api?: AutoPlayApi;

  private _snackbar?: Snackbar;

  getApi(): AutoPlayApi {
    if (!this._api) {
      this._api = this.props.container.get<AutoPlayApi>(AutoPlayApi);
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

  onEnableChannelsChange(e: Event): void {
    const target = e.target as HTMLInputElement;
    const checked = target.checked;

    this.getApi().setChannelEnabled(checked);

    this.showSnackbar();
  }

  onModeChange(e: SelectOnChangeEvent): void {
    this.getApi().setMode(e.target.selectedIndex === 0 ? AutoPlayMode.Pause : AutoPlayMode.Stop);

    this.showSnackbar();
  }

  onChannelModeChange(e: SelectOnChangeEvent): void {
    this.getApi().setChannelMode(e.target.selectedIndex === 0 ? AutoPlayMode.Pause : AutoPlayMode.Stop);

    this.showSnackbar();
  }

  render(props: IContainerProps) {
    const onEnableChange = (e: Event) => this.onEnableChange(e);
    const onEnableChannelsChange = (e: Event) => this.onEnableChannelsChange(e);
    
    const onModeChange = (e: SelectOnChangeEvent) => this.onModeChange(e);
    const onChannelModeChange = (e: SelectOnChangeEvent) => this.onChannelModeChange(e);

    const api = this.getApi();

    return (
      <div>
        <h2>Auto-play</h2>
        <div>
          <Formfield>
            <Checkbox id="enable" onChange={onEnableChange} checked={api.isEnabled()}></Checkbox>
            <label for="enable">Enable prevent auto-play</label>
          </Formfield>
        </div>
        <div class={style.locals['select-container']}>
          <Select class={style.locals.select} hintText="Mode of prevent auto-play" onChange={onModeChange} selectedIndex={api.getMode() === AutoPlayMode.Pause ? 0 : 1}>
            <Select.Item>Pause (Allow buffering)</Select.Item>
            <Select.Item>Stop (No buffering)</Select.Item>
          </Select>
        </div>

        <div>
          <Formfield>
            <Checkbox id="enable_channels" onChange={onEnableChannelsChange} checked={api.isChannelEnabled()}></Checkbox>
            <label for="enable_channels">Enable prevent auto-play on channels</label>
          </Formfield>
        </div>

        <div class={style.locals['select-container']}>
          <Select class={style.locals.select} hintText="Mode of prevent channel auto-play" onChange={onChannelModeChange} selectedIndex={api.getChannelMode() === AutoPlayMode.Pause ? 0 : 1}>
            <Select.Item>Pause (Allow buffering)</Select.Item>
            <Select.Item>Stop (No buffering)</Select.Item>
          </Select>
        </div>

        <Snackbar ref={(el: any) => { this._snackbar = el as Snackbar; }} />
      </div>
    );
  }
}