'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function VideoForm({ initialData = null, isEdit = false }) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    description: initialData?.description || '',
    prompt: initialData?.prompt || '',
    videoUrl: initialData?.videoUrl || '',
    videoPublicId: initialData?.videoPublicId || '',
    thumbnailUrl: initialData?.thumbnailUrl || '',
    thumbnailPublicId: initialData?.thumbnailPublicId || '',
    duration: initialData?.duration || 10,
    category: initialData?.category?._id || initialData?.category || '',
    tags: initialData?.tags?.join(', ') || '',
    aiTool: initialData?.aiTool || 'Sora',
    status: initialData?.status || 'published',
    featured: initialData?.featured || false,
  });

  const [categories, setCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetch('/api/admin/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []))
      .catch((err) => console.error(err));
  }, []);

  const handleTitleChange = (e) => {
    const val = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: isEdit ? prev.slug : val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    }));
  };

  // Upload helper to Cloudinary directly via signed upload
  const uploadToCloudinary = async (file, type = 'image') => {
    try {
      const sigRes = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folder: 'getyouraiprompt', resourceType: type }),
      });
      const sigData = await sigRes.json();

      if (sigData.mock || !sigData.apiKey) {
        alert('Cloudinary credentials not configured in .env. Please enter a media URL directly.');
        return null;
      }

      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('api_key', sigData.apiKey);
      uploadData.append('timestamp', sigData.timestamp);
      uploadData.append('signature', sigData.signature);
      uploadData.append('folder', sigData.folder);

      const cloudRes = await fetch(
        `https://api.cloudinary.com/v1_1/${sigData.cloudName}/${type}/upload`,
        { method: 'POST', body: uploadData }
      );
      const resJson = await cloudRes.json();

      if (!cloudRes.ok) {
        throw new Error(resJson.error?.message || 'Upload failed');
      }

      return {
        url: resJson.secure_url,
        publicId: resJson.public_id,
        duration: resJson.duration ? Math.round(resJson.duration) : undefined,
      };
    } catch (err) {
      console.error('Upload error:', err);
      alert(`Upload error: ${err.message}`);
      return null;
    }
  };

  const handleVideoFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingVideo(true);
    const result = await uploadToCloudinary(file, 'video');
    if (result) {
      setFormData((prev) => ({
        ...prev,
        videoUrl: result.url,
        videoPublicId: result.publicId,
        duration: result.duration || prev.duration,
      }));
    }
    setUploadingVideo(false);
  };

  const handleThumbFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingThumb(true);
    const result = await uploadToCloudinary(file, 'image');
    if (result) {
      setFormData((prev) => ({
        ...prev,
        thumbnailUrl: result.url,
        thumbnailPublicId: result.publicId,
      }));
    }
    setUploadingThumb(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccessMsg('');

    const payload = {
      ...formData,
      tags: formData.tags ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      category: formData.category || undefined,
    };

    try {
      const url = isEdit ? `/api/admin/videos/${initialData._id}` : '/api/admin/videos';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save video');
      }

      setSuccessMsg(isEdit ? 'Video updated successfully!' : 'Video created successfully!');
      setTimeout(() => {
        router.push('/admin');
        router.refresh();
      }, 1000);
    } catch (err) {
      setError(err.message || 'An error occurred while saving.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', padding: '32px 0 64px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ margin: 0, fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '32px' }}>
          {isEdit ? 'Edit AI Video & Prompt' : 'Post New AI Video & Prompt'}
        </h1>
        <Link className="t" href="/admin" style={{ fontSize: '14px', fontWeight: 600, color: '#08788A' }}>
          ← Back to list
        </Link>
      </div>

      {error && (
        <div style={{ padding: '12px 16px', marginBottom: '20px', border: '1px solid #c02626', color: '#c02626', fontSize: '14px' }}>
          {error}
        </div>
      )}
      {successMsg && (
        <div style={{ padding: '12px 16px', marginBottom: '20px', border: '1px solid #08788A', color: '#08788A', fontSize: '14px' }}>
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
        {/* Title */}
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>
            Video Title *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={handleTitleChange}
            placeholder="e.g. Neon street in the rain"
            style={{
              width: '100%',
              padding: '10px 14px',
              border: '1px solid #13233F',
              background: 'transparent',
              fontSize: '15px',
              outline: 'none',
            }}
          />
        </div>

        {/* Slug */}
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>
            URL Slug * (auto-generated)
          </label>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ padding: '10px 12px', border: '1px solid #13233F', borderRight: 'none', fontSize: '14px', color: '#3A4A66', background: 'rgba(19,35,63,0.05)' }}>
              /v/
            </span>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
              style={{
                flex: 1,
                padding: '10px 14px',
                border: '1px solid #13233F',
                background: 'transparent',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>
        </div>

        {/* Prompt (Required, hidden by default from public visitors until unlocked) */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <label style={{ fontSize: '14px', fontWeight: 600 }}>
              AI Prompt * (Locked behind rewarded ad)
            </label>
            <span style={{ fontSize: '12px', color: '#08788A', fontWeight: 600 }}>
              Never exposed to visitors until unlocked
            </span>
          </div>
          <textarea
            required
            rows={5}
            value={formData.prompt}
            onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
            placeholder="Paste the full generation prompt, camera directives, lighting styles, parameters..."
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #13233F',
              background: 'transparent',
              fontSize: '14px',
              lineHeight: 1.5,
              outline: 'none',
              resize: 'vertical',
            }}
          />
        </div>

        {/* AI Tool & Category Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>
              AI Tool Used
            </label>
            <input
              type="text"
              value={formData.aiTool}
              onChange={(e) => setFormData({ ...formData, aiTool: e.target.value })}
              placeholder="Sora, Veo, Kling, Runway, Midjourney..."
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid #13233F',
                background: 'transparent',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid #13233F',
                background: '#E3F2F6',
                fontSize: '14px',
                outline: 'none',
              }}
            >
              <option value="">Select a category...</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Video Upload / URL */}
        <div style={{ border: '1px solid #13233F', padding: '16px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>
            Video File / Cloudinary URL
          </label>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '10px' }}>
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoFileChange}
              disabled={uploadingVideo}
              style={{ fontSize: '13px' }}
            />
            {uploadingVideo && <span style={{ fontSize: '13px', color: '#08788A' }}>Uploading to Cloudinary...</span>}
          </div>
          <input
            type="text"
            value={formData.videoUrl}
            onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
            placeholder="Or enter direct Cloudinary / MP4 video URL"
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #9DC7D1',
              background: 'transparent',
              fontSize: '13px',
              outline: 'none',
            }}
          />
        </div>

        {/* Thumbnail Upload / URL */}
        <div style={{ border: '1px solid #13233F', padding: '16px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>
            Thumbnail / Poster Image
          </label>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '10px' }}>
            <input
              type="file"
              accept="image/*"
              onChange={handleThumbFileChange}
              disabled={uploadingThumb}
              style={{ fontSize: '13px' }}
            />
            {uploadingThumb && <span style={{ fontSize: '13px', color: '#08788A' }}>Uploading to Cloudinary...</span>}
          </div>
          <input
            type="text"
            value={formData.thumbnailUrl}
            onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
            placeholder="Or enter direct image / poster URL"
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #9DC7D1',
              background: 'transparent',
              fontSize: '13px',
              outline: 'none',
            }}
          />
        </div>

        {/* Duration & Tags */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>
              Duration (sec)
            </label>
            <input
              type="number"
              min="1"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid #13233F',
                background: 'transparent',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="rain, neon, cyberpunk, cinematic, 4k"
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid #13233F',
                background: 'transparent',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>
        </div>

        {/* Status & Featured */}
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center', padding: '12px 0' }}>
          <div>
            <label style={{ fontSize: '14px', fontWeight: 600, marginRight: '12px' }}>Status:</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              style={{
                padding: '6px 12px',
                border: '1px solid #13233F',
                background: '#E3F2F6',
                fontSize: '14px',
              }}
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            />
            Featured Video (pins to trending hero)
          </label>
        </div>

        {/* Submit */}
        <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
          <button
            type="submit"
            disabled={submitting}
            style={{
              background: '#13233F',
              color: '#ffffff',
              padding: '14px 28px',
              borderRadius: '2px',
              fontWeight: 600,
              fontSize: '15px',
              cursor: submitting ? 'default' : 'pointer',
              border: 'none',
            }}
          >
            {submitting ? 'Saving video...' : isEdit ? 'Update Video' : 'Publish Video'}
          </button>
          <Link
            href="/admin"
            style={{
              display: 'inline-block',
              padding: '14px 24px',
              border: '1px solid #13233F',
              color: '#13233F',
              borderRadius: '2px',
              fontWeight: 600,
              fontSize: '15px',
            }}
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
