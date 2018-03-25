import { Container, injectable, decorate } from "inversify";
import { default as apis, ApiProvider } from "./apis.provider";
import { default as components, ComponentProvider } from "./components.provider";
import { ISettingsReact } from "../app/settings-storage/ISettings";

const container = new Container({
  autoBindInjectable: true
});

container.bind<Container>(Container).toConstantValue(container);

for (let i = 0; i < apis.length; i++) {
  container.bind(ApiProvider).to(apis[i]);
}

for (let i = 0; i < components.length; i++) {
  container.bind(ComponentProvider).to(components[i]);
}

export default container;