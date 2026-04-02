import axios from 'axios'
import * as SecureStore from 'expo-secure-store'

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000'

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
})

// Gắn JWT token vào mọi request
api.interceptors.request.use(async (config) => {
  try {
    const token = await SecureStore.getItemAsync('fly-labour-token')
    if (token) config.headers.Authorization = `Bearer ${token}`
  } catch {}
  return config
})

// 401 → xóa token (logout sẽ do authStore xử lý)
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401) {
      await SecureStore.deleteItemAsync('fly-labour-token')
    }
    return Promise.reject(err)
  }
)

// ── Auth ──────────────────────────────────────────────────
export const authApi = {
  login:    (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (data: Record<string, any>) =>
    api.post('/auth/register', data),
  getMe:    () => api.get('/auth/me'),
}

// ── Jobs ──────────────────────────────────────────────────
export const jobsApi = {
  getAll:  (params?: Record<string, any>) => api.get('/jobs', { params }),
  getHot:  () => api.get('/jobs/hot'),
  getOne:  (id: string) => api.get(`/jobs/${id}`),
}

// ── Applications ──────────────────────────────────────────
export const applicationsApi = {
  create:   (data: Record<string, any>) => api.post('/applications', data),
  getMy:    () => api.get('/applications/my'),
  getOne:   (id: string) => api.get(`/applications/${id}`),
  withdraw: (id: string) => api.patch(`/applications/${id}/withdraw`),
}

// ── Categories ────────────────────────────────────────────
export const categoriesApi = {
  getAll: () => api.get('/categories'),
}

// ── Users ─────────────────────────────────────────────────
export const usersApi = {
  getMe:          () => api.get('/auth/me'),
  updateMe:       (data: Record<string, any>) => api.patch('/users/me', data),
  changePassword: (data: { currentPassword: string; newPassword: string; confirmPassword: string }) =>
    api.patch('/users/me/change-password', data),
}

// ── Employer ──────────────────────────────────────────────
export const employerApi = {
  getMyJobs:       (params?: Record<string, any>) => api.get('/jobs/employer/my', { params }),
  createJob:       (data: FormData) => api.post('/jobs/employer', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateJob:       (id: string, data: FormData) => api.patch(`/jobs/employer/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteJob:       (id: string) => api.delete(`/jobs/employer/${id}`),
  getApplications: () => api.get('/applications/employer'),
}

// ── News ──────────────────────────────────────────────────
export const newsApi = {
  getAll: (params?: Record<string, any>) => api.get('/news', { params }),
  getOne: (slug: string) => api.get(`/news/${slug}`),
}
