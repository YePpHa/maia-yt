import { ISettingsReact } from "../../settings/ISettings";
import { h } from 'preact';
import { Checkbox } from '../../ui/checkbox';
import { Api } from "./api";

export class Settings implements ISettingsReact {
  constructor(private api: Api) {}

  getTitle(): string {
    return "Player Focus";
  }

  getElement(): JSX.Element {
    const onEnableChange = (checked: boolean) => {
      this.api.setEnabled(checked);
    };
    const onGlobalShortcutsEnabled = (checked: boolean) => {
      this.api.setGlobalShortcutsEnabled(checked);
    };
    const enabled: boolean = this.api.isEnabled();
    const globalShortcutsEnabled: boolean  = this.api.isGlobalShortcutsEnabled();

    return (
      <div>
        <h2>Player elements focus</h2>
        <div>
          <Checkbox
            label="Prevent player elements from getting focus"
            disabled={false}
            indeterminate={false}
            checked={enabled}
            onChange={onEnableChange}
          />
        </div>
        <div>
          <Checkbox
            label="Make player shortcuts global"
            disabled={false}
            indeterminate={false}
            checked={globalShortcutsEnabled}
            onChange={onGlobalShortcutsEnabled}
          />
        </div>
      </div>
    );
  }
}