import { empty } from './lib/helpers.js';
import { fetchAndRenderLists, handleClick } from './lib/ui.js';

/** Fjöldi frétta til að birta á forsíðu */
const CATEGORY_ITEMS_ON_FRONTPAGE = 5;

/** Vísun í <main> sem geymir allt efnið og við búum til element inn í */
export const main = document.querySelector('main');

/**
 * Athugar útfrá url (`window.location`) hvað skal birta:
 * - `/` birtir yfirlit
 * - `/?category=X` birtir yfirlit fyrir flokk `X`
 */
async function route() {
  const url = window.location;
  if (url.search === '') {
    fetchAndRenderLists(main, CATEGORY_ITEMS_ON_FRONTPAGE);
  } else {
    const search = url.search.split('=');
    handleClick(search[1], main, 20);
  }
}

// Athugum hvort það sé verið að biðja um category í URL, t.d.
// /?category=menning

// Ef svo er, birtum fréttir fyrir þann flokk

// Annars birtum við „forsíðu“

/**
 * Sér um að taka við `popstate` atburð sem gerist þegar ýtt er á back takka í
 * vafra. Sjáum þá um að birta réttan skjá.
 */
window.onpopstate = (e) => {
  const url = window.location;
  empty(main);
  if (e.state === null) {
    fetchAndRenderLists(main, 5);
  }
  if (e.state === 1) {
    const search = url.search.split('=');
    handleClick(search[1], main, 20);
  }
};

// Í fyrsta skipti sem vefur er opnaður birtum við það sem beðið er um út frá URL
route();
