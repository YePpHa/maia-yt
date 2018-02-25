import { ISettingsReact } from "../../settings/ISettings";
import { h } from 'preact';
import { Checkbox } from '../../ui/checkbox';
import { Select } from '../../ui/select';
import { Api } from "./api";
import { AutoNavigationState } from "../../app/youtube/PlayerApi";

export class Settings implements ISettingsReact {
  constructor(private api: Api) {}

  getElement(): JSX.Element {
    const onEnableChange = (checked: boolean) => {
      this.api.setEnabled(checked);
    };
    const onStateChange = (value: string) => {
      this.api.setState(parseInt(value, 10));
    };

    const enabled: boolean = this.api.isEnabled();
    const state: string = this.api.getState().toString();

    return (
      <div>
        <h2>Auto Navigation</h2>
        <div>
          <Checkbox
            label="Enable Force Auto Navigation"
            disabled={false}
            indeterminate={false}
            checked={enabled}
            onChange={onEnableChange}
          />
        </div>
        <div>
          <Select
            disabled={false}
            onChange={onStateChange}
            value={state}>
            <option value={AutoNavigationState.DISABLED.toString()}>Disabled</option>
            <option value={AutoNavigationState.ENABLED.toString()}>Enabled</option>
          </Select>
        </div>
      </div>
    );
  }
}