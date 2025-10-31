import axios from 'axios';
import { JSDOM } from 'jsdom';
const page = 'https://e-hentai.org/g/3534500/d544a93188/'
const getLinkFromPage = async (link) => {
    const content = await axios.get(link);
    const { window } = new JSDOM(content.data)
    const subLinks = []
    window.document.querySelector('#gdt').querySelectorAll('a').forEach(e => subLinks.push(e.href))
    return(subLinks)
}

const main = async () => {
    const mainRes = await axios.get('https://e-hentai.org/g/3534500/d544a93188/')
    const { window } = new JSDOM(mainRes.data);
    const title = window.document.querySelector('#gn').textContent;
    const pages = window.document.querySelector('.ptb').querySelectorAll('td')
    const pageCount = Number(pages[pages.length-2].textContent)
    console.log(pageCount)
    const links = []
    window.document.querySelector('#gdt').querySelectorAll('a').forEach(e => links.push(e.href))
    for(let i=1; i<pageCount; i++) {
        const pageLinks = await getLinkFromPage(page + '?p=' + i)
        links.push(...pageLinks);
    }

    const promises = links.map(async (link) => {
  const content = await axios.get(link);
  const { window: pageWindow } = new JSDOM(content.data);
  const img = pageWindow.document.querySelector('#img').src;
  return img; // ✅ return the result instead of pushing
});

// Wait for all promises to resolve
    const imgs = await Promise.all(promises);

    console.log(imgs)
}

main()