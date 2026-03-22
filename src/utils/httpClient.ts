type JsonBody = Record<string, unknown> | unknown[] | object;

interface CustomRequestInit extends RequestInit {
  _retry?: boolean;
}

const request = async <T>(endpoint: string, options: CustomRequestInit = {}): Promise<T> => {  
  const url = `${endpoint}`;
  const hasBody = options.body !== undefined;
  const config: RequestInit = {
    ...options,
    credentials: 'include',
    headers: {
      ...(hasBody && { 'Content-Type': 'application/json' }),
      ...options.headers,
    },
  };

  const response = await fetch(url, config);

  if (response.status === 401) {
    const text = await response.text();
    let errorMessage = 'Sessão expirada';
    
    if (text) {
      try {
        const data = JSON.parse(text);
        errorMessage = data.message || data.error || errorMessage;
      } catch {
        // Keep the default error message if JSON parsing fails
      }
    }
    
    throw new Error(errorMessage);
  }

  if (response.status === 204) return {} as T;

  const text = await response.text();
  
  if (!text) {
    if (!response.ok) {
      throw new Error('Ocorreu um erro');
    }
    return {} as T;
  }

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error('Ocorreu um erro');
  }

  if (!response.ok) {
    throw new Error(data.message || data.error || 'Ocorreu um erro');
  }

  return data;
};

// ------------------------------------------------------------------------------------

// --- HTTP Client --------------------------------------------------------------------

export const httpClient = {
  get: <T>(endpoint: string, options?: RequestInit) => 
    request<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body?: JsonBody, options?: RequestInit) => 
    request<T>(endpoint, { 
      ...options, 
      method: 'POST', 
      body: body ? JSON.stringify(body) : undefined 
    }),

  put: <T>(endpoint: string, body?: JsonBody, options?: RequestInit) => 
    request<T>(endpoint, { 
      ...options, 
      method: 'PUT', 
      body: body ? JSON.stringify(body) : undefined 
    }),

  del: <T>(endpoint: string, options?: RequestInit) => 
    request<T>(endpoint, { ...options, method: 'DELETE' }),

  patch: <T>(endpoint: string, body?: JsonBody, options?: RequestInit) => 
    request<T>(endpoint, { 
      ...options, 
      method: 'PATCH', 
      body: body ? JSON.stringify(body) : undefined 
    }),
};
