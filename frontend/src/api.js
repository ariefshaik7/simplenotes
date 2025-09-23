import axios from 'axios';
// Change the baseURL to a relative path.
// The Ingress will now handle routing the request to the correct service.
const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use(config => {
  const token = sessionStorage.getItem('token');
  if (token) { config.headers['x-access-token'] = token; }
  return config;
}, error => Promise.reject(error));

api.interceptors.response.use(response => response, error => {
    if (error.response && error.response.status === 401) {
        sessionStorage.removeItem('token');
        window.location.href = '/login';
    }
    return Promise.reject(error);
});

export default api;