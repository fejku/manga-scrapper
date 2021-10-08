import puppeteer from "puppeteer";
import dotenv from "dotenv";

dotenv.config();

import IManga from "./interface/IManga";
import IChapter from "./interface/IChapter";

import pool from "./dbconfig/dbconnector";
import Parser from "./mangaParse/Parser";

const pobierzOstatnioOdswiezonaMange = async () => {
  let result: IManga | null = null;

  const client = await pool.connect();
  try {
    const { rows } = await client.query(
      "select * from manga.manga order by data_ostatniej_aktualizacji asc nulls first limit 1"
    );

    if (rows.length > 0) {
      result = rows[0];
    }
  } catch (error) {
    console.log("pobierzUrlOstatniejMangi: " + error);
    throw error;
  } finally {
    client.release();
  }

  return result;
};
const dajHtmlMangi = async (url: string) => {
  let result = "";

  const browser = await puppeteer.launch();

  try {
    const page = await browser.newPage();
    await page.goto(url);

    result = await page.content();
  } catch (error) {
    console.log("pobierzListeChapterow: " + error);
  } finally {
    await browser.close();
  }

  return result;
};
const wyczyscChaptery = async (mangaId: number) => {
  const client = await pool.connect();
  try {
    await client.query("delete from manga.chapter where fk_manga = $1", [mangaId]);
  } catch (error) {
    console.log("wyczyscChaptery: " + error);
    throw error;
  } finally {
    client.release();
  }
};
const zapiszChapter = async (mangaId: number, chapter: IChapter) => {
  const client = await pool.connect();
  try {
    await client.query("insert into manga.chapter(fk_manga, url, numer, data_dodania) values($1, $2, $3, $4)", [
      mangaId,
      chapter.chapterLink,
      chapter.chapterNumber,
      chapter.chapterDate,
    ]);
  } catch (error) {
    console.log("zapiszChapter: " + error);
    throw error;
  } finally {
    client.release();
  }
};
const uaktualnijDateOdswiezenia = async (mangaId: number) => {
  const client = await pool.connect();
  try {
    await client.query("update manga.manga set data_ostatniej_aktualizacji = now() where id = $1", [mangaId]);
  } catch (error) {
    console.log("uaktualnijDateOdswiezenia: " + error);
    throw error;
  } finally {
    client.release();
  }
};
const start = async () => {
  const manga = await pobierzOstatnioOdswiezonaMange();

  if (manga) {
    try {
      const html = await dajHtmlMangi(manga.url);
      const parser = new Parser();
      const listaChapterow = parser.parse(manga.url, html);

      if (listaChapterow.length > 0) {
        await wyczyscChaptery(manga.id);

        for (const chapter of listaChapterow) {
          await zapiszChapter(manga.id, chapter);
        }

        await uaktualnijDateOdswiezenia(manga.id);
      }
    } catch (error) {
      console.log(error);
    } finally {
      await pool.end();
    }
  }
};

start();
