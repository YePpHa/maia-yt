import { Component, h } from "preact";
import { IContainerProps } from "../IContainerProps";

import Formfield from 'preact-material-components/FormField';
import Checkbox from 'preact-material-components/Checkbox';
import Snackbar from 'preact-material-components/Snackbar';
import Select from 'preact-material-components/Select';
import { QualityApi } from "../../components/quality/api";
import { PlaybackQuality } from "../../youtube/PlayerApi";

import * as style from '../../../style/settings.scss';

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

export class Quality extends Component<IContainerProps, {}> {
  private _api?: QualityApi;

  private _snackbar?: Snackbar;

  getApi(): QualityApi {
    if (!this._api) {
      this._api = this.props.container.get<QualityApi>(QualityApi);
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

  onPreferHigherQuality(e: Event): void {
    const target = e.target as HTMLInputElement;
    const checked = target.checked;

    this.getApi().setBetterQualityPreferred(checked);

    this.showSnackbar();
  }

  onQualityChange(e: { selectedIndex: number; selectedOptions: NodeListOf<Element> }): void {
    this.getApi().setQuality(qualityOptions[e.selectedIndex].value);

    this.showSnackbar();
  }

  render(props: IContainerProps) {
    const onEnableChange = (e: Event) => this.onEnableChange(e);
    const onPreferHigherQuality = (e: Event) => this.onPreferHigherQuality(e);
    
    const onQualityChange = (e: { selectedIndex: number; selectedOptions: NodeListOf<Element> }) => this.onQualityChange(e);

    const api = this.getApi();

    const currentQuality = api.getQuality();
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
            <Checkbox id="enable" onChange={onEnableChange} checked={api.isEnabled()}></Checkbox>
            <label for="enable">Enable quality</label>
          </Formfield>
        </div>
        <div>
          <Formfield>
            <Checkbox id="prefer_higher_quality" onChange={onPreferHigherQuality} checked={api.isBetterQualityPreferred()}></Checkbox>
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

        <Snackbar ref={(el: any) => { this._snackbar = el as Snackbar; }} />
      </div>
    );
  }
}