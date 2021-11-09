import { fetchNews } from './news.js';
import { el, empty } from './helpers.js';
/**
 * Föll sem sjá um að kalla í `fetchNews` og birta viðmót:
 * - Loading state meðan gögn eru sótt
 * - Villu state ef villa kemur upp við að sækja gögn
 * - Birta gögnin ef allt OK
 * Fyrir gögnin eru líka búnir til takkar sem leyfa að fara milli forsíðu og
 * flokks *án þess* að nota sjálfgefna <a href> virkni—við tökum yfir og sjáum
 * um sjálf með History API.
 */
export async function handleClick(id, container, newsItemLimit) {
  const mainLayout = document.querySelector('.layout__main');
  empty(mainLayout);
  const p = el('p', 'sæki gögn...');
  const newSection = document.createElement('section');
  newSection.classList.add('news');
  newSection.classList.add('newsList__clickedItem');
  container.append(newSection);
  newSection.append(p);
  // Sama hvernig ég raða upp þá brýt ég þessa reglu þannig disablea fyrir þetta fall
  // eslint-disable-next-line no-use-before-define
  const data = await fetchAndRenderCategory(id, newSection, newsItemLimit);
  if (data === null) {
    p.textContent = 'illa kom upp';
  } else {
    p.remove();
  }
  // Sama hvernig ég raða upp þá brýt ég þessa reglu þannig disablea fyrir þetta fall
  // eslint-disable-next-line no-use-before-define
  createCategoryBackLink(newSection);
}

/**
 * Sér um smell á flokk og birtir flokkinn *á sömu síðu* og við erum á.
 * Þarf að:
 * - Stoppa sjálfgefna hegðun <a href>
 * - Tæma `container` þ.a. ekki sé verið að setja efni ofan í annað efni
 * - Útbúa link sem fer til baka frá flokk á forsíðu, þess vegna þarf `newsItemLimit`
 * - Sækja og birta flokk
 * - Bæta við færslu í `history` þ.a. back takki virki
 *
 * @param {string} id ID á flokk sem birta á eftir að smellt er
 * @param {HTMLElement} container Element sem á að birta fréttirnar í
 * @param {number} newsItemLimit Hámark frétta sem á að birta
 * @returns {function} Fall sem bundið er við click event á link/takka
 */
export function handleCategoryClick(id, container, newsItemLimit) {
  return async (e) => {
    e.preventDefault();
    window.history.pushState(1, null, `/?category=${id}`);
    handleClick(id, container, newsItemLimit);
  };
}

/**
 * Sækir gögn fyrir flokk og birtir í DOM.
 * @param {string} id ID á category sem við erum að sækja
 * @param {HTMLElement} parent Element sem setja á flokkinn í
 * @param {HTMLELement | null} [link=null] Linkur sem á að setja eftir fréttum
 * @param {number} [limit=Infinity] Hámarks fjöldi frétta til að sýna
 */
export async function fetchAndRenderCategory(id, parent, limit = Infinity) {
  const data = await fetchNews(id);
  if (data !== null) {
    const containerSection = el('section', '');

    parent.append(containerSection);
    const title = el('h2', data.title);
    title.classList.add('news__title');
    containerSection.append(title);
    for (let j = 0; j < limit; j += 1) {
      const newA = el('a', data.items[j].title);
      newA.classList.add('news__list');
      newA.href = data.items[j].link;
      containerSection.append(newA);
    }
  }
  return data;
}

/**
 * Sækir grunnlista af fréttum, síðan hvern flokk fyrir sig og birtir nýjustu
 * N fréttir úr þeim flokk með `fetchAndRenderCategory()`
 * @param {HTMLElement} container Element sem mun innihalda allar fréttir
 * @param {number} newsItemLimit Hámark fjöldi frétta sem á að birta í yfirliti
 */
export async function fetchAndRenderLists(container, newsItemLimit) {
  let newSection;
  const result = await fetchNews();
  for (let i = 0; i < newsItemLimit; i += 1) {
    newSection = document.createElement('section');
    newSection.classList.add('news');
    newSection.classList.add('newsList__item');
    const p = el('p', 'sæki gögn...');
    container.append(newSection);
    newSection.append(p);
  }
  container.classList.add('newsList__list');
  const allSections = document.querySelectorAll('.news');
  const allP = document.querySelectorAll('p');
  for (let j = 0; j < newsItemLimit; j += 1) {
    if (result === null) {
      for (let k = 0; k < allP.length; k += 1) {
        allP[k].textContent = 'Villa kom upp';
      }
    } else {
      // Í þessari útfærslu vildi ég geta fetchað fyrir hvert id sem result gefur mér
      // þá bý ég til linkana fyrir hvert id og set það inn í hvert section.
      // Þetta virtist ekki skapa nein vandamál að hafa await inn í forloopunni þegar ég gerði það svona.
      // Reyndi að nota Promise.all, en það virtist gefa error fyrir all, ef eitthvað fetchið klikkaði.
      // eslint-disable-next-line no-await-in-loop
      const getNewslist = await fetchAndRenderCategory(
        result[j].id,
        allSections[j],
        5
      );
      if (getNewslist !== null) {
        allP[j].remove();
      } else {
        allP[j].textContent = 'Villa kom upp';
      }
    }
    const newA = el('a', 'Allar fréttir');
    newA.href = result[j].id;
    newA.classList.add('news__links');
    newA.classList.add('news__link');
    newA.addEventListener(
      'click',
      handleCategoryClick(result[j].id, container, 20)
    );
    allSections[j].append(newA);
  }
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
    if (window.history.length === 2) {
      empty(container);
      fetchAndRenderLists(container, newsItemLimit);
      window.history.replaceState(null, null, '/');
    } else {
      window.history.back();
    }
  };
}

/**
 * Útbýr takka sem fer á forsíðu.
 * @param {HTMLElement} container Element sem á að birta fréttirnar í
 * @returns {HTMLElement} Element með takka sem fer á forsíðu
 */
export function createCategoryBackLink(container) {
  const main = document.querySelector('main');
  const newLink = el('a', 'Til baka');
  newLink.href = '';
  newLink.classList.add('news__links');
  newLink.classList.add('news__link');
  container.append(newLink);
  newLink.addEventListener('click', handleBackClick(main, 5));
}
