/**
 * ID3 Tag Reader for MP3 files
 * Extracts title, artist, album, duration, and album artwork
 */

// Read ID3v2 tags from MP3 file
export async function readID3Tags(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      const buffer = e.target.result;
      const view = new DataView(buffer);
      
      const result = {
        title: null,
        artist: null,
        album: null,
        year: null,
        artwork: null,
        duration: null
      };
      
      // Try to get duration using Audio element
      try {
        const audio = new Audio();
        audio.src = URL.createObjectURL(file);
        await new Promise((res) => {
          audio.onloadedmetadata = () => {
            result.duration = Math.round(audio.duration);
            URL.revokeObjectURL(audio.src);
            res();
          };
          audio.onerror = () => res();
        });
      } catch (err) {
        console.warn('Could not read duration:', err);
      }
      
      // Check for ID3v2 header
      if (view.getUint8(0) === 0x49 && view.getUint8(1) === 0x44 && view.getUint8(2) === 0x33) {
        // ID3v2 tag found
        const version = view.getUint8(3);
        const flags = view.getUint8(5);
        const size = readSyncsafeInt(view, 6);
        
        let offset = 10;
        const tagEnd = 10 + size;
        
        while (offset < tagEnd && offset < buffer.byteLength - 10) {
          // Read frame header
          const frameId = String.fromCharCode(
            view.getUint8(offset),
            view.getUint8(offset + 1),
            view.getUint8(offset + 2),
            view.getUint8(offset + 3)
          );
          
          // Check if we've hit padding
          if (frameId === '\0\0\0\0' || frameId[0] === '\0') break;
          
          const frameSize = version >= 4 
            ? readSyncsafeInt(view, offset + 4)
            : view.getUint32(offset + 4);
          
          if (frameSize <= 0 || frameSize > buffer.byteLength) break;
          
          const frameData = new Uint8Array(buffer, offset + 10, frameSize);
          
          switch (frameId) {
            case 'TIT2': // Title
              result.title = decodeTextFrame(frameData);
              break;
            case 'TPE1': // Artist
              result.artist = decodeTextFrame(frameData);
              break;
            case 'TALB': // Album
              result.album = decodeTextFrame(frameData);
              break;
            case 'TYER': // Year (ID3v2.3)
            case 'TDRC': // Recording time (ID3v2.4)
              result.year = decodeTextFrame(frameData);
              break;
            case 'APIC': // Attached picture (album art)
              result.artwork = extractAlbumArt(frameData);
              break;
          }
          
          offset += 10 + frameSize;
        }
      }
      
      // If no ID3v2, try ID3v1 at end of file
      if (!result.title && buffer.byteLength > 128) {
        const id3v1Start = buffer.byteLength - 128;
        const tag = String.fromCharCode(
          view.getUint8(id3v1Start),
          view.getUint8(id3v1Start + 1),
          view.getUint8(id3v1Start + 2)
        );
        
        if (tag === 'TAG') {
          result.title = readFixedString(view, id3v1Start + 3, 30);
          result.artist = readFixedString(view, id3v1Start + 33, 30);
          result.album = readFixedString(view, id3v1Start + 63, 30);
          result.year = readFixedString(view, id3v1Start + 93, 4);
        }
      }
      
      // Fallback to filename if no title
      if (!result.title) {
        result.title = file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' ');
      }
      
      resolve(result);
    };
    
    reader.onerror = () => {
      resolve({
        title: file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '),
        artist: null,
        album: null,
        year: null,
        artwork: null,
        duration: null
      });
    };
    
    reader.readAsArrayBuffer(file);
  });
}

// Read syncsafe integer (ID3v2)
function readSyncsafeInt(view, offset) {
  return (
    ((view.getUint8(offset) & 0x7f) << 21) |
    ((view.getUint8(offset + 1) & 0x7f) << 14) |
    ((view.getUint8(offset + 2) & 0x7f) << 7) |
    (view.getUint8(offset + 3) & 0x7f)
  );
}

// Decode text frame based on encoding byte
function decodeTextFrame(data) {
  if (data.length === 0) return null;
  
  const encoding = data[0];
  const textData = data.slice(1);
  
  try {
    switch (encoding) {
      case 0: // ISO-8859-1
        return new TextDecoder('iso-8859-1').decode(textData).replace(/\0/g, '').trim();
      case 1: // UTF-16 with BOM
      case 2: // UTF-16BE
        return new TextDecoder('utf-16').decode(textData).replace(/\0/g, '').trim();
      case 3: // UTF-8
        return new TextDecoder('utf-8').decode(textData).replace(/\0/g, '').trim();
      default:
        return new TextDecoder('iso-8859-1').decode(textData).replace(/\0/g, '').trim();
    }
  } catch (err) {
    return null;
  }
}

// Read fixed-length string (ID3v1)
function readFixedString(view, offset, length) {
  let str = '';
  for (let i = 0; i < length; i++) {
    const char = view.getUint8(offset + i);
    if (char === 0) break;
    str += String.fromCharCode(char);
  }
  return str.trim() || null;
}

// Extract album art from APIC frame
function extractAlbumArt(data) {
  try {
    const encoding = data[0];
    let offset = 1;
    
    // Read MIME type (null-terminated)
    let mimeType = '';
    while (offset < data.length && data[offset] !== 0) {
      mimeType += String.fromCharCode(data[offset]);
      offset++;
    }
    offset++; // Skip null terminator
    
    // Skip picture type byte
    offset++;
    
    // Skip description (null-terminated, encoding-dependent)
    if (encoding === 1 || encoding === 2) {
      // UTF-16: look for double null
      while (offset < data.length - 1) {
        if (data[offset] === 0 && data[offset + 1] === 0) {
          offset += 2;
          break;
        }
        offset++;
      }
    } else {
      // Single-byte: look for single null
      while (offset < data.length && data[offset] !== 0) {
        offset++;
      }
      offset++;
    }
    
    // Rest is image data
    const imageData = data.slice(offset);
    
    if (imageData.length < 100) return null; // Too small to be valid image
    
    // Determine mime type from magic bytes if not specified
    if (!mimeType || mimeType === 'image/') {
      if (imageData[0] === 0xFF && imageData[1] === 0xD8) {
        mimeType = 'image/jpeg';
      } else if (imageData[0] === 0x89 && imageData[1] === 0x50) {
        mimeType = 'image/png';
      } else {
        mimeType = 'image/jpeg'; // Default
      }
    }
    
    const blob = new Blob([imageData], { type: mimeType });
    return URL.createObjectURL(blob);
  } catch (err) {
    console.warn('Failed to extract album art:', err);
    return null;
  }
}

// Format duration as mm:ss
export function formatDuration(seconds) {
  if (!seconds) return '--:--';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
