import { ACCESS_TOKEN, BACKEND_BASE_URL } from '@/Constant/Index';
import axios from 'axios';
import { setupCache } from 'axios-cache-adapter';

const cache = setupCache({
  maxAge: 15 * 60 * 1000,
  exclude: {
    methods: ['put', 'patch', 'delete', 'post'],
  },
});

export const api = axios.create({
  baseURL: BACKEND_BASE_URL,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    Authorization: `Bearer ${ACCESS_TOKEN}`,
  },
  adapter: cache.adapter,
});
