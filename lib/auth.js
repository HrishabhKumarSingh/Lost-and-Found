import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_development_secret_32_characters_long_for_security';

/**
 * Sign a new cryptographic JWT token for an authenticated user
 */
export function signToken(user) {
  const payload = {
    userId: String(user._id),
    email: user.email,
    firstname: user.firstname,
    lastname: user.lastname,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d',
    algorithm: 'HS256',
  });
}

/**
 * Verify a JWT token string
 */
export function verifyToken(token) {
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
  } catch (err) {
    return null;
  }
}

/**
 * Extract and verify authenticated user from request Authorization header
 */
export function getAuthUser(request) {
  try {
    const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    const token = authHeader.split(' ')[1];
    return verifyToken(token);
  } catch (err) {
    return null;
  }
}
