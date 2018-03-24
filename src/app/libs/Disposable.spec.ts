import { Disposable } from './Disposable';

describe('Disposable', () => {
  let dispose: Disposable = new Disposable();
  beforeEach(() => {
    dispose = new Disposable();
  });

  it("should be disposed if dispose os called", () => {
    dispose.dispose();
    expect(dispose.isDisposed()).toBe(true);
  });

  it("should call dispose callbacks when disposed", () => {
    const callback: Function = jasmine.createSpy("callback");
    dispose.addOnDisposeCallback(callback);

    dispose.dispose();

    expect(callback).toHaveBeenCalled();
  });
});