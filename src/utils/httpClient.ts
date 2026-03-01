'use client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Token is now stored in httpOnly cookies (set by backend)
// Frontend can't directly access it for security

let isRefreshing = false;

let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// --- Token Helpers ------------------------------------------------------------------
// Note: Token is stored in httpOnly cookies by the backend
// Frontend can only read it for display purposes (optional)

export const setToken = (token: string) => { 
  // Backend should set httpOnly cookie, this is just for display/state management
  // Store in sessionStorage (cleared on browser close, XSS-safe if used read-only)
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('accessToken', token);
  }
};

export const clearToken = () => {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('accessToken');
  }
};

export const getToken = () => {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('accessToken');
  }
  return null;
};

// ------------------------------------------------------------------------------------

interface CustomRequestInit extends RequestInit {
  _retry?: boolean;
}

// --- Helper com interceptor ---------------------------------------------------------

const request = async <T>(endpoint: string, options: CustomRequestInit = {}): Promise<T> => {  
  const url = `${API_BASE_URL}${endpoint}`;
  const config: RequestInit = {
    ...options,
    credentials: 'include', // Automatically sends httpOnly cookies
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const response = await fetch(url, config);

  if (response.status === 401) {
    if (endpoint.includes('login') || endpoint.includes('register')) {
      clearToken();  
      const data = await response.json().catch(() => ({ message: 'Session expired' }));
      throw new Error(data.message || 'Session expired');
    }

    if(options._retry) {
      clearToken();
      throw new Error('Session expired (Repeated 401)');
    }

    // For 401 errors on retry or auth-free endpoints, clear token and throw
    clearToken();
    throw new Error('Session expired');
  }

  if (response.status === 204) return {} as T;

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || data.error || 'An error occurred');
  }

  return data;
};

// ------------------------------------------------------------------------------------

// --- HTTP Client --------------------------------------------------------------------

export const httpClient = {
  get: <T>(endpoint: string, options?: RequestInit) => 
    request<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body?: any, options?: RequestInit) => 
    request<T>(endpoint, { 
      ...options, 
      method: 'POST', 
      body: body ? JSON.stringify(body) : undefined 
    }),

  put: <T>(endpoint: string, body?: any, options?: RequestInit) => 
    request<T>(endpoint, { 
      ...options, 
      method: 'PUT', 
      body: body ? JSON.stringify(body) : undefined 
    }),

  del: <T>(endpoint: string, options?: RequestInit) => 
    request<T>(endpoint, { ...options, method: 'DELETE' }),

  patch: <T>(endpoint: string, body?: any, options?: RequestInit) => 
    request<T>(endpoint, { 
      ...options, 
      method: 'PATCH', 
      body: body ? JSON.stringify(body) : undefined 
    }),


  getBlob: async (endpoint: string, options?: CustomRequestInit): Promise<Blob> => {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = getToken();
    const config: RequestInit = {
      ...options,
      method: 'GET',
      credentials: 'include',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options?.headers,
      },
    };

    const response = await fetch(url, config);

    if (response.status === 401 && !options?._retry) {
      if (isRefreshing) {
        return new Promise<Blob>((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              const retryOptions = { ...options, _retry: true };
              resolve(httpClient.getBlob(endpoint, retryOptions));
            },
            reject
          });
        });
      }

      isRefreshing = true;

      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/api/auth/current-user`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include'
        });

        if (!refreshResponse.ok) throw new Error('Refresh failed');

        const data = await refreshResponse.json();
        setToken(data.accessToken);
        processQueue(null, data.accessToken);

        return httpClient.getBlob(endpoint, { ...options, _retry: true });
      } catch (err) {
        processQueue(err, null);
        clearToken();
        throw err;
      } finally {
        isRefreshing = false;
      }
    }

    if (!response.ok) {
      const data = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(data.error || 'Request failed');
    }

    return response.blob();
  },
};
