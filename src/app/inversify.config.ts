import { Container, injectable, decorate } from "inversify";
import { components } from "./components";
import { Component } from "./components/Component";
import { App } from "./App";
import { EventTarget } from "./libs/events/EventTarget";
import { ElementComponent } from "./libs/ElementComponent";
import { Disposable } from "./libs/Disposable";

decorate(injectable(), Disposable);
decorate(injectable(), EventTarget);
decorate(injectable(), ElementComponent);

const container = new Container({
  autoBindInjectable: true
});

export default container;