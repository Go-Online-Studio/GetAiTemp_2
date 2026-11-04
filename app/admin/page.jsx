'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [videos, setVideos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('videos'); // 'videos' | 'categories'

  // Category creation state
  const [newCatName, setNewCatName] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');
  const [catMessage, setCatMessage] = useState('');

  const fetchVideos = async () => {
    try {
      const res = await fetch(`/api/admin/videos?search=${encodeURIComponent(searchTerm)}&limit=50`);
      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }
      const data = await res.json();
      setVideos(data.videos || []);
    } catch (err) {
      console.error('Error fetching admin videos:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories');
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  useEffect(() => {
    Promise.all([fetchVideos(), fetchCategories()]).finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchVideos();
  };

  const handleTogglePublish = async (video) => {
    const newStatus = video.status === 'published' ? 'draft' : 'published';
    try {
      const res = await fetch(`/api/admin/videos/${video._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setVideos(videos.map((v) => (v._id === video._id ? { ...v, status: newStatus } : v)));
      }
    } catch (err) {
      console.error('Toggle status error:', err);
    }
  };

  const handleDeleteVideo = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/videos/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setVideos(videos.filter((v) => v._id !== id));
      }
    } catch (err) {
      alert('Failed to delete video');
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    setCatMessage('');
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCatName, slug: newCatSlug || newCatName.toLowerCase().replace(/\s+/g, '-') }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create category');
      setNewCatName('');
      setNewCatSlug('');
      setCatMessage('Category created successfully!');
      fetchCategories();
    } catch (err) {
      setCatMessage(err.message);
    }
  };

  const handleDeleteCategory = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCategories(categories.filter((c) => c._id !== id));
      }
    } catch (err) {
      alert('Failed to delete category');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const filteredVideos = videos.filter((v) => {
    if (statusFilter === 'all') return true;
    return v.status === statusFilter;
  });

  return (
    <div style={{ background: '#E3F2F6', color: '#13233F', minHeight: '100vh', padding: '0 24px 64px' }}>
      <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
        {/* Admin Navigation Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '24px 0',
          borderBottom: '1px solid #13233F',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
              <Image
                src="/images/logo.png"
                alt="GetYourAIPrompt"
                width={132}
                height={36}
                priority
                style={{
                  height: '32px',
                  width: 'auto',
                  mixBlendMode: 'multiply',
                  display: 'block',
                }}
              />
              <span style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: '9px',
                fontWeight: 700,
                letterSpacing: '0.18em',
                background: '#13233F',
                color: '#ffffff',
                padding: '3px 7px',
                borderRadius: '2px',
                lineHeight: 1,
              }}>
                ADMIN
              </span>
            </Link>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setActiveTab('videos')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '2px',
                  fontSize: '13px',
                  fontWeight: 600,
                  background: activeTab === 'videos' ? '#13233F' : 'transparent',
                  color: activeTab === 'videos' ? '#ffffff' : '#13233F',
                  border: '1px solid #13233F',
                }}
              >
                Videos ({videos.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('categories')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '2px',
                  fontSize: '13px',
                  fontWeight: 600,
                  background: activeTab === 'categories' ? '#13233F' : 'transparent',
                  color: activeTab === 'categories' ? '#ffffff' : '#13233F',
                  border: '1px solid #13233F',
                }}
              >
                Categories ({categories.length})
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link
              href="/admin/new"
              style={{
                background: '#08788A',
                color: '#ffffff',
                padding: '8px 16px',
                borderRadius: '2px',
                fontWeight: 600,
                fontSize: '14px',
              }}
            >
              + New Video
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="t"
              style={{ fontSize: '14px', fontWeight: 600, color: '#3A4A66' }}
            >
              Sign out
            </button>
          </div>
        </div>

        {activeTab === 'videos' ? (
          <div style={{ marginTop: '32px' }}>
            {/* Search and Filters */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' }}>
              <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', flex: 1, maxWidth: '440px' }}>
                <input
                  type="text"
                  placeholder="Search title, slug, tool, tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    border: '1px solid #13233F',
                    background: 'transparent',
                    fontSize: '14px',
                    color: '#13233F',
                    borderRadius: '2px',
                    outline: 'none',
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: '#13233F',
                    color: '#ffffff',
                    padding: '8px 16px',
                    borderRadius: '2px',
                    fontWeight: 600,
                    fontSize: '14px',
                  }}
                >
                  Search
                </button>
              </form>

              <div style={{ display: 'flex', gap: '8px' }}>
                {['all', 'published', 'draft'].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatusFilter(s)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '2px',
                      fontSize: '13px',
                      fontWeight: 600,
                      textTransform: 'capitalize',
                      background: statusFilter === s ? '#13233F' : 'transparent',
                      color: statusFilter === s ? '#ffffff' : '#13233F',
                      border: '1px solid #13233F',
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Videos Table */}
            {loading ? (
              <div style={{ padding: '40px 0', textAlign: 'center', color: '#3A4A66' }}>Loading videos...</div>
            ) : filteredVideos.length === 0 ? (
              <div style={{ padding: '40px 0', textAlign: 'center', color: '#3A4A66', border: '1px dashed #13233F' }}>
                No videos found. Click &quot;+ New Video&quot; to post your first AI prompt!
              </div>
            ) : (
              <div style={{ overflowX: 'auto', border: '1px solid #13233F' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ background: '#13233F', color: '#ffffff' }}>
                      <th style={{ padding: '12px 16px', fontWeight: 600 }}>Title</th>
                      <th style={{ padding: '12px 16px', fontWeight: 600 }}>Category</th>
                      <th style={{ padding: '12px 16px', fontWeight: 600 }}>AI Tool</th>
                      <th style={{ padding: '12px 16px', fontWeight: 600 }}>Views</th>
                      <th style={{ padding: '12px 16px', fontWeight: 600 }}>Unlocks</th>
                      <th style={{ padding: '12px 16px', fontWeight: 600 }}>Status</th>
                      <th style={{ padding: '12px 16px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVideos.map((video, idx) => (
                      <tr
                        key={video._id}
                        style={{
                          borderBottom: '1px solid #13233F',
                          background: idx % 2 === 0 ? 'transparent' : 'rgba(19, 35, 63, 0.03)',
                        }}
                      >
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ fontWeight: 600, color: '#13233F' }}>{video.title}</div>
                          <div style={{ fontSize: '12px', color: '#3A4A66' }}>/v/{video.slug}</div>
                        </td>
                        <td style={{ padding: '12px 16px', color: '#08788A', fontWeight: 600 }}>
                          {video.category?.name || '—'}
                        </td>
                        <td style={{ padding: '12px 16px' }}>{video.aiTool || 'Sora'}</td>
                        <td style={{ padding: '12px 16px' }}>{video.views || 0}</td>
                        <td style={{ padding: '12px 16px', fontWeight: 600, color: '#08788A' }}>
                          {video.unlocks || 0}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <button
                            type="button"
                            onClick={() => handleTogglePublish(video)}
                            style={{
                              padding: '4px 8px',
                              borderRadius: '2px',
                              fontSize: '11px',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                              border: '1px solid #13233F',
                              background: video.status === 'published' ? '#08788A' : 'transparent',
                              color: video.status === 'published' ? '#ffffff' : '#13233F',
                              cursor: 'pointer',
                            }}
                          >
                            {video.status}
                          </button>
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '12px' }}>
                            <Link className="t" href={`/v/${video.slug}`} target="_blank" style={{ color: '#08788A', fontWeight: 600 }}>
                              View
                            </Link>
                            <Link className="t" href={`/admin/edit/${video._id}`} style={{ color: '#13233F', fontWeight: 600 }}>
                              Edit
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleDeleteVideo(video._id, video.title)}
                              className="t"
                              style={{ color: '#c02626', fontWeight: 600, cursor: 'pointer' }}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          /* Categories Tab */
          <div style={{ marginTop: '32px', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px' }}>
            <div>
              <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '22px', marginBottom: '16px' }}>
                All Categories
              </h2>
              <div style={{ border: '1px solid #13233F' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ background: '#13233F', color: '#ffffff' }}>
                      <th style={{ padding: '10px 14px' }}>Name</th>
                      <th style={{ padding: '10px 14px' }}>Slug</th>
                      <th style={{ padding: '10px 14px', textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((cat) => (
                      <tr key={cat._id} style={{ borderBottom: '1px solid #13233F' }}>
                        <td style={{ padding: '10px 14px', fontWeight: 600 }}>{cat.name}</td>
                        <td style={{ padding: '10px 14px', color: '#3A4A66' }}>{cat.slug}</td>
                        <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(cat._id, cat.name)}
                            className="t"
                            style={{ color: '#c02626', fontWeight: 600, cursor: 'pointer' }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '22px', marginBottom: '16px' }}>
                Add New Category
              </h2>
              {catMessage && (
                <div style={{ padding: '10px', marginBottom: '14px', border: '1px solid #13233F', fontSize: '13px' }}>
                  {catMessage}
                </div>
              )}
              <form onSubmit={handleCreateCategory} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>
                    Category Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newCatName}
                    onChange={(e) => {
                      setNewCatName(e.target.value);
                      if (!newCatSlug) {
                        setNewCatSlug(e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
                      }
                    }}
                    placeholder="e.g. Cinematic, Fantasy, Anime"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #13233F',
                      background: 'transparent',
                      fontSize: '14px',
                      borderRadius: '2px',
                      outline: 'none',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>
                    Slug
                  </label>
                  <input
                    type="text"
                    required
                    value={newCatSlug}
                    onChange={(e) => setNewCatSlug(e.target.value)}
                    placeholder="e.g. cinematic"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #13233F',
                      background: 'transparent',
                      fontSize: '14px',
                      borderRadius: '2px',
                      outline: 'none',
                    }}
                  />
                </div>
                <button
                  type="submit"
                  style={{
                    background: '#13233F',
                    color: '#ffffff',
                    padding: '10px 16px',
                    borderRadius: '2px',
                    fontWeight: 600,
                    fontSize: '14px',
                    cursor: 'pointer',
                    border: 'none',
                    alignSelf: 'flex-start',
                  }}
                >
                  Create Category
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
