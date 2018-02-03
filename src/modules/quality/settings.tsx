import { ISettingsReact } from "../../settings/ISettings";
import { h } from 'preact';
import { Checkbox } from '../../ui/checkbox';
import { Select } from '../../ui/select';
import { Api } from "./api";
import { PlaybackQuality } from "../../app/youtube/PlayerApi";

export class Settings implements ISettingsReact {
  constructor(private api: Api) {}

  getTitle(): string {
    return "Quality";
  }

  getElement(): JSX.Element {
    const onEnableChange = (checked: boolean) => {
      this.api.setEnabled(checked);
    };
    const onBetterQualityChange = (checked: boolean) => {
      this.api.setBetterQualityPreferred(checked);
    };
    const onQualityChange = (quality: PlaybackQuality) => {
      this.api.setQuality(quality);
    };
    const enabled: boolean = this.api.isEnabled();
    const betterQuality: boolean = this.api.isBetterQualityPreferred();
    const quality: PlaybackQuality = this.api.getQuality();

    return (
      <div>
        <h2>Quality</h2>
        <div>
          <Checkbox
            label="Enable quality"
            disabled={false}
            indeterminate={false}
            checked={enabled}
            onChange={onEnableChange}
          />
        </div>
        <div>
          <Checkbox
            label="Prefer higher quality"
            disabled={false}
            indeterminate={false}
            checked={betterQuality}
            onChange={onBetterQualityChange}
          />
        </div>
        <div>
          <label>
            Quality
            <Select
              disabled={false}
              onChange={onQualityChange}
              value={quality}>
              <option value="auto">Auto</option>
              <option value="highres">Highres</option>
              <option value="hd2160">2160p</option>
              <option value="hd1440">1440p</option>
              <option value="hd1080">1080p</option>
              <option value="hd720">720p</option>
              <option value="large">480p</option>
              <option value="medium">360p</option>
              <option value="small">240p</option>
              <option value="tiny">144p</option>
            </Select>
          </label>
        </div>
      </div>
    );
  }
}