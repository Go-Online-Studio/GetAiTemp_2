/**
 * Client-safe Cloudinary URL optimization helpers (zero Node.js dependencies)
 */

/**
 * Optimize Cloudinary video URLs (f_auto, q_auto, max height 720p)
 */
export function getOptimizedVideoUrl(url, maxHeight = 720) {
  if (!url || typeof url !== 'string' || !url.includes('res.cloudinary.com')) return url;
  if (url.includes('/upload/')) {
    return url.replace('/upload/', `/upload/f_auto,q_auto,h_${maxHeight},c_limit/`);
  }
  return url;
}

/**
 * Optimize Cloudinary image/thumbnail URLs (f_auto, q_auto)
 */
export function getOptimizedImageUrl(url, width = 640) {
  if (!url || typeof url !== 'string' || !url.includes('res.cloudinary.com')) return url;
  if (url.includes('/upload/')) {
    return url.replace('/upload/', `/upload/f_auto,q_auto,w_${width},c_scale/`);
  }
  return url;
}
