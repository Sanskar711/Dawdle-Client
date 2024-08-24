import axios from 'axios';
import Cookies from 'js-cookie';

// Create an Axios instance with default settings
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  withCredentials: true,  // Ensure credentials are sent with requests
});

// Function to fetch the CSRF token from the backend
// export const fetchCSRFToken = async () => {
//   try {
//     const response = await api.get('/users/public/csrf-token/');
//     const csrfToken = response.data.csrfToken;
//     Cookies.set('csrftoken', csrfToken, { secure: true});
//     return csrfToken;
//   } catch (error) {
//     console.error('Error fetching CSRF token:', error);
//   }
// };

// Add a request interceptor to include the token in headers
api.interceptors.request.use(async (config) => {
  const csrfToken = Cookies.get('csrftoken');
  config.headers['X-CSRFToken'] = csrfToken;

  const token = Cookies.get('token');
  if (token && !config.url.includes('/users/signin')) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
