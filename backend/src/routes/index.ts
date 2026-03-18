import { Router } from 'express';
import ticketRoutes from './ticket.routes';
// import productRoutes from './product.routes'; // Future expansion

const router = Router();

// Mount all ticket routes under the /tickets path
router.use('/tickets', ticketRoutes);

// router.use('/products', productRoutes); // Future expansion

export default router;