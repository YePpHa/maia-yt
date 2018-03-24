import { render, h } from "preact";
import { injectable, multiInject } from "inversify";
import { SettingsProvider } from "../../config/settings.provider";
import { ISettingsReact } from "../settings-storage/ISettings";

@injectable()
export class Settings {
  private _settings: ISettingsReact[] = [];

  constructor(@multiInject(SettingsProvider) settings: ISettingsReact[]) {
    this._settings = settings;
  }

  render() {
    let componentCards: JSX.Element[] = [];
    this._settings.forEach(setting => {
      componentCards.push(setting.getElement());
    });

    const element = (
      <div>
        <h1>Maia Settings</h1>
        <div>
          {componentCards}
        </div>
      </div>
    );

    render(element, document.body);
  }
}