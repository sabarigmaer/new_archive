import { PrismaClient } from "@prisma/client";
import axios from "axios";
import { JSDOM } from 'jsdom';


const tag = "optimystic"

const BASE_URL = "https://rule34.xxx/index.php";
const posts_url = BASE_URL + "?page=post&s=list&tags="+tag;
const posts = [];
const links = [];
let pageNo = '';

// Rate limiting function
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Enhanced axios instance with retry logic
const axiosInstance = axios.create({
    timeout: 30000,
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
});

// Retry wrapper for axios requests
const makeRequestWithRetry = async (url, maxRetries = 3, delayMs = 2000) => {
    for (let i = 0; i < maxRetries; i++) {
        try {
            await delay(delayMs); // Always wait before making request
            const response = await axiosInstance.get(url);
            return response;
        } catch (error) {
            console.log(`Attempt ${i + 1} failed for ${url}: ${error.message}`);
            
            if (error.response?.status === 429) {
                const waitTime = Math.min(delayMs * Math.pow(2, i), 30000); // Exponential backoff, max 30s
                console.log(`Rate limited. Waiting ${waitTime}ms before retry...`);
                await delay(waitTime);
            } else if (i === maxRetries - 1) {
                throw error;
            } else {
                await delay(delayMs);
            }
        }
    }
};

const getImageFromPost = async (postLink) => {
    const { pathname } = new URL(postLink);
    const number = pathname.split('/')[2];
    const id = pathname.split('/')[3].replace("thumbnail_", "").split(".")[0];
    
    // Generate possible image URLs
    const urlPatterns = [
        `https://wimg.rule34.xxx/images/${number}/${id}.jpeg`,
        `https://wimg.rule34.xxx/images/${number}/${id}.jpg`,
        `https://wimg.rule34.xxx/images/${number}/${id}.png`,
    ];
    
    // console.log(`Post ID: ${id}`);
    urlPatterns.forEach(url => {
        // console.log(`  Possible URL: ${url}`);
        links.push(url);
    });
    // console.log('---');
};

const getPostsFromPage = async () => {
    try {
        console.log(`Fetching page with pid: ${pageNo}`);
        const page = await makeRequestWithRetry(posts_url + "&pid=" + pageNo);
        const html = page.data;
        const doc = new JSDOM(html);
        const imageList = doc.window.document.querySelector('.image-list')?.querySelectorAll('a');
        
        if (!imageList || imageList.length === 0) {
            console.log('No more images found on this page');
            return;
        }
        
        imageList.forEach(img => {
            const imgSrc = img.querySelector('img')?.src;
            if (imgSrc) {
                posts.push(imgSrc);
            }
        });
        
        console.log(`Found ${imageList.length} posts on page ${pageNo}`);
        
        if (imageList.length == 42) {
            pageNo = String(Number(pageNo) + 42);
            await delay(2000); // Wait between page requests
            return getPostsFromPage();
        }
    } catch (error) {
        console.error(`Error fetching page: ${error.message}`);
        throw error;
    }
};

// Function to check if an image URL is valid
const checkImageUrl = async (url) => {
    try {
        const response = await axiosInstance.head(url);
        return response.status === 200;
    } catch (error) {
        return false;
    }
};

// Function to create a gallery in the database
const createGallery = async (prisma, title, imageUrls) => {
    try {
        // Create the gallery first
        const gallery = await prisma.gallery.create({
            data: {
                title,
                description: `${tag} gallery created on ${new Date().toISOString()}`,
                coverImage: imageUrls[0], // Use the first image as cover
                // Create files for each image URL
                files: {
                    create: imageUrls.map((url, index) => ({
                        name: `${tag}_${index + 1}`,
                        url: url
                    }))
                }
            },
            include: {
                files: true
            }
        });
        return gallery;
    } catch (error) {
        console.error('Error creating gallery:', error);
        throw error;
    }
};

const main = async () => {
    try {
        console.log('Starting link extraction...');
        
        await getPostsFromPage();
        console.log(`\nTotal posts found: ${posts.length}`);
        
        console.log('\nExtracting image links...\n');
        
        posts.forEach(post => getImageFromPost(post));
        
        console.log('\nVerifying image links...');
        const workingLinks = [];
        for (const link of links) {
            const isWorking = await checkImageUrl(link);
            if (isWorking) {
                workingLinks.push(link);
                console.log(`✓ ${link}`);
            } else {
                console.log(`✗ ${link}`);
            }
            await delay(1000); // Rate limiting for checking links
        }
        
        console.log(`\n=== SUMMARY ===`);
        console.log(`Total posts processed: ${posts.length}`);
        console.log(`Total possible image URLs generated: ${links.length}`);
        console.log(`Working image URLs found: ${workingLinks.length}`);
        
        // Save working links to a file
        await Bun.write(`./working_links_${tag}.txt`, workingLinks.join('\n'));
        console.log(`\nSaved working links to working_links_${tag}.txt`);
        
        // Create gallery in database
        const prisma = new PrismaClient();
        const gallery = await createGallery(prisma, `${tag} Collection`, workingLinks);
        console.log('\n=== GALLERY CREATED ===');
        console.log(`Title: ${gallery.title}`);
        console.log(`Description: ${gallery.description}`);
        console.log(`Cover Image: ${gallery.coverImage}`);
        console.log(`Total Files: ${gallery.files.length}`);
        await prisma.$disconnect();
        
    } catch (error) {
        console.error('Script failed:', error.message);
    }
};

main();