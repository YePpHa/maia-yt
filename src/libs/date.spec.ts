import * as date from './date';

describe('a date module', () => {
  it('should contain method now', () => {
    expect(date.now).toEqual(jasmine.any(Function));
  });

  describe('method now', () => {
    it('should return a number', () => {
      expect(date.now()).toEqual(jasmine.any(Number));
    });

    it('should return a number if using polyfill', () => {
      expect(date.polyfill.now()).toEqual(jasmine.any(Number));
    });
  });
});