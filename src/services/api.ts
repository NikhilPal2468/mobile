import { useAuthStore } from '../store/authStore';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

// Log which backend is used (only in dev)
if (__DEV__) {
  console.log('[API] Base URL:', API_URL);
}

const logRequest = (url: string, method: string) => {
  if (__DEV__) {
    console.log('[API]', method, url);
  }
};

// Helper function to make API calls
const apiCall = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const fullUrl = `${API_URL}/api${endpoint}`;
  const method = (options.method || 'GET').toUpperCase();
  logRequest(fullUrl, method);

  const token = useAuthStore.getState().token;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(fullUrl, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Handle unauthorized - logout user
    useAuthStore.getState().logout();
  }

  if (__DEV__) {
    console.log('[API]', method, fullUrl, '->', response.status);
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response;
};

// Auth API
export const authAPI = {
  sendOTP: async (phone: string) => {
    const response = await apiCall('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    });
    return { data: await response.json() };
  },
  
  verifyOTP: async (phone: string, otp: string) => {
    const response = await apiCall('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, otp }),
    });
    return { data: await response.json() };
  },
};

// Application API
export const applicationAPI = {
  get: async () => {
    const response = await apiCall('/application');
    return { data: await response.json() };
  },
  
  saveStep: async (stepNumber: number, data: any) => {
    const response = await apiCall(`/application/step/${stepNumber}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return { data: await response.json() };
  },
  
  savePreferences: async (preferences: any[]) => {
    const response = await apiCall('/application/preferences', {
      method: 'POST',
      body: JSON.stringify({ preferences }),
    });
    return { data: await response.json() };
  },
  
  submit: async () => {
    const response = await apiCall('/application/submit', {
      method: 'POST',
    });
    return { data: await response.json() };
  },
};

// Documents API
export const documentsAPI = {
  upload: async (file: any, type: string) => {
    const token = useAuthStore.getState().token;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const headers: HeadersInit = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const uploadUrl = `${API_URL}/api/documents/upload`;
    logRequest(uploadUrl, 'POST');

    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (__DEV__) {
      console.log('[API] POST', uploadUrl, '->', response.status);
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(error.error || 'Upload failed');
    }

    return { data: await response.json() };
  },
  
  get: async () => {
    const response = await apiCall('/documents');
    return { data: await response.json() };
  },
  
  delete: async (id: string) => {
    const response = await apiCall(`/documents/${id}`, {
      method: 'DELETE',
    });
    return { data: await response.json() };
  },
};

// PDF API
export const pdfAPI = {
  generate: async () => {
    const response = await apiCall('/pdf/generate', {
      method: 'POST',
    });
    return { data: await response.json() };
  },
  
  get: async () => {
    const response = await apiCall('/pdf');
    return response;
  },
};

// AI API
export const aiAPI = {
  chat: async (message: string, currentStep: number) => {
    const response = await apiCall('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message, currentStep }),
    });
    return { data: await response.json() };
  },
};

// Explore API
export const exploreAPI = {
  get: async (params?: any) => {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    const response = await apiCall(`/explore${queryString}`);
    return { data: await response.json() };
  },
  
  getById: async (id: string) => {
    const response = await apiCall(`/explore/${id}`);
    return { data: await response.json() };
  },
};

// Seed Data API
export const seedAPI = {
  get: async (type: string, code?: string) => {
    const queryString = code ? `?code=${code}` : '';
    const response = await apiCall(`/seed/${type}${queryString}`);
    return { data: await response.json() };
  },
};

// Payment API (Razorpay)
export const paymentAPI = {
  createOrder: async (amount: number) => {
    const response = await apiCall('/payment/create-order', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
    return { data: await response.json() };
  },
  verify: async (orderId: string, paymentId: string, signature: string) => {
    const response = await apiCall('/payment/verify', {
      method: 'POST',
      body: JSON.stringify({ orderId, paymentId, signature }),
    });
    return { data: await response.json() };
  },
  getStatus: async () => {
    const response = await apiCall('/payment/status');
    return { data: await response.json() };
  },
};
