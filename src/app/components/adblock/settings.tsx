import { ISettingsReact } from "../../settings-storage/ISettings";
import { h } from 'preact';
import { Checkbox } from '../../ui/checkbox';
import { AdblockApi } from "./api";
import { injectable } from "inversify";

@injectable()
export class AdblockSettings implements ISettingsReact {
  constructor(private api: AdblockApi) {}

  getElement(): JSX.Element {
    const onEnableChange = (checked: boolean) => {
      this.api.setEnabled(checked);
    };
    const onSubscribtionWhitelistChange = (checked: boolean) => {
      this.api.setSubscribedChannelsWhitelisted(checked);
    };
    const enabled: boolean = this.api.isEnabled();
    const subscribedChannelsWhitelisted: boolean = this.api.isSubscribedChannelsWhitelisted();

    return (
      <div>
        <h2>Adblock</h2>
        <div>
          <Checkbox
            label="Enable adblock"
            disabled={false}
            indeterminate={false}
            checked={enabled}
            onChange={onEnableChange}
          />
        </div>
        <div>
          <Checkbox
            label="Whitelist subscribed channels"
            disabled={false}
            indeterminate={false}
            checked={subscribedChannelsWhitelisted}
            onChange={onSubscribtionWhitelistChange}
          />
        </div>
      </div>
    );
  }
}