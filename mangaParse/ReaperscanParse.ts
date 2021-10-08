import * as cheerio from "cheerio";

import MangaParse from "./MangaParse";

class ReaperscanParse extends MangaParse {
  public getHostname(): string {
    return "reaperscans.com";
  }

  protected getChapters($: cheerio.CheerioAPI): cheerio.Cheerio<cheerio.Element> {
    return $(".listing-chapters_wrap > ul > li");
  }

  protected getChapterNumber(element: cheerio.Cheerio<cheerio.Element>) {
    return element.find("a").text().trim().split(" ")[1];
  }

  protected getChapterDate(element: cheerio.Cheerio<cheerio.Element>) {
    const date = element.find(".chapter-release-date > i").text();
    return new Date(date).toISOString().split("T")[0];
  }

  protected getChapterLink(element: cheerio.Cheerio<cheerio.Element>) {
    return element.find("a").attr("href") || "";
  }

  protected isReversedChapters() {
    return true;
  }
}

export default ReaperscanParse;
