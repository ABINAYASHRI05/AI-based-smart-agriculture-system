import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api',
});

API.interceptors.request.use(function(config) {
  const token = localStorage.getItem('agri_token');
  if (token) {
    config.headers.Authorization = 'Bearer ' + token;
  }
  return config;
});

API.interceptors.response.use(
  function(response) { return response; },
  function(error) {
    if (error.response
        && error.response.status === 401) {
      const path = window.location.pathname;
      const protectedPaths = [
        '/crop', '/disease', '/satellite'
      ];
      const isProtected = protectedPaths.some(
        function(p) { return path.startsWith(p); }
      );
      if (isProtected) {
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default API;