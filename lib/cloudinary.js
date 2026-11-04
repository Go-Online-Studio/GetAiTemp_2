import { v2 as cloudinary } from 'cloudinary';
export { getOptimizedVideoUrl, getOptimizedImageUrl } from './cloudinary-client';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Generate signed upload parameters for Cloudinary direct client uploads.
 * This avoids sending large video files through Vercel serverless functions (4.5MB limit).
 */
export function generateUploadSignature(folder = 'getyouraiprompt', resourceType = 'auto') {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const params = {
    timestamp,
    folder,
  };

  const signature = cloudinary.utils.api_sign_request(
    params,
    process.env.CLOUDINARY_API_SECRET || ''
  );

  return {
    timestamp,
    folder,
    signature,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  };
}

export default cloudinary;
