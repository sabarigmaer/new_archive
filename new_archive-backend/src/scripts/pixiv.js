const images = document.querySelector('.sc-e81e9094-1').querySelectorAll('img') 
const links = [];

images.forEach( i => links.push(i.src))
const title = document.querySelector(".sc-c5ac099-3").textContent
const artist = document.querySelector('.sc-76df3bd1-6').textContent

// runtime: browser
// Configuration options

const config = {
    page: (new URL(window.location.href)).pathname,
    name: artist + " - "+title,
    rateLimit: 0, // milliseconds between requests
    retryAttempts: 3,
    zipName: title + '.zip'
};

console.log(config)
// Generate links with proper error handling
function generateLinks(config) {
    return links;
}

// Helper function to delay execution for rate limiting
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to retry failed requests
async function retryFetch(url, attempts = config.retryAttempts) {
    for (let i = 0; i < attempts; i++) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response;
        } catch (error) {
            if (i === attempts - 1) throw error;
            await delay(config.rateLimit);
        }
    }
}

async function downloadImagesAsZip(links) {
    // Ensure JSZip is loaded
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
    document.head.appendChild(script);
    await new Promise(res => script.onload = res);
    console.log("Loaded script: JSZip")
    const zip = new JSZip();
    const imgFolder = zip.folder(config.name || 'images');
    let successCount = 0;
    let failureCount = 0;

    // Create progress element
    const progress = document.createElement('div');
    progress.style.position = 'fixed';
    progress.style.top = '10px';
    progress.style.right = '10px';
    progress.style.padding = '10px';
    progress.style.background = '#333';
    progress.style.color = '#fff';
    progress.style.zIndex= "9999";
    document.body.appendChild(progress);
    console.log("starting download")
    for (let i = 0; i < links.length; i++) {
        try {
            console.log(`Downloading: ${i + 1}/${links.length}`)
            progress.textContent = `Downloading: ${i + 1}/${links.length}`;
            const response = await retryFetch(links[i]);
            const blob = await response.blob();
            const ext = links[i].split('.').pop().split('?')[0] || 'png';
            imgFolder.file(`image_${(i + 1).toString().padStart(3, '0')}.${ext}`, blob);
            successCount++;
            await delay(config.rateLimit); // Rate limiting
        } catch (err) {
            console.error(`Failed to fetch ${links[i]}:`, err);
            failureCount++;
        }
    }

    progress.textContent = 'Generating zip file...';
    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);

    // trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = config.zipName;
    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);
    progress.textContent = `Complete! Success: ${successCount}, Failed: ${failureCount}`;
    setTimeout(() => progress.remove(), 3000);
}

// Main execution wrapper
async function main() {
    try {
        const links = generateLinks(config);
        console.log(links)
        await downloadImagesAsZip(links);
    } catch (error) {
        console.error('Error:', error.message);
        alert('An error occurred: ' + error.message);
    }
}

// Start the download process
main();
