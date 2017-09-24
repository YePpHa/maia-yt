import { ISettingsReact } from "../../settings/ISettings";
import * as React from 'react';
import { Checkbox } from '../../ui/checkbox';
import { Api } from "./api";

export class Settings implements ISettingsReact {
  constructor(private api: Api) {}

  getElement(): JSX.Element {
    const onEnableChange = (checked: boolean) => {
      this.api.setEnabled(checked);
    };
    const enabled: boolean = this.api.isEnabled();

    return (
      <div>
        <h2>Animated thumbnail</h2>
        <div>
          <Checkbox
            label="Enable animated thumbnail"
            disabled={false}
            indeterminate={false}
            checked={enabled}
            onChange={onEnableChange}
          />
        </div>
      </div>
    );
  }
}