export class Disposable {
  private _disposed: boolean = false;

  protected disposeInternal() {}

  dispose() {
    if (this.isDisposed()) return;
    this._disposed = true;

    this.disposeInternal();
  }

  isDisposed(): boolean {
    return this._disposed;
  }
}