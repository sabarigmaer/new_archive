import axios from "axios";
import { JSDOM } from "jsdom";

interface EhentaiResponse {
  title: string;
  images: string[];
}

const getLinkFromPage = async (link: string): Promise<string[]> => {
  try {
    const content = await axios.get(link);
    const { window } = new JSDOM(content.data);
    const subLinks: string[] = [];
    const gdtElement = window.document.querySelector('#gdt');
    
    if (!gdtElement) {
      throw new Error('Gallery container not found');
    }
    
    gdtElement.querySelectorAll('a').forEach((element) => {
      const href = element.getAttribute('href');
      if (href) {
        subLinks.push(href);
      }
    });
    
    return subLinks;
  } catch (error) {
    console.error(`Error fetching links from page ${link}:`, error);
    return [];
  }
};

const getEhentaiFiles = async (page: string): Promise<EhentaiResponse> => {
  try {
    const mainRes = await axios.get(page);
    const { window } = new JSDOM(mainRes.data);
    // Get title with null check
    const titleElement = window.document.querySelector('#gn');
    if (!titleElement || !titleElement.textContent) {
      throw new Error('Title not found');
    }
    const title: string = titleElement.textContent;
    
    // Get page count with null checks
    const pagesContainer = window.document.querySelector('.ptb');
    if (!pagesContainer) {
      throw new Error('Pages container not found');
    }
    
    const pages = pagesContainer.querySelectorAll('td');
    const pageCount = Number(pages[pages.length - 2]?.textContent) || 1;
    console.log(`Total pages: ${pageCount}`);
    
    // Get initial links
    const links: string[] = [];
    const gdtElement = window.document.querySelector('#gdt');
    if (!gdtElement) {
      throw new Error('Gallery container not found');
    }
    
    gdtElement.querySelectorAll('a').forEach((element) => {
      const href = element.getAttribute('href');
      if (href) {
        links.push(href);
      }
    });
    
    // Get links from additional pages
    for (let i = 1; i < pageCount; i++) {
      const pageLinks = await getLinkFromPage(`${page}?p=${i}`);
      links.push(...pageLinks);
    }
    
    // Extract image URLs from all links
    const promises = links.map(async (link: string): Promise<string | null> => {
      try {
        const content = await axios.get(link);
        const { window: pageWindow } = new JSDOM(content.data);
        const imgElement = pageWindow.document.querySelector('#img') as HTMLImageElement;
        
        if (!imgElement || !imgElement.src) {
          console.warn(`Image not found for link: ${link}`);
          return null;
        }
        
        return imgElement.src;
      } catch (error) {
        console.error(`Error fetching image from ${link}:`, error);
        return null;
      }
    });
    
    // Wait for all promises to resolve and filter out null values
    const imgResults = await Promise.all(promises);
    const images = imgResults.filter((img): img is string => img !== null);
    
    return {
      title,
      images
    };
  } catch (error) {
    console.error('Error in getEhentaiFiles:', error);
    throw error;
  }
};

export default getEhentaiFiles;