import express from 'express';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /me
 * Get authenticated user information
 * Protected route - requires valid Firebase token
 */
router.get('/me', authenticate, (req, res) => {
  res.json({
    success: true,
    user: {
      uid: req.user.uid,
      email: req.user.email,
      emailVerified: req.user.emailVerified,
      name: req.user.name,
      picture: req.user.picture
    }
  });
});

export default router;
