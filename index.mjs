import express from 'express';
import { resolve } from 'path';
import cors from 'cors'
import axios from 'axios';
import fetch from 'node-fetch';
import requestAsync from 'request-promise';

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
    
const __dirname = dirname(fileURLToPath(import.meta.url));

import cheerio from 'cheerio';
import https from 'https';
const root = 'https://www.daitangkinh.org'
const url = '/index.php/nikaya-pdf-mp3/nikaya-pdf-mp3/45-nikaya/nikaya/532-nikaya-pdf-mp3';
const instance = axios.create({ 
  baseURL: 'https://www.daitangkinh.org',
  timeout: 60000,
  maxContentLength: 500 * 1000 * 1000,
  headers: {}
})

async function fetchMP3Links() {
  console.log('<<<<<<<<<<<<instance', `${root}${url}`)
  const options = {
    method: "GET",
    uri: `${root}${url}`,
    body: {},
    json: true,
  };
  const res = await requestAsync(options)
  // const response = await fetch(`${root}${url}`, {
  //   method: 'get'
  // })
  // const data = await response.text()
  console.log('<<<<<<<<<<<<response', res)
  // const data =  await instance.get(url).then(res => res?.data)
  // const data = await instance.get(url);
  // const $ = cheerio.load(data);
  // const mp3Links = [];

  // $('a').each((i, element) => {
  //   const link = $(element).attr('href');
  //   if (link && link.endsWith('.mp3')) {
  //     mp3Links.push(link);
  //   }
  // });

  // console.log('<<<<<<<<<<<<data', data)

  // return mp3Links;
  return data
}


const app = express();
const port = 3010;

app.use(express.static('static'));
app.use(cors())

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.get('/mp3', async (req, res) => {
  const links = await fetchMP3Links()
  res.json(links);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
