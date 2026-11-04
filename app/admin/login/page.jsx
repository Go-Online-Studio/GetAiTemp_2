'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      router.push('/admin');
      router.refresh();
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: '#E3F2F6',
      color: '#13233F',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        border: '1px solid #13233F',
        padding: '36px 28px',
        background: '#E3F2F6',
        borderRadius: '2px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <Link href="/" style={{ display: 'inline-block', lineHeight: 1 }}>
            <Image
              src="/images/logo.png"
              alt="GetYourAIPrompt"
              width={180}
              height={49}
              priority
              style={{
                height: '44px',
                width: 'auto',
                mixBlendMode: 'multiply',
                display: 'block',
                margin: '0 auto',
              }}
            />
          </Link>
          <div style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 600,
            fontSize: '18px',
            marginTop: '20px',
            color: '#13233F',
          }}>
            Admin Login
          </div>
        </div>

        {error && (
          <div style={{
            padding: '10px 14px',
            marginBottom: '20px',
            border: '1px solid #c02626',
            color: '#c02626',
            fontSize: '13px',
            borderRadius: '2px',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#13233F' }}>
              Admin Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@getyouraiprompt.com"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #13233F',
                background: 'transparent',
                fontSize: '14px',
                color: '#13233F',
                borderRadius: '2px',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#13233F' }}>
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #13233F',
                background: 'transparent',
                fontSize: '14px',
                color: '#13233F',
                borderRadius: '2px',
                outline: 'none',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: '#13233F',
              color: '#ffffff',
              padding: '12px',
              borderRadius: '2px',
              fontWeight: 600,
              fontSize: '15px',
              cursor: loading ? 'default' : 'pointer',
              border: 'none',
              marginTop: '8px',
            }}
          >
            {loading ? 'Authenticating...' : 'Sign in to dashboard'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Link className="t" href="/" style={{ fontSize: '13px', color: '#08788A' }}>
            ← Back to public website
          </Link>
        </div>
      </div>
    </div>
  );
}
