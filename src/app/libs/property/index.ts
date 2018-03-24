export function getObjectByName(name: string, obj?: Object): any {
  let parts = name.split('.');
  let cur: any = obj || window;
  for (let i = 0; i < parts.length; i++) {
    cur = cur[parts[i]];
    if (cur === null) {
      return null;
    }
  }
  return cur;
}