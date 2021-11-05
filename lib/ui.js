import { fetchNews } from './news.js';
import {el} from './helpers.js';
/**
 * Föll sem sjá um að kalla í `fetchNews` og birta viðmót:
 * - Loading state meðan gögn eru sótt
 * - Villu state ef villa kemur upp við að sækja gögn
 * - Birta gögnin ef allt OK
 * Fyrir gögnin eru líka búnir til takkar sem leyfa að fara milli forsíðu og
 * flokks *án þess* að nota sjálfgefna <a href> virkni—við tökum yfir og sjáum
 * um sjálf með History API.
 */

/**
 * Sér um smell á flokk og birtir flokkinn *á sömu síðu* og við erum á.
 * Þarf að:
 * - Stoppa sjálfgefna hegðun <a href>
 * - Tæma `container` þ.a. ekki sé verið að setja efni ofan í annað efni
 * - Útbúa link sem fer til baka frá flokk á forsíðu, þess vegna þarf `newsItemLimit`
 * - Sækja og birta flokk
 * - Bæta við færslu í `history` þ.a. back takki virki
 *
 * Notum lokun þ.a. við getum útbúið föll fyrir alla flokka með einu falli. Notkun:
 * ```
 * link.addEventListener('click', handleCategoryClick(categoryId, container, newsItemLimit));
 * ```
 *
 * @param {string} id ID á flokk sem birta á eftir að smellt er
 * @param {HTMLElement} container Element sem á að birta fréttirnar í
 * @param {number} newsItemLimit Hámark frétta sem á að birta
 * @returns {function} Fall sem bundið er við click event á link/takka
 */
function handleCategoryClick(id, container, newsItemLimit) {
  return (e) => {
    e.preventDefault();
    let data = fetchNews(id);
    window.history.pushState(null, null, `/?category= $id `);
    // TODO útfæra
  };
}

/**
 * Eins og `handleCategoryClick`, nema býr til link sem fer á forsíðu.
 *
 * @param {HTMLElement} container Element sem á að birta fréttirnar í
 * @param {number} newsItemLimit Hámark frétta sem á að birta
 * @returns {function} Fall sem bundið er við click event á link/takka
 */
function handleBackClick(container, newsItemLimit) {
  return (e) => {
    e.preventDefault();

    // TODO útfæra
  };
}

/**
 * Útbýr takka sem fer á forsíðu.
 * @param {HTMLElement} container Element sem á að birta fréttirnar í
 * @param {number} newsItemLimit Hámark frétta sem á að birta
 * @returns {HTMLElement} Element með takka sem fer á forsíðu
 */
export function createCategoryBackLink(container, newsItemLimit) {
  // TODO útfæra
}

/**
 * Sækir grunnlista af fréttum, síðan hvern flokk fyrir sig og birtir nýjustu
 * N fréttir úr þeim flokk með `fetchAndRenderCategory()`
 * @param {HTMLElement} container Element sem mun innihalda allar fréttir
 * @param {number} newsItemLimit Hámark fjöldi frétta sem á að birta í yfirliti
 */
export async function fetchAndRenderLists(container, newsItemLimit) {
  // Byrjum á að birta loading skilaboð
  // Birtum þau beint á container
  // Sækjum yfirlit með öllum flokkum, hér þarf að hugsa um Promises!
  // Fjarlægjum loading skilaboð
  // Athugum hvort villa hafi komið upp => fetchNews skilaði null
  // Athugum hvort engir fréttaflokkar => fetchNews skilaði tómu fylki
  // Búum til <section> sem heldur utan um allt
  // Höfum ekki-tómt fylki af fréttaflokkum! Ítrum í gegn og birtum
  // Þegar það er smellt á flokka link, þá sjáum við um að birta fréttirnar, ekki default virknin
  //const allSections = document.querySelectorAll('.news');
  let h;
  const result = await fetchNews();
  for( let i = 0 ; i < 5; i++){
    h = document.createElement('section');
    h.classList.add('news');
    h.classList.add('newsList__item');
    const p = el('p', 'sæki gögn...');
    container.append(h);
    h.append(p);
  }
  container.classList.add('newsList__list');
  const allSections = document.querySelectorAll('.news');
  const allP = document.querySelectorAll('p');
  for( let j = 0 ; j < 5; j += 1){
    const section = el('section','');
    section.classList.add('news__list');
    allSections[j].append(section);
    //section.append(title);
    section.classList.add('hide');
    //const sectionparent = document.querySelectorAll('.news__list');
    if(result === null){
      for(let k = 0; k<allP.length; k++){
        allP.textContent = 'Villa kom upp';
      }
    }
    else{
      let getNewslist = await fetchAndRenderCategory(result[j].id,allSections[j],"","");
      if(getNewslist !== null){
        section.classList.remove('hide');
      }
      else{
        allP[j].textContent= 'Villa kom upp';
      }
      //section.classList.remove('hide');
    }
    const newA = el('a', 'Allar fréttir')
    newA.href = result[j].id;
    newA.classList.add('news__links');
    newA.classList.add('news__link');
    allSections[j].append(newA);
  }
}

/**
 * Sækir gögn fyrir flokk og birtir í DOM.
 * @param {string} id ID á category sem við erum að sækja
 * @param {HTMLElement} parent Element sem setja á flokkinn í
 * @param {HTMLELement | null} [link=null] Linkur sem á að setja eftir fréttum
 * @param {number} [limit=Infinity] Hámarks fjöldi frétta til að sýna
 */
export async function fetchAndRenderCategory(
  id,
  parent,
  link = null,
  limit = Infinity
) {
  const data = await fetchNews(id);
  if(data !== null){
    parent.textContent = '';
    const title = el('h2', data.title);
    title.classList.add('news__title');
    parent.append(title);
      for(let j = 0 ; j < 5; j++){
        const newP = el('p',data.items[j].title);
        newP.classList.add()
        parent.append(newP);
        }
    }
  return data;
  }

  // Búum til <section> sem heldur utan um flokkinn
  // Bætum við parent og þannig DOM, allar breytingar héðan í frá fara gegnum
  // container sem er tengt parent
  // Setjum inn loading skilaboð fyrir flokkinn
  // Sækjum gögn fyrir flokkinn og bíðum
  // Fjarlægjum loading skilaboð
  // Ef það er linkur, bæta honum við
  // Villuskilaboð ef villa og hættum
  // Skilaboð ef engar fréttir og hættum
  // Bætum við titli
  // Höfum fréttir! Ítrum og bætum við <ul>
