import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: { 
    email: string; 
    role: 'admin' | 'customer';
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): any => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    req.user = decoded; // Mount the verified user payload onto the request
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Forbidden: Invalid or expired token' });
  }
};
