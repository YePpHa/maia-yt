declare module "@material/base" {
  export class MDCFoundation<A = {}> {
    static cssClasses: Enumerator<string>;
    static strings: Enumerator<string>;
    static numbers: Enumerator<number>;
    static defaultAdapter: Object;
    constructor(adapter?: A);
    init(): void;
    destroy(): void;
  }
  export class MDCComponent<F = {}> {
    static attachTo(root: Element): MDCComponent;
    constructor(root: Element, foundation?: F, ...args: any[]);
    initialize(): void;
    getDefaultFoundation(): F;
    initialSyncWithDOM(): void;
    destroy(): void;
    listen(evtType: string, handler: Function): void;
    unlisten(evtType: string, handler: Function): void;
    emit(evtType: string, evtData: Object, shouldBubble?: boolean): void;
  }
}