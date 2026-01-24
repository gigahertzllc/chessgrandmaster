/**
 * Wikipedia Image Service
 * Handles all Wikipedia/Wikimedia API calls with proper validation
 */

// Test if an image actually loads (not just if API returns URL)
export const testImageLoads = (url, timeout = 5000) => {
  return new Promise((resolve) => {
    const img = new Image();
    const timer = setTimeout(() => {
      img.src = '';
      resolve({ success: false, error: 'timeout' });
    }, timeout);
    
    img.onload = () => {
      clearTimeout(timer);
      resolve({ success: true, url });
    };
    
    img.onerror = () => {
      clearTimeout(timer);
      resolve({ success: false, error: 'load_failed' });
    };
    
    img.src = url;
  });
};

// Fetch image from Wikipedia Action API
export const fetchWikipediaMainImage = async (searchName) => {
  const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(searchName)}&prop=pageimages&format=json&origin=*&pithumbsize=400`;
  
  try {
    const res = await fetch(url);
    if (!res.ok) return { success: false, error: 'api_error' };
    
    const data = await res.json();
    const pages = data.query?.pages || {};
    const page = Object.values(pages)[0];
    const imageUrl = page?.thumbnail?.source;
    
    if (!imageUrl) return { success: false, error: 'no_image' };
    
    // Actually verify the image loads
    const loadResult = await testImageLoads(imageUrl);
    if (!loadResult.success) return loadResult;
    
    return {
      success: true,
      url: imageUrl,
      source: 'Wikipedia Main',
      label: 'Main Article Image'
    };
  } catch (e) {
    return { success: false, error: e.message };
  }
};

// Fetch from Wikipedia REST API (summary endpoint)
export const fetchWikipediaSummaryImage = async (searchName) => {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(searchName)}`;
  
  try {
    const res = await fetch(url);
    if (!res.ok) return { success: false, error: 'api_error' };
    
    const data = await res.json();
    const results = [];
    
    // Check thumbnail
    if (data.thumbnail?.source) {
      const loadResult = await testImageLoads(data.thumbnail.source);
      if (loadResult.success) {
        results.push({
          url: data.thumbnail.source,
          source: 'Wikipedia Summary',
          label: 'Summary Thumbnail'
        });
      }
    }
    
    // Check original (high res)
    if (data.originalimage?.source) {
      const loadResult = await testImageLoads(data.originalimage.source);
      if (loadResult.success) {
        results.push({
          url: data.originalimage.source,
          source: 'Wikipedia Original',
          label: 'Original (High Res)'
        });
      }
    }
    
    return { success: results.length > 0, images: results };
  } catch (e) {
    return { success: false, error: e.message };
  }
};

// Search Wikimedia Commons for additional images
export const fetchCommonsImages = async (searchName, limit = 6) => {
  const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(searchName + ' chess')}&srnamespace=6&format=json&origin=*&srlimit=${limit}`;
  
  try {
    const res = await fetch(searchUrl);
    if (!res.ok) return { success: false, error: 'api_error' };
    
    const data = await res.json();
    const results = [];
    
    if (data.query?.search) {
      for (const result of data.query.search) {
        const fileName = result.title.replace('File:', '');
        const fileInfoUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(result.title)}&prop=imageinfo&iiprop=url|thumburl&iiurlwidth=400&format=json&origin=*`;
        
        try {
          const fileRes = await fetch(fileInfoUrl);
          const fileData = await fileRes.json();
          const pages = fileData.query?.pages || {};
          const page = Object.values(pages)[0];
          const imageInfo = page?.imageinfo?.[0];
          
          if (imageInfo?.thumburl) {
            const loadResult = await testImageLoads(imageInfo.thumburl);
            if (loadResult.success) {
              results.push({
                url: imageInfo.thumburl,
                source: 'Wikimedia Commons',
                label: fileName.substring(0, 40) + (fileName.length > 40 ? '...' : '')
              });
            }
          }
        } catch (e) {
          console.warn('Failed to get file info for:', result.title);
        }
      }
    }
    
    return { success: results.length > 0, images: results };
  } catch (e) {
    return { success: false, error: e.message };
  }
};

// Main function: fetch all photo options for a player
export const fetchAllPhotoOptions = async (playerName, onProgress) => {
  const allImages = [];
  const seenUrls = new Set();
  
  onProgress?.({ stage: 'searching', message: 'Searching Wikipedia...' });
  
  // 1. Main Wikipedia image
  const mainResult = await fetchWikipediaMainImage(playerName);
  if (mainResult.success && !seenUrls.has(mainResult.url)) {
    seenUrls.add(mainResult.url);
    allImages.push(mainResult);
  }
  
  // 2. REST API images
  onProgress?.({ stage: 'searching', message: 'Checking additional sources...' });
  const summaryResult = await fetchWikipediaSummaryImage(playerName);
  if (summaryResult.success) {
    summaryResult.images.forEach(img => {
      if (!seenUrls.has(img.url)) {
        seenUrls.add(img.url);
        allImages.push(img);
      }
    });
  }
  
  // 3. Commons images
  onProgress?.({ stage: 'searching', message: 'Searching Wikimedia Commons...' });
  const commonsResult = await fetchCommonsImages(playerName);
  if (commonsResult.success) {
    commonsResult.images.forEach(img => {
      if (!seenUrls.has(img.url)) {
        seenUrls.add(img.url);
        allImages.push(img);
      }
    });
  }
  
  onProgress?.({ stage: 'complete', message: `Found ${allImages.length} verified images` });
  
  return {
    success: allImages.length > 0,
    images: allImages,
    count: allImages.length
  };
};
