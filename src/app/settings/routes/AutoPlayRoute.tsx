import { Component, h } from "preact";

import Formfield from 'preact-material-components/FormField';
import Checkbox from 'preact-material-components/Checkbox';
import Select from 'preact-material-components/Select';
import { AutoPlayApi, AutoPlayMode } from "../../modules/autoplay/api";

import * as style from '../../../style/settings.scss';

type SelectOnChangeEvent = Event & {target: EventTarget & {selectedIndex: number}};

export class AutoPlayRoute extends Component<{}, {}> {
  private _api: AutoPlayApi;

  public constructor(api: AutoPlayApi) {
    super();
    this._api = api;
  }

  public onEnableChange(e: Event): void {
    const target = e.target as HTMLInputElement;
    const checked = target.checked;

    this._api.setEnabled(checked);
  }

  public onEnableChannelsChange(e: Event): void {
    const target = e.target as HTMLInputElement;
    const checked = target.checked;

    this._api.setChannelEnabled(checked);
  }

  public onModeChange(e: SelectOnChangeEvent): void {
    this._api.setMode(e.target.selectedIndex === 0 ? AutoPlayMode.Pause : AutoPlayMode.Stop);
  }

  public onChannelModeChange(e: SelectOnChangeEvent): void {
    this._api.setChannelMode(e.target.selectedIndex === 0 ? AutoPlayMode.Pause : AutoPlayMode.Stop);
  }

  public render() {
    const onEnableChange = (e: Event) => this.onEnableChange(e);
    const onEnableChannelsChange = (e: Event) => this.onEnableChannelsChange(e);
    
    const onModeChange = (e: SelectOnChangeEvent) => this.onModeChange(e);
    const onChannelModeChange = (e: SelectOnChangeEvent) => this.onChannelModeChange(e);

    return (
      <div>
        <h2>Auto-play</h2>
        <div>
          <Formfield>
            <Checkbox id="enable" onChange={onEnableChange} checked={this._api.isEnabled()}></Checkbox>
            <label for="enable">Enable prevent auto-play</label>
          </Formfield>
        </div>
        <div class={style.locals['select-container']}>
          <Select class={style.locals.select} hintText="Mode of prevent auto-play" onChange={onModeChange} selectedIndex={this._api.getMode() === AutoPlayMode.Pause ? 0 : 1}>
            <Select.Item>Pause (Allow buffering)</Select.Item>
            <Select.Item>Stop (No buffering)</Select.Item>
          </Select>
        </div>

        <div>
          <Formfield>
            <Checkbox id="enable_channels" onChange={onEnableChannelsChange} checked={this._api.isChannelEnabled()}></Checkbox>
            <label for="enable_channels">Enable prevent auto-play on channels</label>
          </Formfield>
        </div>

        <div class={style.locals['select-container']}>
          <Select class={style.locals.select} hintText="Mode of prevent channel auto-play" onChange={onChannelModeChange} selectedIndex={this._api.getChannelMode() === AutoPlayMode.Pause ? 0 : 1}>
            <Select.Item>Pause (Allow buffering)</Select.Item>
            <Select.Item>Stop (No buffering)</Select.Item>
          </Select>
        </div>
      </div>
    );
  }
}