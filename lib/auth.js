import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import connectToDatabase from './mongodb';
import Admin from '../models/Admin';

const JWT_SECRET = process.env.JWT_SECRET || 'getyouraiprompt_default_secret_key_change_in_production';
const COOKIE_NAME = 'admin_token';

/**
 * Sign JWT token for admin session
 */
export function signToken(payload, expiresIn = '7d') {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

/**
 * Verify JWT token
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

/**
 * Authenticate admin with email and plain password
 */
export async function authenticateAdmin(email, password) {
  // 1. Check environment variables first
  const envEmail = process.env.ADMIN_EMAIL;
  const envHash = process.env.ADMIN_PASSWORD_HASH;

  if (envEmail && envHash && email.toLowerCase() === envEmail.toLowerCase()) {
    const isMatch = await bcrypt.compare(password, envHash);
    if (isMatch) {
      return { email: envEmail, role: 'admin' };
    }
  }

  // 2. Fallback check in Admin collection if connected
  try {
    await connectToDatabase();
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (admin && admin.passwordHash) {
      const isMatch = await bcrypt.compare(password, admin.passwordHash);
      if (isMatch) {
        return { email: admin.email, role: 'admin', id: admin._id };
      }
    }
  } catch (err) {
    console.error('Admin DB lookup error:', err.message);
  }

  return null;
}

/**
 * Extract auth user from Next.js request (cookies or Authorization header)
 */
export function getAuthUserFromRequest(request) {
  let token = null;

  // Check cookies
  if (request.cookies) {
    if (typeof request.cookies.get === 'function') {
      token = request.cookies.get(COOKIE_NAME)?.value;
    } else {
      token = request.cookies[COOKIE_NAME];
    }
  }

  // Check Authorization header fallback
  if (!token && request.headers) {
    const authHeader = typeof request.headers.get === 'function'
      ? request.headers.get('authorization')
      : request.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }

  if (!token) return null;
  return verifyToken(token);
}

export { COOKIE_NAME };
