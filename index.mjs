import express from "express";
import { resolve } from "path";
import cors from "cors";
import axios from "axios";
import fetch from "node-fetch";
import requestAsync from "request-promise";

import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import builder from "xmlbuilder";

const __dirname = dirname(fileURLToPath(import.meta.url));

import cheerio from "cheerio";
import https from "https";
const root = "https://www.daitangkinh.org";
const url =
  "/index.php/nikaya-pdf-mp3/nikaya-pdf-mp3/45-nikaya/nikaya/532-nikaya-pdf-mp3";
const instance = axios.create({
  baseURL: "https://www.daitangkinh.org",
  timeout: 60000,
  maxContentLength: 500 * 1000 * 1000,
  headers: {},
});

async function fetchMP3Links() {
  const response = await fetch(`${root}${url}`, {
    method: "get",
  });
  const data = await response.text();
  // const data =  await instance.get(url).then(res => res?.data)
  // const data = await instance.get(url);

  const $ = cheerio.load(data);
  const mp3Links = [];

  $("a").each((i, element) => {
    const link = $(element).attr("href");
    if (link && link?.trim()?.endsWith(".mp3")) {
      const linkMp3 = link?.trim().replace("/	", "");
      console.log("<<<<<<<<<<<<i", i, linkMp3);
      mp3Links.push(`${root}${encodeURI(linkMp3)}`);
    }
  });

  return mp3Links;
}

const app = express();
const port = 3010;

app.use(express.static("static"));
app.use(cors());

app.get("/", (req, res) => {
  res.sendFile(resolve(__dirname, "pages/index.html"));
});

app.get("/kinh-nikaya.xspf", async (req, res) => {
  const links = await fetchMP3Links();
  const doc = builder.create("playlist");
  doc.att("xmlns", "http://xspf.org/ns/0/");
  doc.att("xmlns:vlc", "http://www.videolan.org/vlc/playlist/ns/0/");
  doc.ele("title", "Kinh Nikaya");
  const trackList = doc.ele("trackList");
  links.forEach((link, index) => {
    trackList.ele("track").ele("location").txt(link).up();
  });

  const xml = doc.end({ pretty: true });
  res.setHeader("Content-Type", "application/xspf+xml");
  res.send(xml);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
