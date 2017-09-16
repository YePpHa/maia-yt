import { ISettingsReact } from "../../settings/ISettings";
import { ISettingsStorage } from "../../settings/ISettingsStorage";
import * as React from 'react';
import { Checkbox } from '../../ui/checkbox';

export class Settings implements ISettingsReact {
  private _storage: ISettingsStorage;

  constructor(storage: ISettingsStorage) {
    this._storage = storage;
  }

  getStorage(): ISettingsStorage {
    return this._storage;
  }

  getElement(): JSX.Element {
    const onEnableChange = (checked: boolean) => {
      this.getStorage().set("enabled", checked);
    };
    const enabled: boolean = this.getStorage().get("enabled", false);

    return (
      <div>
        <div>
          <Checkbox
            label="Enable prevent auto-play"
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