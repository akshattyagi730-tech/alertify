import { verifyIdToken } from '../config/firebase.js';

/**
 * Firebase Authentication Middleware
 * 
 * Verifies Firebase ID token from Authorization header
 * Attaches decoded user info to req.user
 */
export const authenticate = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'No authorization header provided'
      });
    }

    // Extract token from "Bearer <token>" format
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'No token provided'
      });
    }

    // Verify token with Firebase
    const decodedToken = await verifyIdToken(token);

    // Attach user info to request object
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      emailVerified: decodedToken.email_verified,
      name: decodedToken.name,
      picture: decodedToken.picture,
      firebase: {
        identities: decodedToken.firebase?.identities,
        sign_in_provider: decodedToken.firebase?.sign_in_provider
      }
    };

    next();
  } catch (error) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: error.message || 'Invalid or expired token'
    });
  }
};

export default authenticate;
