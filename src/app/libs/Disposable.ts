export class Disposable {
  private _disposed: boolean = false;
  private _onDisposeCallbacks: Function[] = [];

  protected disposeInternal() {
    while (this._onDisposeCallbacks.length) {
      (this._onDisposeCallbacks.shift() as Function)();
    }
  }

  dispose() {
    if (this.isDisposed()) return;
    this._disposed = true;

    this.disposeInternal();
  }

  isDisposed(): boolean {
    return this._disposed;
  }

  addOnDisposeCallback(callback: Function, scope?: Object): void {
    if (this._disposed) {
      scope !== undefined ? callback.call(scope) : callback();
      return;
    }
    this._onDisposeCallbacks.push(
      scope !== undefined ? callback.bind(scope) : callback
    );
  }
}