import MangaParse from "./MangaParse";
import ReadkomikParse from "./ReadkomikParse";
import AsurascansParse from "./AsurascansParse";
import ReaperscanParse from "./ReaperscanParse";
import MangaowlParse from "./MangaowlParse";

class Parser {
  protected parsersList: MangaParse[] = [
    new ReadkomikParse(),
    new AsurascansParse(),
    new ReaperscanParse(),
    new MangaowlParse(),
  ];

  public parse(url: string, html: string) {
    const hostname = new URL(url).hostname;

    for (const parser of this.parsersList) {
      if (parser.getHostname() === hostname) {
        return parser.getChaptersList(html);
      }
    }
    console.log(`Nieobsługiwany parser dla adresu: ${url}`);
    return [];
  }
}

export default Parser;
