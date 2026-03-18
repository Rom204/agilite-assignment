import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

/**
 * @desc    Create a new support ticket
 * @route   POST /api/tickets
 */
export const createTicket = async (req: Request, res: Response) => {
  try {
    const { name, email, subject, message, productId } = req.body;

    // 1. Basic Validation (Senior tip: check for missing fields early)
    if (!name || !email || !subject || !message || !productId) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // 2. Create the ticket in Neon
    const ticket = await prisma.ticket.create({
      data: {
        name,
        email,
        subject,
        message,
        productId: Number(productId),
      },
    });

    return res.status(201).json(ticket);
  } catch (error) {
    console.error("Error creating ticket:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * @desc    Get all tickets (for Admin Dashboard)
 * @route   GET /api/tickets
 */
export const getAllTickets = async (req: Request, res: Response) => {
  try {
    const { status, email } = req.query;
    const whereClause: any = {};
    if (status) whereClause.status = String(status);
    if (email) whereClause.email = String(email);

    const tickets = await prisma.ticket.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }, // Newest first
      include: {
        _count: {
          select: { replies: true } // Let's the admin see how many messages are in the thread
        }
      }
    });

    return res.json(tickets);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * @desc    Get a single ticket with all its replies
 * @route   GET /api/tickets/:id
 */
export const getTicketById = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: {
        replies: {
          orderBy: { createdAt: 'asc' } // Messages in chronological order
        }
      }
    });

    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    return res.json(ticket);
  } catch (error) {
    console.error("Error fetching ticket details:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * @desc    Add a reply to a specific ticket
 * @route   POST /api/tickets/:id/replies
 */
export const addReply = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { message, isAdmin } = req.body;

    // 1. Validation: Don't allow empty messages
    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Reply message cannot be empty" });
    }

    // 2. The "Solid" Check: Does the ticket even exist?
    const ticketExists = await prisma.ticket.findUnique({ where: { id } });
    if (!ticketExists) {
      return res.status(404).json({ error: "Cannot reply to a non-existent ticket" });
    }

    // 3. Create the Reply and link it to the Ticket
    const reply = await prisma.reply.create({
      data: {
        message,
        isAdmin: isAdmin || false, // Defaults to customer (false)
        ticketId: id,
      },
    });

    return res.status(201).json(reply);
  } catch (error) {
    console.error("Error adding reply:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const closeTicket = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const ticket = await prisma.ticket.update({
      where: { id },
      data: { status: "closed" }
    });
    return res.json(ticket);
  } catch (error) {
    console.error("Error closing ticket:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};