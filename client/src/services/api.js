const RAW_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const BASE_URL = RAW_BASE_URL.replace(/\/+$/, '');

export class ApiError extends Error {
  constructor(message, status, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

async function request(endpoint, options = {}) {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${BASE_URL}${cleanEndpoint}`;

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const storedToken = typeof window !== 'undefined' ? localStorage.getItem('kaaryamithra_token') : null;
  if (storedToken) {
    headers['Authorization'] = `Bearer ${storedToken}`;
  }

  const config = {
    ...options,
    headers,
    credentials: 'include', // Automatically passes and receives httpOnly auth cookies
  };

  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(url, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(data.message || 'An unexpected error occurred', response.status, data.errors);
  }

  return data;
}

export const api = {
  get: (endpoint, query) => {
    let url = endpoint;
    if (query) {
      const cleanParams = Object.entries(query).filter(([_, v]) => v !== undefined && v !== null && v !== '');
      if (cleanParams.length > 0) {
        const search = new URLSearchParams(cleanParams).toString();
        url += (url.includes('?') ? '&' : '?') + search;
      }
    }
    return request(url, { method: 'GET' });
  },
  post: (endpoint, body) => request(endpoint, { method: 'POST', body }),
  patch: (endpoint, body) => request(endpoint, { method: 'PATCH', body }),
  delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
};
