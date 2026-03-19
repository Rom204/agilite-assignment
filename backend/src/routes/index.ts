import { Router } from 'express';
import ticketRoutes from './ticket.routes';
import authRoutes from './auth.routes';

const router = Router();

// Mount authentication under /auth
router.use('/auth', authRoutes);

// Mount all ticket routes under the /tickets path
router.use('/tickets', ticketRoutes);

// router.use('/products', productRoutes); // Future expansion

export default router;