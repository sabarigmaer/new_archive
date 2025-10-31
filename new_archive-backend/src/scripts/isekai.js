import axios from "axios";
import { JSDOM } from "jsdom";

// Create multiple user agents to rotate
const userAgents = [
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15'
];

const getRandomUserAgent = () => userAgents[Math.floor(Math.random() * userAgents.length)];

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const createAxiosInstance = (userAgent) => {
    return axios.create({
        timeout: 30000,
        headers: {
            'User-Agent': userAgent,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Sec-Fetch-User': '?1',
            'Cache-Control': 'max-age=0',
            'DNT': '1',
            'Sec-GPC': '1'
        }
    });
};

const main = async () => {
    const links = [];
    
    // Try multiple approaches
    const approaches = [
        async () => {
            console.log("Approach 1: Random User-Agent with delay");
            await sleep(2000); // Initial delay
            const userAgent = getRandomUserAgent();
            console.log(`Using User-Agent: ${userAgent}`);
            const axiosInstance = createAxiosInstance(userAgent);
            return await axiosInstance.get("https://isekaitube.com/fanart/himari-aozora-hentai/");
        },
        async () => {
            console.log("Approach 2: Fetch homepage first, then target page");
            const homeAxios = createAxiosInstance(getRandomUserAgent());
            console.log("Fetching homepage first...");
            await homeAxios.get("https://isekaitube.com/");
            await sleep(3000);
            
            console.log("Now fetching target page...");
            const targetAxios = createAxiosInstance(getRandomUserAgent());
            return await targetAxios.get("https://isekaitube.com/fanart/himari-aozora-hentai/", {
                headers: {
                    'Referer': 'https://isekaitube.com/'
                }
            });
        },
        async () => {
            console.log("Approach 3: Using curl-like headers");
            const curlAxios = axios.create({
                timeout: 30000,
                headers: {
                    'User-Agent': 'curl/8.0.0',
                    'Accept': '*/*',
                    'Connection': 'keep-alive'
                }
            });
            return await curlAxios.get("https://isekaitube.com/fanart/himari-aozora-hentai/");
        }
    ];
    
    for (let i = 0; i < approaches.length; i++) {
        try {
            console.log(`\n--- Trying approach ${i + 1} ---`);
            const page = await approaches[i]();
            
            console.log(`✅ Success! Response status: ${page.status}`);
            
            const {
                window: { document },
            } = new JSDOM(page.data);
            
            const galleryContent = document.querySelector(".pgcsimplygalleryblock-masonry-content");
            
            if (!galleryContent) {
                console.log("Gallery content not found. Checking for other selectors...");
                
                // Try alternative selectors
                const alternativeSelectors = [
                    ".masonry-content",
                    ".gallery-images",
                    ".wp-block-gallery",
                    "[class*='gallery']",
                    "[class*='masonry']"
                ];
                
                for (const selector of alternativeSelectors) {
                    const element = document.querySelector(selector);
                    if (element) {
                        console.log(`Found content with selector: ${selector}`);
                        const imgs = element.querySelectorAll("img");
                        console.log(`Found ${imgs.length} images with alternative selector`);
                        break;
                    }
                }
                
                // Fallback: get all images
                const allImgs = document.querySelectorAll("img");
                console.log(`Found ${allImgs.length} total images on page`);
                allImgs.forEach((img) => {
                    if (img.src && !img.src.includes('logo') && !img.src.includes('icon')) {
                        links.push(img.src);
                    }
                });
            } else {
                const imgs = galleryContent.querySelectorAll("img");
                console.log(`Found ${imgs.length} images in gallery content`);
                
                imgs.forEach((img) => {
                    if (img.src) {
                        links.push(img.src);
                    }
                });
            }
            
            console.log("Found image links:");
            console.log(links);
            
            return; // Success, exit the loop
            
        } catch (error) {
            console.log(`❌ Approach ${i + 1} failed:`);
            if (error.response) {
                console.error(`HTTP Error ${error.response.status}: ${error.response.statusText}`);
                if (error.response.status === 403) {
                    console.error("403 Forbidden - Cloudflare or bot protection detected");
                }
            } else {
                console.error("Network error:", error.message);
            }
            
            if (i < approaches.length - 1) {
                console.log("Waiting before trying next approach...");
                await sleep(5000);
            }
        }
    }
    
    console.log("\n❌ All approaches failed. The website has strong bot protection.");
    console.log("Consider using a headless browser like Puppeteer or manual extraction.");
};

main();
