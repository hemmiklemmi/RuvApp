// TODO importa því sem nota þarf
//import { doc } from 'prettier';
import { el } from './lib/helpers.js';
import { fetchNews,cache } from './lib/news.js';
import { fetchAndRenderCategory, fetchAndRenderLists } from './lib/ui.js';

//const { getSupportInfo } = require('prettier');

/** Fjöldi frétta til að birta á forsíðu */
const CATEGORY_ITEMS_ON_FRONTPAGE = 5;

/** Vísun í <main> sem geymir allt efnið og við búum til element inn í */
 const main = document.querySelector('main');

/**
 * Athugar útfrá url (`window.location`) hvað skal birta:
 * - `/` birtir yfirlit
 * - `/?category=X` birtir yfirlit fyrir flokk `X`
 */
async function route() {
  const url =(window.location);
  fetchAndRenderLists(main,5);

}

// Athugum hvort það sé verið að biðja um category í URL, t.d.
// /?category=menning

// Ef svo er, birtum fréttir fyrir þann flokk

// Annars birtum við „forsíðu“

/**
 * Sér um að taka við `popstate` atburð sem gerist þegar ýtt er á back takka í
 * vafra. Sjáum þá um að birta réttan skjá.
 */
window.onpopstate = () => {
  console.log('pop');
};

// Í fyrsta skipti sem vefur er opnaður birtum við það sem beðið er um út frá URL
route();
