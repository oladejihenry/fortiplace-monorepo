import axios from "./axios"
import { AxiosError } from "axios"
import { getDeviceInfo } from './utils';

interface FetchOptions {
    sort?: string
}


export async function getSiteByDomain(domain: string) {
    try {


         if (!domain) {
            throw new Error('Invalid domain');
        }

        const cleanDomain = domain.split(':')[0];


        const response = await axios.get(`/api/store/show/${encodeURIComponent(cleanDomain)}`, {
            headers: {
                'Accept': 'application/json',
            }
        })

        if (!response.data) {
            throw new Error('Failed to fetch site')
        }

        

        return response.data
    } catch (error) {
        if(error instanceof AxiosError) {
            if(error.response?.status === 404) {
                return {
                    error: true,
                    message: 'Site not found'
                }
            }
        }

        throw error
    }
}

export async function getProductsByDomain(domain: string, options: FetchOptions = {}) {
    const { sort = 'relevance' } = options;
    try {
        if (!domain) {
            throw new Error('Invalid domain');
        }

        const cleanDomain = domain.split(':')[0];

        const response = await axios.get(`/api/store/show/${encodeURIComponent(cleanDomain)}/products`, {
            headers: {
                'Accept': 'application/json',
            },
            params: {
                sort
            }
        });

        if (!response.data) {
            throw new Error('Failed to fetch products');
        }

        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.response?.status === 404) {
                return {
                    error: true,
                    message: 'Products not found'
                };
            }
        }
        throw error;
    }
}

export async function getProductBySlug(domain: string, slug: string, customHeaders?: Record<string, string>) {
    try {
        if (!domain) {
            throw new Error('Invalid domain');
        }

        const cleanDomain = domain.split(':')[0];
        const userAgent = customHeaders?.['user-agent'] || 
                         customHeaders?.['User-Agent'];

        const response = await axios.get(`/api/store/show/${encodeURIComponent(cleanDomain)}/products/${slug}`, {
            withCredentials: true,
            headers: {
                'Accept': 'application/json',
                'User-Agent': userAgent
            },
        });

        if (!response.data) {
            throw new Error('Failed to fetch product');
        }

        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.response?.status === 404) {
                return {
                    error: true,
                    message: 'Product not found'
                };
            }
            if (error.response?.status === 403) {
                return {
                    error: true,
                    message: 'You are not authorized to access this product',
                    status: error.response?.status
                };
            }
        }
        throw error;
    }
}

export async function getSiteUserByDomain(domain: string) {
    try {
        if (!domain) {
            throw new Error('Invalid domain');
        }

        const cleanDomain = domain.split(':')[0];

        const response = await axios.get(`/api/store/show/${encodeURIComponent(cleanDomain)}/user`, {
            headers: {
                'Accept': 'application/json',
            }
        });

        if (!response.data) {
            throw new Error('Failed to fetch site user');
        }

        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw error;
        }
    }
}

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const deviceInfo = getDeviceInfo();
  
  const headers = {
    ...options.headers,
    'X-Device-Info': JSON.stringify(deviceInfo),
    'X-Real-IP': await getClientIP(),
  };

  return fetch(url, {
    ...options,
    headers,
  });
}

// Function to get client IP (this will be the real IP in most cases)
async function getClientIP() {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Error fetching IP:', error);
    return 'unknown';
  }
}