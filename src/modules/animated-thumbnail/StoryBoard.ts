import { Rect } from "../../libs/math/Rect";
import { Size } from "../../libs/math/Size";

export class StoryBoard {
  public items: StoryBoardItem[] = [];

  constructor(spec: string) {
    let [ baseUrl , ...parts ] = spec.split("|");
    
    for (let i = 0; i < parts.length; i++) {
      let [
        width, height, frames, columns, rows, interval, urlPattern, signature
      ] = parts[i].split("#");

      this.items.push(
        new StoryBoardItem(
          baseUrl, i, parseFloat(width), parseFloat(height),
          parseInt(frames, 10), parseInt(columns, 10), parseInt(rows, 10),
          parseInt(interval, 10), urlPattern, signature
        )
      );
    }
  }
}

export class StoryBoardItem {
  constructor(
    public baseUrl: string,
    public index: number,
    public width: number,
    public height: number,
    public frames: number,
    public columns: number,
    public rows: number,
    public interval: number,
    public urlPattern: string,
    public signature: string
  ) {}

  getNumberOfMosaic(): number {
    return Math.ceil(this.frames/(this.rows*this.columns));
  }

  getMosaic(frame: number) {
    return Math.floor(frame/this.rows*this.columns);
  }

  getUrl(frame: number): string {
    return this.baseUrl
      .replace("$L", this.index.toString())
      .replace("$N", this.urlPattern)
      .replace("$M", frame.toString())
      + "?sigh=" + encodeURIComponent(this.signature);
  }

  getUrls(): string[] {
    let urls: string[] = [];

    const length = this.getNumberOfMosaic();
    for (let i = 0; i < length; i++) {
      urls.push(this.getUrl(i));
    }

    return urls;
  }

  getRect(frame: number): Rect {
    let areaRest = frame % (this.rows * this.columns);
    return new Rect(
      this.width * (areaRest % this.columns),
      this.height * Math.floor(areaRest / this.rows),
      this.width,
      this.height
    );
  }

  getImageSize(): Size {
    return new Size(
      this.width * this.columns,
      this.height * this.rows
    );
  }
}