/**
 * Tricks Closure Compiler into believing that a function is pure. The compiler
 * assumes that any `valueOf` function is pure, without analyzing its contents.
 * @param fn 
 */
function purify<T>(fn: Function): T {
  return ({valueOf: fn}).valueOf();
}

const GLOBAL = window;

export const PASSIVE_EVENTS: boolean = purify(() => {
  // If we're in a web worker or other custom environment, we can't tell.
  if (!GLOBAL.addEventListener || !Object.defineProperty) {  // IE 8
    return false;
  }

  let passive = false;
  const options = Object.defineProperty({}, 'passive', {
    get: function() {
      passive = true;
    }
  });
  GLOBAL.addEventListener('test', () => {}, options);
  GLOBAL.removeEventListener('test', () => {}, options);

  return passive;
});