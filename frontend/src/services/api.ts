import axios from 'axios';

const DEVELOPMENT_BACKEND_URL = 'http://localhost:5001/api';
const DEPLOYED_BACKEND_URL = 'https://agilite-assignment.onrender.com/api';
// We will route here if "dev" is in the Vercel URL! Feel free to update this:
const STAGING_BACKEND_URL = 'https://agilite-assignment-1.onrender.com/api'; 
const FAKE_STORE_URL = 'https://api.escuelajs.co/api/v1';

const getBackendUrl = () => {
  // 1. Highest Priority: Explicit Vercel Environment Variables Configuration
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  
  // 2. Automatic Branch Detection via Hostname (Catching the "-dev" URL you shared!)
  if (typeof window !== 'undefined' && window.location.hostname.includes('-dev')) {
    return STAGING_BACKEND_URL;
  }
  
  // 3. Standard Fallbacks
  return import.meta.env.PROD ? DEPLOYED_BACKEND_URL : DEVELOPMENT_BACKEND_URL;
};

export const apiClient = axios.create({
  baseURL: getBackendUrl(),
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('app_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
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
  verifyGoogleToken: (credential: string) => apiClient.post<{ token: string; user: any }>('/auth/google', { credential }),

  getProducts: () => storeClient.get<Product[]>('/products'),
  getProductById: (id: number) => storeClient.get<Product>(`/products/${id}`),

  createTicket: (data: Partial<Ticket>) => apiClient.post<Ticket>('/tickets', data),
  getTickets: (params?: { status?: string, email?: string }) => apiClient.get<Ticket[]>('/tickets', { params }),
  getTicketById: (id: string) => apiClient.get<Ticket & { replies: Reply[] }>(`/tickets/${id}`),
  addReply: (id: string, message: string, isAdmin = false) => apiClient.post<Reply>(`/tickets/${id}/replies`, { message, isAdmin }),
  closeTicket: (id: string) => apiClient.patch<Ticket>(`/tickets/${id}/close`),
};
