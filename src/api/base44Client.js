// API client for Django backend

const API_BASE_URL = 'http://localhost:8001/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  return response.json();
};

export const base44 = {
  auth: {
    login: async (username, password) => {
      const response = await fetch(`${API_BASE_URL}/token/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) throw new Error('Login failed');
      const data = await response.json();
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      return data;
    },
    me: async () => {
      return apiRequest('/users/me/');
    },
    updateMe: async (data) => {
      const response = await fetch(`${API_BASE_URL}/users/me/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Update failed');
      return response.json();
    },
    register: async (userData) => {
      const response = await fetch(`${API_BASE_URL}/users/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.detail || errorData.username || errorData.email || 'Registration failed';
        throw new Error(errorMessage);
      }
      return response.json();
    },
  },
  entities: {
    Gym: {
      list: async (options = {}) => {
        return apiRequest('/gyms/');
      },
      filter: async (filters = {}, sort = '', limit = 100) => {
        const params = new URLSearchParams();
        Object.keys(filters).forEach(key => {
          if (filters[key]) params.append(key, filters[key]);
        });
        return apiRequest(`/gyms/?${params.toString()}`);
      },
      create: async (data) => {
        return apiRequest('/gyms/', {
          method: 'POST',
          body: JSON.stringify(data),
        });
      },
    },
    Membership: {
      filter: async (filters = {}, sort = '', limit = 100) => {
        return apiRequest('/memberships/');
      },
      create: async (data) => {
        return apiRequest('/memberships/', {
          method: 'POST',
          body: JSON.stringify(data),
        });
      },
      update: async (id, data) => {
        return apiRequest(`/memberships/${id}/`, {
          method: 'PUT',
          body: JSON.stringify(data),
        });
      },
    },
  },
  integrations: {
    Core: {
      UploadFile: async ({ file }) => {
        // TODO: Implement file upload
        return { file_url: "https://example.com/uploaded.jpg" };
      },
      InvokeLLM: async ({ prompt }) => {
        // TODO: Implement AI integration
        return "Thank you for your question. This is a mock AI response.";
      }
    }
  }
};