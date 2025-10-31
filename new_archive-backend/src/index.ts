import { Hono } from 'hono'
import prisma from './lib/prisma'
import { cors } from 'hono/cors'
import axios from 'axios'
import config from '../config'
import getEhentaiFiles from './modules/Ehentai'

interface CacheEntry {
  data: any;
  timestamp: number;
}

// In-memory cache for ehentai files (2 hours = 7,200,000 ms)
const ehentaiCache = new Map<string, CacheEntry>();
const CACHE_DURATION = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

// Clean up expired cache entries every hour
const cleanupExpiredCache = () => {
  const now = Date.now();
  let removedCount = 0;
  const keysToRemove: string[] = [];
  
  ehentaiCache.forEach((entry, key) => {
    if (now - entry.timestamp >= CACHE_DURATION) {
      keysToRemove.push(key);
    }
  });
  
  keysToRemove.forEach(key => {
    ehentaiCache.delete(key);
    removedCount++;
  });
  
  if (removedCount > 0) {
    console.log(`🧹 Cleaned up ${removedCount} expired cache entries`);
  }
};

// Run cleanup every hour
setInterval(cleanupExpiredCache, 60 * 60 * 1000);

const app = new Hono({})

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', '*'],
  allowHeaders: ['Content-Type', 'Range', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  exposeHeaders: ['Content-Range', 'Content-Length', 'Accept-Ranges'],
}))

app.get('/api/galleries', async (c) => {
  const response = await prisma.gallery.findMany(
    {
      orderBy: {id: 'desc'}
    }
  )
  return c.json(response)
})

app.get('/api/galleries/:id', async (c) => {
  const proxy = c.req.query('proxy')
  const response = await prisma.file.findMany({
    where: {
      galleryId: Number(c.req.param('id'))
    },
    orderBy: [{ likes: 'desc' },{ id: 'asc'}]
  })
  console.log(c.req.query('proxy'), c.req.queries())

  if(proxy != undefined)
    return c.json(response.map( f =>( {
      ...f,
      url: 'http://localhost:3000/api/files/' + f.id
    })))
  
    return c.json(response)
});

app.get('/api/files/:id', async (c) => {
  const id = c.req.param('id')
  const file = await prisma.file.findUnique({
    where: {
      id: Number(id),
    },
  })

  if(!file) return c.json({}, 404)
  const response = await fetch(file.url)
  const arrayBuffer = await response.arrayBuffer()

  // Forward content type from the origin
  const contentType = response.headers.get('content-type') || 'application/octet-stream'

  return new Response(arrayBuffer, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': contentType,
    },
  })
})

app.post('/api/files/:id/like', async (c) => {
  const updatedFile = await prisma.file.update({
    where: {
      id: Number(c.req.param('id'))
    },
    data: {
      likes: { increment: 1 }
    }
  })
  return c.json({ likes: updatedFile.likes })
});

app.get('/api/rule34', async (c) => {
    // Get the tags parameter and decode it properly
    const tagsParam = c.req.query('tags') || 'optimystic';
    // Decode URI component first, then ensure proper + formatting for Rule34 API
    const decodedTags = decodeURIComponent(tagsParam);
    const tag = decodedTags.split(/\s+/).join("+") || 'optimystic';
    const page = c.req.query('page') || '0';
    const base = "https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&json=1"
    const auth = `&api_key=${config.rule34ApiKey}&user_id=${config.rule34UserId}`
    
    console.log("Final tag for API:", tag);
    
    const response = await axios.get(
      base +
      auth +
      `&tags=${tag}&limit=15&pid=${page}`
    );
    console.log(response)
    const posts = response.data.map?.((post: any) => {
      return {
        id: post.id,
        file_url: post.file_url,
        tags: post.tags.split(" ")
      }
    })
    // console.log("@@@@@@@@@", posts)
    return c.json(posts)
})

app.post('/api/luscious', async (c) => {
  try {
    const body = await c.req.json();
    const response = await axios.get(`https://apicdn.luscious.net/graphql/nobatch/?operationName=PictureListInsideAlbum&query=%20query%20PictureListInsideAlbum(%24input%3A%20PictureListInput!)%20{%20picture%20{%20list(input%3A%20%24input)%20{%20info%20{%20...FacetCollectionInfo%20}%20items%20{%20__typename%20id%20title%20description%20created%20like_status%20number_of_comments%20number_of_favorites%20moderation_status%20width%20height%20resolution%20aspect_ratio%20url_to_original%20url_to_video%20is_animated%20position%20permissions%20url%20tags%20{%20category%20text%20url%20}%20thumbnails%20{%20width%20height%20size%20url%20}%20}%20}%20}%20}%20fragment%20FacetCollectionInfo%20on%20FacetCollectionInfo%20{%20page%20has_next_page%20has_previous_page%20total_items%20total_pages%20items_per_page%20url_complete%20}%20&variables={%22input%22:{%22filters%22:[{%22name%22:%22album_id%22,%22value%22:%22${body.album}%22}],%22display%22:%22rating_all_time%22,%22items_per_page%22:50,%22page%22:${body.page}}}`);
    return c.json(response.data);
  } catch (error) {
    console.error('Error proxying luscious request:', error);
    return c.json({ error: 'Failed to fetch data from Luscious API' }, 500);
  }
})

