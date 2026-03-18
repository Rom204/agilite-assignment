import axios from 'axios';

const BACKEND_URL = 'http://localhost:5001/api';
const FAKE_STORE_URL = 'https://api.escuelajs.co/api/v1';

export const apiClient = axios.create({
  baseURL: BACKEND_URL,
});

export const storeClient = axios.create({
  baseURL: FAKE_STORE_URL,
});

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  images: string[];
  category: {
    id: number;
    name: string;
    image: string;
  };
}

export interface Ticket {
  id: string;
  email: string;
  name: string;
  subject: string;
  message: string;
  productId: number;
  status: string;
  createdAt: string;
  _count?: {
    replies: number;
  }
}

export interface Reply {
  id: string;
  message: string;
  isAdmin: boolean;
  createdAt: string;
  ticketId: string;
}

export const API = {
  getProducts: () => storeClient.get<Product[]>('/products'),
  getProductById: (id: number) => storeClient.get<Product>(`/products/${id}`),
  
  createTicket: (data: Partial<Ticket>) => apiClient.post<Ticket>('/tickets', data),
  getTickets: (status?: string) => apiClient.get<Ticket[]>('/tickets', { params: { status } }),
  getTicketById: (id: string) => apiClient.get<Ticket & { replies: Reply[] }>(`/tickets/${id}`),
  addReply: (id: string, message: string, isAdmin = false) => apiClient.post<Reply>(`/tickets/${id}/replies`, { message, isAdmin }),
  closeTicket: (id: string) => apiClient.patch<Ticket>(`/tickets/${id}/close`),
};
