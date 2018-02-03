import { ISettingsReact } from "../../settings/ISettings";
import { h } from 'preact';
import { Api } from "./api";
import Checkbox from 'preact-material-components/Checkbox';
import Formfield from 'preact-material-components/FormField';

export class Settings implements ISettingsReact {
  constructor(private api: Api) {}

  getTitle(): string {
    return "Adblock";
  }

  getElement(): JSX.Element {
    let enable: Checkbox;

    const onEnableChange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      this.api.setEnabled(target.checked);
    };
    const onSubscribtionWhitelistChange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      this.api.setSubscribedChannelsWhitelisted(target.checked);
    };
    const enabled: boolean = this.api.isEnabled();
    const subscribedChannelsWhitelisted: boolean = this.api.isSubscribedChannelsWhitelisted();

    return (
      <div>
        <h2>Adblock</h2>
        <div>
          <Formfield>
            <Checkbox
              id="adblock-enable"
              disabled={false}
              indeterminate={false}
              checked={enabled}
              onChange={onEnableChange}
            />
            <label for="adblock-enable">Enable adblock</label>
          </Formfield>
        </div>
        <div>
          <Formfield>
            <Checkbox
              id="adblock-subscribed"
              disabled={false}
              indeterminate={false}
              checked={subscribedChannelsWhitelisted}
              onChange={onSubscribtionWhitelistChange}
            />
            <label for="adblock-subscribed">Whitelist subscribed channels</label>
          </Formfield>
        </div>
      </div>
    );
  }
}