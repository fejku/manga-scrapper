import * as cheerio from "cheerio";

import MangaParse from "./MangaParse";

class MangaowlParse extends MangaParse {
  public getHostname(): string {
    return "mangaowl.net";
  }

  protected getChapters($: cheerio.CheerioAPI): cheerio.Cheerio<cheerio.Element> {
    return $(".table-chapter-list > ul > li");
  }

  protected getChapterNumber(element: cheerio.Cheerio<cheerio.Element>) {
    return element.find(".chapter-title").text().trim();
  }

  protected getChapterDate(element: cheerio.Cheerio<cheerio.Element>) {
    const date = element.find("small").text();
    return new Date(date).toISOString().split("T")[0];
  }

  protected getChapterLink(element: cheerio.Cheerio<cheerio.Element>) {
    return element.find("a").attr("href") || "";
  }

  protected isReversedChapters() {
    return true;
  }
}

export default MangaowlParse;
