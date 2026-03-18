import { Router } from 'express';
import * as TicketController from '../controllers/ticket.controller';

const router = Router();

// 1. Create a new ticket
router.post('/', TicketController.createTicket);

// 2. Get all tickets (Admin view)
router.get('/', TicketController.getAllTickets);

// 3. Get a specific ticket + its conversation
router.get('/:id', TicketController.getTicketById);

// 4. Add a reply to a ticket
router.post('/:id/replies', TicketController.addReply);

// 5. Close a ticket (We'll add this logic soon!)
// router.patch('/:id/close', TicketController.closeTicket);

export default router;