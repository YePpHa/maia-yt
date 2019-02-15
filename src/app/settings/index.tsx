import { render, h } from "preact";

import Router from 'preact-router';

import TopAppBar from 'preact-material-components/TopAppBar';
import Drawer from 'preact-material-components/Drawer';
import List from 'preact-material-components/List';

import * as style from '../../style/settings.scss';
import * as mdc from 'preact-material-components/style.css';
import { IRoute } from "./IRoute";

export class Settings {
  private _routes: IRoute[];

  constructor(routes: IRoute[]) {
    this._routes = routes;
  }

  render(baseUrl = "") {
    const element = (
      <div>
        <TopAppBar onNav={() => {}}>
          <TopAppBar.Row>
            <TopAppBar.Section align-start>
              <TopAppBar.Title>
                Maia settings
              </TopAppBar.Title>
            </TopAppBar.Section>
          </TopAppBar.Row>
        </TopAppBar>
        <div class={style.locals.content}>
          <Drawer>
            <Drawer.DrawerContent>
              <List>
                {this._routes.map(({text, path}) => (
                  <List.LinkItem href={baseUrl + path}>{text}</List.LinkItem>
                ))}
              </List>
            </Drawer.DrawerContent>
          </Drawer>
          <main class={style.locals.main}>
            <Router>
              {this._routes.map(({element: Element, path}) => (
                <Element path={baseUrl + path} />
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