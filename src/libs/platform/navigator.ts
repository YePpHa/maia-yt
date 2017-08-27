export const NAVIGATOR: string = (window.navigator && window.navigator.userAgent) || '';
export const isMac: boolean = NAVIGATOR.indexOf('Macintosh') !== -1;