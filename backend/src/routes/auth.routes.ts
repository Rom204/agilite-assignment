import { Router, Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';

const router = Router();

router.post('/google', async (req: Request, res: Response): Promise<any> => {
  const { credential } = req.body;
  
  if (!credential) {
    return res.status(400).json({ error: 'Missing Google credential' });
  }

  try {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    
    // 1. Verify Google Token securely using Google's public keys
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return res.status(400).json({ error: 'Invalid Google payload' });
    }

    const email = payload.email.toLowerCase();
    
    // 2. Determine Role statelessly based on Environment Variable
    const adminEmail = (process.env.ADMIN_EMAIL || '').toLowerCase();
    const role = email === adminEmail ? 'admin' : 'customer';

    // 3. Issue our own Application JWT Session
    const jwtPayload = { email, role };
    const sessionToken = jwt.sign(jwtPayload, process.env.JWT_SECRET as string, { expiresIn: '7d' });

    // 4. Return Session Token and User Data
    return res.status(200).json({
      token: sessionToken,
      user: {
        email,
        name: payload.name,
        picture: payload.picture,
        role
      }
    });

  } catch (error: any) {
    console.error('Google Auth Error:', error.message);
    return res.status(401).json({ error: 'Failed to authenticate with Google' });
  }
});

export default router;
