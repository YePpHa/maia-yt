import { h, render as pRender } from 'preact';
import { Module } from '../../modules/Module';
import { onSettingsReactRegister } from '../../modules/IModule';
import Toolbar from 'preact-material-components/Toolbar';
import Drawer from 'preact-material-components/Drawer';
import List from 'preact-material-components/List';

import * as style from '../../style/settings.scss';
import * as mdc from 'preact-material-components/style.css';

export function render(modules: Module[]) {
  style.use();
  mdc.use();

  const moduleCards: JSX.Element[] = [];
  const moduleLinks: JSX.Element[] = [];

  modules.forEach(m => {
    const instance = (m as any) as onSettingsReactRegister;
    if (typeof instance.onSettingsReactRegister === 'function') {
      let settings = instance.onSettingsReactRegister();
      moduleCards.push(settings.getElement());

      const onClick = (e: Event) => {
        e.preventDefault();

        
      };

      moduleLinks.push(
        <Drawer.DrawerItem href="#" onClick={onClick}>
          {settings.getTitle()}
        </Drawer.DrawerItem>
      );
    }
  });

  const element = (
    <div>
      <Toolbar fixed={true}>
        <Toolbar.Row>
          <Toolbar.Section align-start={true}>
            <Toolbar.Title>
              Maia Settings
            </Toolbar.Title>
          </Toolbar.Section>
        </Toolbar.Row>
      </Toolbar>
      <div class={style.locals.content + " mdc-toolbar-fixed-adjust"}>
        <Drawer.PermanentDrawer>
          {moduleLinks}
        </Drawer.PermanentDrawer>
        <main>
          {moduleCards}
        </main>
      </div>
    </div>
  );

  pRender(element, document.body);
}