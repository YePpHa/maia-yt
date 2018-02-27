export class FlagsParameters {
  private _flags: string;

  private _data: {[key: string]: string} = {};

  constructor(flags: string) {
    this._flags = flags;

    let data = this._flags.split("&").map(token => token.split("="));
    for (let i = 0; i < data.length; i++) {
      this._data[decodeURIComponent(data[i][0])] = decodeURIComponent(data[i][1]);
    }
  }

  get(name: string): string | undefined {
    return this._data[name];
  }

  set(name: string, value: string): void {
    this._data[name] = value;
  }

  remove(name: string): void {
    delete this._data[name];
  }

  toString(): string {
    let tokens: string[] = [];
    for (let key in this._data) {
      tokens.push(encodeURIComponent(key) + "=" + encodeURIComponent(this._data[key]));
    }

    return tokens.join("&");
  }
}