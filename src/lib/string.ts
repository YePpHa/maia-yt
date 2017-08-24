import { now } from './date';

export function getRandomString(): string {
  let x = 2147483648;
  return Math.floor(Math.random() * x).toString(36) +
      Math.abs(Math.floor(Math.random() * x) ^ now()).toString(36);
}