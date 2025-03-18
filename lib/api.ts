import axios from 'axios';

const api = axios.create({
  baseURL: 'http://go04g4woko84gssww4so4oss.92.112.181.229.sslip.io/api',
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', response.data.token);
    return response.data;
  },
  register: async (email: string, password: string) => {
    const response = await api.post('/auth/register', { email, password });
    localStorage.setItem('token', response.data.token);
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
  },
};

export const transactions = {
  getAll: async () => {
    const response = await api.get('/transactions');
    return response.data;
  },
  create: async (transaction: {
    type: 'income' | 'expense';
    amount: number;
    category: string;
    description?: string;
    date?: Date;
  }) => {
    const response = await api.post('/transactions', transaction);
    return response.data;
  },
  update: async (
    id: string,
    transaction: {
      type: 'income' | 'expense';
      amount: number;
      category: string;
      description?: string;
      date?: Date;
    }
  ) => {
    const response = await api.put(`/transactions/${id}`, transaction);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/transactions/${id}`);
    return response.data;
  },
};