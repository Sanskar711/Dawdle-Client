import axios from 'axios';
import Cookies from 'js-cookie';

const environment = process.env.REACT_APP_ENVIRONMENT?.trim().toLowerCase();

// Set baseURL based on environment
const url = environment === 'production' 
  ? process.env.REACT_APP_API_URL  
  : 'http://127.0.0.1:8000';  // Default to development server if not production


// Create an Axios instance with default settings
const api = axios.create({
  baseURL: url, 
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
  if (token && !config.url.includes('/clients/signin')) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
