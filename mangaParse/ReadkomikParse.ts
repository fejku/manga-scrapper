import * as cheerio from "cheerio";

import MangaParse from "./MangaParse";

class ReadkomikParse extends MangaParse {
  public getHostname(): string {
    return "readkomik.com";
  }

  protected getChapters($: cheerio.CheerioAPI): cheerio.Cheerio<cheerio.Element> {
    return $("#chapterlist > ul > li");
  }

  protected getChapterNumber(element: cheerio.Cheerio<cheerio.Element>) {
    return element.attr("data-num") || "";
  }

  protected getChapterDate(element: cheerio.Cheerio<cheerio.Element>) {
    const date = element.find(".chapterdate").text();
    return new Date(date).toISOString().split("T")[0];
  }

  protected getChapterLink(element: cheerio.Cheerio<cheerio.Element>) {
    return element.find("a").attr("href") || "";
  }

  protected isReversedChapters() {
    return true;
  }
}

export default ReadkomikParse;
