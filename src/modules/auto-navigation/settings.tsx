import { ISettingsReact } from "../../settings/ISettings";
import { h } from 'preact';
import { Api } from "./api";
import { AutoNavigationState } from "../../app/youtube/PlayerApi";
import Checkbox from 'preact-material-components/Checkbox';
import Formfield from 'preact-material-components/FormField';
import Select from 'preact-material-components/Select';

export class Settings implements ISettingsReact {
  constructor(private api: Api) {}

  getTitle(): string {
    return "Auto Navigation";
  }

  getElement(): JSX.Element {
    const onEnableChange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      this.api.setEnabled(target.checked);
    };
    const onStateChange = (e: { selectedIndex: number; selectedOptions: NodeListOf<Element>; }) => {
      this.api.setState(states[e.selectedIndex]);
    };

    const enabled: boolean = this.api.isEnabled();
    const state: AutoNavigationState = this.api.getState();

    const states: AutoNavigationState[] = [
      AutoNavigationState.DISABLED,
      AutoNavigationState.ENABLED
    ];

    return (
      <div>
        <h2>Auto Navigation</h2>
        <div>
          <Formfield>
            <Checkbox
              id="auto-navigation-enable"
              disabled={false}
              indeterminate={false}
              checked={enabled}
              onChange={onEnableChange}
            />
            <label for="auto-navigation-enable">Enable Force Auto Navigation</label>
          </Formfield>
        </div>
        <div>
          <Select
            hintText="State"
            disabled={false}
            onChange={onStateChange}
            selectedIndex={states.indexOf(state)}>
            <Select.Item>
              Disabled
            </Select.Item>
            <Select.Item>
              Enabled
            </Select.Item>
          </Select>
        </div>
      </div>
    );
  }
}