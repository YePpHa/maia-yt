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

  private static _encodeComponent(value: string): string {
    return encodeURIComponent(value.replace(/\+/g, " "));
  }

  private static _decodeComponent(value: string): string {
    return decodeURIComponent(value).replace(/\+/g, " ");
  }

  private static flagsToString(flags: {[key: string]: string}): string {
    const tokens: string[] = [];
    for (let key in flags) {
      if (flags.hasOwnProperty(key)) {
        tokens.push(FlagsParser._encodeComponent(key) + "=" + FlagsParser._encodeComponent(flags[key]));
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

      flags[this._decodeComponent(key || "")] = this._decodeComponent(value || "");
    }

    return flags;
  }
}