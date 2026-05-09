import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${API_URL}/auth/refresh-token`, {
          refreshToken
        });

        const { accessToken } = response.data.data;
        localStorage.setItem('accessToken', accessToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data)
};

// Customer API
export const customerAPI = {
  getAll: (params) => api.get('/customers', { params }),
  getById: (id) => api.get(`/customers/${id}`),
  getByAccountNumber: (accountNumber) => api.get(`/customers/account/${accountNumber}`),
  create: (data) => api.post('/customers', data),
  update: (id, data) => api.put(`/customers/${id}`, data),
  delete: (id) => api.delete(`/customers/${id}`),
  getBills: (accountNumber, params) => api.get(`/customers/${accountNumber}/bills`, { params }),
  getPayments: (accountNumber, params) => api.get(`/customers/${accountNumber}/payments`, { params }),
  getUsageHistory: (accountNumber, params) => api.get(`/customers/${accountNumber}/usage-history`, { params })
};

// Billing API
export const billingAPI = {
  getAll: (params) => api.get('/billing', { params }),
  getById: (id) => api.get(`/billing/${id}`),
  generateBill: (data) => api.post('/billing/generate', data),
  generateBulkBills: (data) => api.post('/billing/generate-bulk', data),
  update: (id, data) => api.put(`/billing/${id}`, data),
  delete: (id) => api.delete(`/billing/${id}`),
  getOutstanding: (accountNumber) => api.get(`/billing/outstanding/${accountNumber}`),
  getSummary: (params) => api.get('/billing/summary/stats', { params }),
  getRates: () => api.get('/billing/rates/all'),
  createRate: (data) => api.post('/billing/rates', data),
  updateRate: (id, data) => api.put(`/billing/rates/${id}`, data),
  deleteRate: (id) => api.delete(`/billing/rates/${id}`)
};

// Payment API
export const paymentAPI = {
  getAll: (params) => api.get('/payments', { params }),
  getById: (id) => api.get(`/payments/${id}`),
  createIntent: (data) => api.post('/payments/create-intent', data),
  confirm: (data) => api.post('/payments/confirm', data),
  recordManual: (data) => api.post('/payments/manual', data),
  refund: (id, data) => api.post(`/payments/${id}/refund`, data),
  getHistory: (accountNumber, params) => api.get(`/payments/history/${accountNumber}`, { params }),
  getSummary: (params) => api.get('/payments/summary/stats', { params })
};

// Usage API
export const usageAPI = {
  getAll: (params) => api.get('/usage', { params }),
  getById: (id) => api.get(`/usage/${id}`),
  getByAccountNumber: (accountNumber, params) => api.get(`/usage/account/${accountNumber}`, { params }),
  create: (data) => api.post('/usage', data),
  update: (id, data) => api.put(`/usage/${id}`, data),
  delete: (id) => api.delete(`/usage/${id}`)
};

// Admin API
export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
  
  // Users
  getUsers: (params) => api.get('/admin/users', { params }),
  createUser: (data) => api.post('/admin/users', data),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  
  // Customers
  getCustomers: (params) => api.get('/admin/customers', { params }),
  createCustomer: (data) => api.post('/admin/customers', data),
  updateCustomer: (id, data) => api.put(`/admin/customers/${id}`, data),
  deleteCustomer: (id) => api.delete(`/admin/customers/${id}`),
  
  // Billing Rates
  getBillingRates: () => api.get('/admin/billing-rates'),
  createBillingRate: (data) => api.post('/admin/billing-rates', data),
  updateBillingRate: (id, data) => api.put(`/admin/billing-rates/${id}`, data),
  deleteBillingRate: (id) => api.delete(`/admin/billing-rates/${id}`),
  
  // Reports
  getRevenueReport: (params) => api.get('/admin/reports/revenue', { params }),
  getConsumptionReport: (params) => api.get('/admin/reports/consumption', { params }),
  getDistrictReport: () => api.get('/admin/reports/districts')
};

// Manager API
export const managerAPI = {
  getDailyAnalytics: (params) => api.get('/manager/analytics/daily', { params }),
  getWeeklyAnalytics: (params) => api.get('/manager/analytics/weekly', { params }),
  getMonthlyAnalytics: (params) => api.get('/manager/analytics/monthly', { params }),
  getQuarterlyAnalytics: (params) => api.get('/manager/analytics/quarterly', { params }),
  getYearlyAnalytics: (params) => api.get('/manager/analytics/yearly', { params }),
  getUsageAnalytics: (params) => api.get('/manager/analytics/usage', { params }),
  getTopConsumers: (params) => api.get('/manager/analytics/top-consumers', { params }),
  getCustomerSegmentation: (params) => api.get('/manager/analytics/customer-segmentation', { params }),
  getPaymentTrends: (params) => api.get('/manager/analytics/payment-trends', { params }),
  getOutstandingAnalysis: (params) => api.get('/manager/analytics/outstanding', { params }),
  getRevenueForecast: (params) => api.get('/manager/analytics/revenue-forecast', { params }),
  getDistrictComparison: (params) => api.get('/manager/analytics/district-comparison', { params })
};

export default api;

// Made with Bob
