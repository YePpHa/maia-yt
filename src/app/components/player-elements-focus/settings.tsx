import { ISettingsReact } from "../../settings-storage/ISettings";
import { h } from 'preact';
import { Checkbox } from '../../ui/checkbox';
import { PlayerElementsFocusApi } from "./api";
import { injectable } from "inversify";

@injectable()
export class PlayerElementsFocusSettings implements ISettingsReact {
  constructor(private api: PlayerElementsFocusApi) {}

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