import { render, h, Component } from "preact";
import { injectable, multiInject, Container } from "inversify";
import { ISettingsReact } from "../settings-storage/ISettings";

import Router from 'preact-router';

import TopAppBar from 'preact-material-components/TopAppBar';
import Drawer from 'preact-material-components/Drawer';
import List from 'preact-material-components/List';

import * as style from '../../style/settings.scss';
import * as mdc from 'preact-material-components/style.css';
import { Adblock } from "./routes/Adblock";
import { AutoNavigation } from "./routes/AutoNavigation";
import { AutoPlay } from "./routes/AutoPlay";
import { PlayerElementsFocus } from "./routes/PlayerElementsFocus";
import { Quality } from "./routes/Quality";

@injectable()
export class Settings {
  private _container: Container;

  constructor(container: Container) {
    this._container = container;
  }

  render(baseUrl = "") {
    const routes: { text: string, path: string, component: (new(...args: any[]) => Component<any, any>) }[] = [
      { text: 'Adblock', path: '/adblock', component: Adblock },
      { text: 'Auto navigation', path: '/auto-navigation', component: AutoNavigation },
      { text: 'Auto play', path: '/auto-play', component: AutoPlay },
      { text: 'Player elements focus', path: '/player-elements-focus', component: PlayerElementsFocus },
      { text: 'Quality', path: '/quality', component: Quality }
    ];

    const element = (
      <div>
        <TopAppBar>
          <TopAppBar.Row>
            <TopAppBar.Section align-start>
              <TopAppBar.Title>
                Maia settings
              </TopAppBar.Title>
            </TopAppBar.Section>
          </TopAppBar.Row>
        </TopAppBar>
        <div class={style.locals.content}>
          <Drawer.PermanentDrawer>
            <Drawer.DrawerContent>
              <List>
                {routes.map(({text, path}) => (
                  <List.LinkItem href={baseUrl + path}>{text}</List.LinkItem>
                ))}
              </List>
            </Drawer.DrawerContent>
          </Drawer.PermanentDrawer>
          <main class={style.locals.main}>
            <Router>
              {routes.map(({component: Element, path}) => (
                <Element path={baseUrl + path} container={this._container} />
              ))}
            </Router>
          </main>
        </div>
      </div>
    );

    // Render styles
    style.use();
    mdc.use();

    // Render HTML
    render(element, document.body);
  }
}