import { Component, h } from "preact";

import Formfield from 'preact-material-components/FormField';
import Checkbox from 'preact-material-components/Checkbox';
import Select from 'preact-material-components/Select';
import { QualityApi } from "../../modules/quality/api";
import { PlaybackQuality } from "../../youtube/PlayerApi";

import * as style from '../../../style/settings.scss';

type SelectOnChangeEvent = Event & {target: EventTarget & {selectedIndex: number}};

const qualityOptions: { value: PlaybackQuality, text: string }[] = [
  { value: PlaybackQuality.Auto, text: 'Auto' },
  { value: PlaybackQuality.Highres, text: 'Highres' },
  { value: PlaybackQuality.HD2160, text: '2160p' },
  { value: PlaybackQuality.HD1440, text: '1440p' },
  { value: PlaybackQuality.HD1080, text: '1080p' },
  { value: PlaybackQuality.HD720, text: '720p' },
  { value: PlaybackQuality.Large, text: '480p' },
  { value: PlaybackQuality.Medium, text: '360p' },
  { value: PlaybackQuality.Small, text: '240p' },
  { value: PlaybackQuality.Tiny, text: '144p' }
];

export class QualityRoute extends Component<{}, {}> {
  private _api: QualityApi;
  
  public constructor(api: QualityApi) {
    super();

    this._api = api;
  }

  public onEnableChange(e: Event): void {
    const target = e.target as HTMLInputElement;
    const checked = target.checked;

    this._api.setEnabled(checked);
  }

  public onPreferHigherQuality(e: Event): void {
    const target = e.target as HTMLInputElement;
    const checked = target.checked;

    this._api.setBetterQualityPreferred(checked);
  }

  public onQualityChange(e: SelectOnChangeEvent): void {
    this._api.setQuality(qualityOptions[e.target.selectedIndex].value);
  }

  public render() {
    const onEnableChange = (e: Event) => this.onEnableChange(e);
    const onPreferHigherQuality = (e: Event) => this.onPreferHigherQuality(e);
    
    const onQualityChange = (e: SelectOnChangeEvent) => this.onQualityChange(e);

    const currentQuality = this._api.getQuality();
    let qualityIndex = 0;
    for (let i = 0; i < qualityOptions.length; i++) {
      if (qualityOptions[i].value === currentQuality) {
        qualityIndex = i;
        break;
      }
    }

    return (
      <div>
        <h2>Quality</h2>
        <div>
          <Formfield>
            <Checkbox id="enable" onChange={onEnableChange} checked={this._api.isEnabled()}></Checkbox>
            <label for="enable">Enable quality</label>
          </Formfield>
        </div>
        <div>
          <Formfield>
            <Checkbox id="prefer_higher_quality" onChange={onPreferHigherQuality} checked={this._api.isBetterQualityPreferred()}></Checkbox>
            <label for="prefer_higher_quality">Prefer higher quality</label>
          </Formfield>
        </div>

        <div class={style.locals['select-container']}>
          <Select class={style.locals.select} hintText="Select prefered quality" onChange={onQualityChange} selectedIndex={qualityIndex}>
            {qualityOptions.map(({ value, text }) => (
              <Select.Item>{text}</Select.Item>
            ))}
          </Select>
        </div>
      </div>
    );
  }
}