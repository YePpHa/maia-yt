import { h, render as pRender } from 'preact';
import { Module } from '../../modules/Module';
import { onSettingsReactRegister } from '../../modules/IModule';

export function render(modules: Module[]) {
  let moduleCards: JSX.Element[] = [];
  modules.forEach(m => {
    const instance = (m as any) as onSettingsReactRegister;
    if (typeof instance.onSettingsReactRegister === 'function') {
      let settings = instance.onSettingsReactRegister();
      moduleCards.push(settings.getElement());
    }
  });

  const element = (
    <div>
      <h1>Maia Settings</h1>
      <div>
        {moduleCards}
      </div>
    </div>
  );

  pRender(element, document.body);
}