app.post('/api/gallery',async (c) =>{
  try {
    const body = await c.req.json();
    const links = body.links
     const gallery = await prisma.gallery.create({
    data: {
      title: body.title,
      description: body.page,
      coverImage: body.cover || links[links.length-1],
      parentId: null,
      type: body.type || null,
      link: body.page
    },
  });
  if(links) await prisma.file.createMany({
    data: links.map((url: string) => ({
      name: url.split("/").pop() || "unknown",
      url,
      galleryId: gallery.id,
    })),
  });
  console.log(
    `✅ Inserted gallery "${gallery.title}" with ${links?.length || 0} files`,
    gallery.id
  );
  return c.text("ok")
  } catch(e:any) {
    console.error(e)
    return c.json({ error: e.message as string }, 500)
  }
})

app.post('/api/gallery/:id/like', async(c) => {
  const galleryId = c.req.param("id");
  const updatedGallery = await prisma.gallery.update({
    where: {
      id: Number(galleryId)
    },
    data: {
      likes: { increment: 1 }
    }
  })
  return c.json({ likes: updatedGallery.likes })
})

app.get('/api/ehentai', async (c) => {
  const response = await prisma.gallery.findMany(
    {
      where: { type: 'ehentai'},
      orderBy: {id: 'desc'},
    }
  )
  return c.json(response)
})

// Cache management endpoints
app.get('/api/ehentai/cache/status', async (c) => {
  const now = Date.now();
  const cacheInfo = Array.from(ehentaiCache.entries()).map(([key, entry]) => ({
    key,
    age: Math.round((now - entry.timestamp) / 1000 / 60), // age in minutes
    expiresIn: Math.round((CACHE_DURATION - (now - entry.timestamp)) / 1000 / 60), // expires in minutes
  }));
  
  return c.json({
    totalEntries: ehentaiCache.size,
    cacheDurationHours: CACHE_DURATION / (60 * 60 * 1000),
    entries: cacheInfo
  });
})

app.delete('/api/ehentai/cache', async (c) => {
  const size = ehentaiCache.size;
  ehentaiCache.clear();
  return c.json({ message: `Cleared ${size} cache entries` });
})

app.get('/api/ehentai/:id', async (c) => {
  const galleryId = Number(c.req.param('id'));
  const cacheKey = `ehentai-${galleryId}`;
  
  // Check if we have cached data
  const cachedEntry = ehentaiCache.get(cacheKey);
  const now = Date.now();
  
  if (cachedEntry && (now - cachedEntry.timestamp) < CACHE_DURATION) {
    console.log(`📦 Serving cached data for gallery ${galleryId}`);
    return c.json(cachedEntry.data);
  }
  
  try {
    const gallery = await prisma.gallery.findUnique({
      where: { id: galleryId }
    });
    
    if (!gallery || !gallery.link) {
      return c.json({ error: 'Gallery not found or missing link' }, 400);
    }
    
    console.log(`🔄 Fetching fresh data for gallery ${galleryId}`);
    const files = await getEhentaiFiles(gallery.link);
    const response = { files };
    
    // Cache the response
    ehentaiCache.set(cacheKey, {
      data: response,
      timestamp: now
    });
    
    console.log(`✅ Cached data for gallery ${galleryId} for 2 hours`);
    return c.json(response);
  } catch (error) {
    console.error(`❌ Error fetching ehentai files for gallery ${galleryId}:`, error);
    return c.json({ error: 'Failed to fetch ehentai files' }, 500);
  }
})


app.get('/api/proxy', async (c) => {
  const url = c.req.query('link') as string;
  
  if (!url) {
    return c.json({ error: 'Missing link parameter' }, 400);
  }

  try {
    // Get range header from client for video streaming support
    const range = c.req.header('range');
    
    // Prepare headers for the upstream request
    const headers: HeadersInit = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    };
    
    // Add range header if present (for video streaming)
    if (range) {
      headers['Range'] = range;
    }
    console.log(url)
    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      return c.json({ error: `Failed to fetch: ${response.status}` }, 500);
    }

    const arrayBuffer = await response.arrayBuffer();
    
    // Get content type and other important headers
    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const contentLength = response.headers.get('content-length');
    const acceptRanges = response.headers.get('accept-ranges');
    const contentRange = response.headers.get('content-range');
    
    // Prepare response headers
    const responseHeaders: HeadersInit = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Range',
      'Access-Control-Expose-Headers': 'Content-Range, Content-Length, Accept-Ranges',
      'Content-Type': contentType,
    };
    
    // Add streaming-related headers if present
    if (contentLength) {
      responseHeaders['Content-Length'] = contentLength;
    }
    if (acceptRanges) {
      responseHeaders['Accept-Ranges'] = acceptRanges;
    }
    if (contentRange) {
      responseHeaders['Content-Range'] = contentRange;
    }
    
    // Return appropriate status code (206 for partial content, 200 for full content)
    const status = response.status === 206 ? 206 : 200;
    
    return new Response(arrayBuffer, {
      status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return c.json({ error: 'Failed to proxy request' }, 500);
  }
})

export default app
