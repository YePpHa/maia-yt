import { MDCComponent } from "@material/base";

declare module "@material/checkbox" {
  export class MDCCheckbox extends MDCComponent<MDCCheckboxFoundation> {
    static attachTo(root)
  }
}