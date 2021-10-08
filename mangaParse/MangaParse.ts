import * as cheerio from "cheerio";

import IChapter from "../interface/IChapter";

abstract class MangaParse {
  public abstract getHostname(): string;
  protected abstract getChapters($: cheerio.CheerioAPI): cheerio.Cheerio<cheerio.Element>;
  protected abstract getChapterNumber(element: cheerio.Cheerio<cheerio.Element>): string;
  protected abstract getChapterDate(element: cheerio.Cheerio<cheerio.Element>): string;
  protected abstract getChapterLink(element: cheerio.Cheerio<cheerio.Element>): string;

  protected isReversedChapters() {
    return false;
  }

  public getChaptersList(html: string): IChapter[] {
    const result: IChapter[] = [];

    const $ = cheerio.load(html);
    this.getChapters($).each((_, el) => {
      const elem = $(el);

      const chapterNumber = this.getChapterNumber(elem);
      const chapterDate = this.getChapterDate(elem);
      const chapterLink = this.getChapterLink(elem);

      result.push({ chapterNumber, chapterDate, chapterLink });
    });

    if (this.isReversedChapters()) {
      result.reverse();
    }

    return result;
  }
}

export default MangaParse;
