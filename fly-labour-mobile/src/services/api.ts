import axios from 'axios'
import { Platform } from 'react-native'
import * as SecureStore from 'expo-secure-store'

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000'

const TOKEN_KEY = 'fly-labour-token'

const getToken = () =>
  Platform.OS === 'web'
    ? Promise.resolve(localStorage.getItem(TOKEN_KEY))
    : SecureStore.getItemAsync(TOKEN_KEY)

const deleteToken = () =>
  Platform.OS === 'web'
    ? Promise.resolve(localStorage.removeItem(TOKEN_KEY))
    : SecureStore.deleteItemAsync(TOKEN_KEY)

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
})

// Gắn JWT token vào mọi request
api.interceptors.request.use(async (config) => {
  try {
    const token = await getToken()
    if (token) config.headers.Authorization = `Bearer ${token}`
  } catch {}
  return config
})

// 401 → xóa token (logout sẽ do authStore xử lý)
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401) {
      await deleteToken()
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
  getAll:                (params?: Record<string, any>) => api.get('/jobs', { params }),
  getHot:                () => api.get('/jobs/hot'),
  getAvailableFilters:   () => api.get('/jobs/filters/available'),
  getOne:                (id: string) => api.get(`/jobs/${id}`),
}

// ── Upload ────────────────────────────────────────────────
export const uploadApi = {
  uploadCv: (data: FormData) => api.post('/upload/cv', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
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
  getMyJobs:              (params?: Record<string, any>) => api.get('/jobs/employer/my', { params }),
  createJob:              (data: Record<string, any>) => api.post('/jobs/employer', data),
  updateJob:              (id: string, data: Record<string, any>) => api.patch(`/jobs/employer/${id}`, data),
  deleteJob:              (id: string) => api.delete(`/jobs/employer/${id}`),
  getApplications:        () => api.get('/applications/employer'),
  updateApplicationStatus:(id: string, status: string, note?: string) =>
    api.patch(`/applications/${id}/employer-status`, { status, note }),
}

// ── News ──────────────────────────────────────────────────
export const newsApi = {
  getAll: (params?: Record<string, any>) => api.get('/news', { params }),
  getOne: (slug: string) => api.get(`/news/${slug}`),
}
