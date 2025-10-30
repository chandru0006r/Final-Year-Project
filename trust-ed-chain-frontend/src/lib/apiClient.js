import axios from 'axios';
import '../mock/api.js';

export const apiClient = axios.create({
  baseURL: '/api',
});

export default apiClient;
