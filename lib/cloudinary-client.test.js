import assert from 'node:assert/strict';
import test from 'node:test';
import { getOptimizedVideoUrl } from './cloudinary-client.js';

test('getOptimizedVideoUrl applies the default 720p Cloudinary transform', () => {
  assert.equal(
    getOptimizedVideoUrl('https://res.cloudinary.com/demo/video/upload/sample.mp4'),
    'https://res.cloudinary.com/demo/video/upload/f_auto,q_auto,h_720,c_limit/sample.mp4'
  );
});

test('getOptimizedVideoUrl accepts a smaller preview height', () => {
  assert.equal(
    getOptimizedVideoUrl('https://res.cloudinary.com/demo/video/upload/sample.mp4', 480),
    'https://res.cloudinary.com/demo/video/upload/f_auto,q_auto,h_480,c_limit/sample.mp4'
  );
});

test('getOptimizedVideoUrl leaves non-Cloudinary URLs unchanged', () => {
  const url = 'https://example.com/sample.mp4';
  assert.equal(getOptimizedVideoUrl(url, 480), url);
});
