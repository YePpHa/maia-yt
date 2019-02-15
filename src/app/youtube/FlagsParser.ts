export class FlagsParser {
  private _flags: {[key: string]: string};

  constructor(flags: string|undefined) {
    this._flags = FlagsParser.stringToFlags(flags);
  }

  setValue(name: string, value: string): void {
    this._flags[name] = value;
  }

  getValue(name: string): string|undefined {
    if (this._flags.hasOwnProperty(name)) {
      return this._flags[name];
    }
    return undefined;
  }

  toString() {
    return FlagsParser.flagsToString(this._flags);
  }

  private static _encodeModule(value: string): string {
    return encodeURIComponent(value.replace(/\+/g, " "));
  }

  private static _decodeModule(value: string): string {
    return decodeURIComponent(value).replace(/\+/g, " ");
  }

  private static flagsToString(flags: {[key: string]: string}): string {
    const tokens: string[] = [];
    for (let key in flags) {
      if (flags.hasOwnProperty(key)) {
        tokens.push(FlagsParser._encodeModule(key) + "=" + FlagsParser._encodeModule(flags[key]));
      }
    }

    return tokens.join("&");
  }

  private static stringToFlags(raw: string|undefined): {[key: string]: string} {
    if (!raw) return {};

    const flags: {[key: string]: string} = {};

    let tokens = raw.split("&");
    for (let i = 0; i < tokens.length; i++) {
      const [key, value] = tokens[i].split("=");

      flags[this._decodeModule(key || "")] = this._decodeModule(value || "");
    }

    return flags;
  }
}