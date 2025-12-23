import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Logging Interceptors
apiClient.interceptors.request.use((request) => {
  console.group('🚀 API Request:', request.url);
  console.log('Method:', request.method);
  console.log('Data:', request.data);
  console.groupEnd();

  // Attach Token if available
  const token = localStorage.getItem('token');
  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
  }

  return request;
});

apiClient.interceptors.response.use(
  (response) => {
    console.group('✅ API Response:', response.config.url);
    console.log('Status:', response.status);
    console.log('Data:', response.data);
    console.groupEnd();
    return response;
  },
  (error) => {
    console.group('❌ API Error:', error.config?.url);
    console.log('Message:', error.message);
    console.log('Response:', error.response?.data);
    console.groupEnd();

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export { apiClient };
export default apiClient;
