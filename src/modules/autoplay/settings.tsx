import { ISettingsReact } from "../../settings/ISettings";
import * as React from 'react';
import { Checkbox } from '../../ui/checkbox';
import { Select } from '../../ui/select';
import { AutoPlayMode } from "./index";
import { Api } from "./api";

export class Settings implements ISettingsReact {
  constructor(private api: Api) {}

  getElement(): JSX.Element {
    const onEnableChange = (checked: boolean) => {
      this.api.setEnabled(checked);
    };
    const onModeChange = (value: string) => {
      this.api.setMode(value as AutoPlayMode);
    };
    const enabled: boolean = this.api.isEnabled();
    const mode: string = this.api.getMode();

    return (
      <div>
        <h2>Prevent auto-play</h2>
        <div>
          <Checkbox
            label="Enable prevent auto-play"
            disabled={false}
            indeterminate={false}
            checked={enabled}
            onChange={onEnableChange}
          />
        </div>
        <div>
          <Select
            disabled={false}
            onChange={onModeChange}
            value={mode}>
            <option value="pause">Pause (Allow buffering)</option>
            <option value="stop">Stop (No buffering)</option>
          </Select>
        </div>
      </div>
    );
  }
}