const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('auth_token');
    console.log('API Base URL:', this.baseURL);
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    console.log(`API Response: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ 
        message: `HTTP error! status: ${response.status}` 
      }));
      console.error('API Error:', error);
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  // Auth endpoints
  async register(userData: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone?: string;
  }) {
    console.log('Calling register API:', `${this.baseURL}/auth/register`);
    const response = await fetch(`${this.baseURL}/auth/register`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(userData),
    });

    return this.handleResponse(response);
  }

  async login(credentials: { email: string; password: string }) {
    console.log('Calling login API:', `${this.baseURL}/auth/login`);
    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(credentials),
    });

    return this.handleResponse(response);
  }

  async getCurrentUser() {
    console.log('Calling getCurrentUser API:', `${this.baseURL}/auth/me`);
    const response = await fetch(`${this.baseURL}/auth/me`, {
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  // Products endpoints
  async getProducts(params?: {
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.append('category', params.category);
    if (params?.search) searchParams.append('search', params.search);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());

    const url = `${this.baseURL}/products?${searchParams}`;
    console.log('Calling getProducts API:', url);
    const response = await fetch(url, {
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async getProduct(id: number) {
    console.log('Calling getProduct API:', `${this.baseURL}/products/${id}`);
    const response = await fetch(`${this.baseURL}/products/${id}`, {
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  // Cart endpoints
  async getCart() {
    console.log('Calling getCart API:', `${this.baseURL}/cart`);
    const response = await fetch(`${this.baseURL}/cart`, {
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async addToCart(productId: number, quantity: number = 1) {
    console.log('Calling addToCart API:', `${this.baseURL}/cart`);
    const response = await fetch(`${this.baseURL}/cart`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ product_id: productId, quantity }),
    });

    return this.handleResponse(response);
  }

  async updateCartItem(id: number, quantity: number) {
    console.log('Calling updateCartItem API:', `${this.baseURL}/cart/${id}`);
    const response = await fetch(`${this.baseURL}/cart/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ quantity }),
    });

    return this.handleResponse(response);
  }

  async removeFromCart(id: number) {
    console.log('Calling removeFromCart API:', `${this.baseURL}/cart/${id}`);
    const response = await fetch(`${this.baseURL}/cart/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async clearCart() {
    console.log('Calling clearCart API:', `${this.baseURL}/cart`);
    const response = await fetch(`${this.baseURL}/cart`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  // Wishlist endpoints
  async getWishlist() {
    console.log('Calling getWishlist API:', `${this.baseURL}/wishlist`);
    const response = await fetch(`${this.baseURL}/wishlist`, {
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async addToWishlist(productId: number) {
    console.log('Calling addToWishlist API:', `${this.baseURL}/wishlist`);
    const response = await fetch(`${this.baseURL}/wishlist`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ product_id: productId }),
    });

    return this.handleResponse(response);
  }

  async removeFromWishlistByProduct(productId: number) {
    console.log('Calling removeFromWishlistByProduct API:', `${this.baseURL}/wishlist/product/${productId}`);
    const response = await fetch(`${this.baseURL}/wishlist/product/${productId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  // Orders endpoints
  async getOrders() {
    console.log('Calling getOrders API:', `${this.baseURL}/orders`);
    const response = await fetch(`${this.baseURL}/orders`, {
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async createOrder(orderData: {
    items: Array<{ product_id: number; quantity: number }>;
    shipping_address: string;
  }) {
    console.log('Calling createOrder API:', `${this.baseURL}/orders`);
    const response = await fetch(`${this.baseURL}/orders`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(orderData),
    });

    return this.handleResponse(response);
  }
}

export const apiService = new ApiService();