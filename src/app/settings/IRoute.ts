import { Component } from "preact";
import { Newable } from "../../models/Newable";

export interface IRoute {
  text: string;
  path: string;
  element: Newable<Component<any, any>>;
}