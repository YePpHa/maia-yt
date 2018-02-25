import { h, render as pRender } from 'preact';
import { Component } from '../../components/Component';
import { onSettingsReactRegister } from '../../components/IComponent';

export function render(components: Component[]) {
  let componentCards: JSX.Element[] = [];
  components.forEach(m => {
    const instance = (m as any) as onSettingsReactRegister;
    if (typeof instance.onSettingsReactRegister === 'function') {
      let settings = instance.onSettingsReactRegister();
      componentCards.push(settings.getElement());
    }
  });

  const element = (
    <div>
      <h1>Maia Settings</h1>
      <div>
        {componentCards}
      </div>
    </div>
  );

  pRender(element, document.body);
}