export interface ISettingsStorage {
  set(key: string, value: any): void
  get(key: string, defaultValue?: any): any;
  remove(key: string): void;

  updateCache(): Promise<void>;
}