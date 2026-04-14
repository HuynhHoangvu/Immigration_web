/// <reference types="vite/client" />

import axios from 'axios'

const BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000'

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
})

// Tự động gắn token JWT vào mọi request
api.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem('fly-labour-auth')
    if (raw) {
      const auth = JSON.parse(raw)
      if (auth?.state?.token) {
        config.headers.Authorization = `Bearer ${auth.state.token}`
      }
    }
  } catch {}
  return config
})

// Nếu token hết hạn (401) → tự động logout (chỉ khi gọi protected endpoint)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // Chỉ redirect khi gọi protected endpoints (admin, employer, profile, applications)
      const protectedRoutes = ['/admin', '/employer', '/profile', '/applications/my', '/users/me']
      const isProtectedEndpoint = protectedRoutes.some(route => err.config?.url?.includes(route))
      
      if (isProtectedEndpoint) {
        localStorage.removeItem('fly-labour-auth')
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  }
)

// ── Auth ──────────────────────────────────────
export const authApi = {
  login:    (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (data: { fullName: string; email: string; phone: string; password: string; address?: string }) =>
    api.post('/auth/register', data),
  getMe:    () => api.get('/auth/me'),
}

// ── Jobs ──────────────────────────────────────
export const jobsApi = {
  getAll:          (params?: Record<string, any>) => api.get('/jobs', { params }),
  getHot:          () => api.get('/jobs/hot'),
  getOne:          (id: string) => api.get(`/jobs/${id}`),
  getAllAdmin:      (params?: Record<string, any>) => api.get('/jobs/admin/all', { params }),
  create:          (data: FormData) => api.post('/jobs', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update:          (id: string, data: FormData) => api.patch(`/jobs/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  remove:          (id: string) => api.delete(`/jobs/${id}`),
  getStats:        () => api.get('/jobs/admin/stats'),
  getPendingCount: () => api.get('/jobs/admin/pending-count'),
  approveJob:      (id: string) => api.patch(`/jobs/admin/${id}/approve`),
  rejectJob:       (id: string) => api.patch(`/jobs/admin/${id}/reject`),
}

// ── Applications ──────────────────────────────
export const applicationsApi = {
  create:               (data: Record<string, any>) => api.post('/applications', data),
  getAll:               (params?: Record<string, any>) => api.get('/applications', { params }),
  getOne:               (id: string) => api.get(`/applications/${id}`),
  updateStatus:         (id: string, status: string, adminNote?: string) =>
    api.patch(`/applications/${id}/status`, { status, adminNote }),
  getMy:                () => api.get('/applications/my'),
  getStats:             () => api.get('/applications/stats'),
  withdraw:             (id: string) => api.patch(`/applications/${id}/withdraw`),
  employerUpdateStatus: (id: string, status: string) =>
    api.patch(`/applications/${id}/employer-status`, { status }),
}

// ── Categories ────────────────────────────────
export const categoriesApi = {
  getAll: () => api.get('/categories'),
  getAllAdmin: () => api.get('/categories/admin/all'),
  create: (data: FormData | Record<string, any>) =>
    api.post('/categories', data, {
      headers:
        data instanceof FormData
          ? { 'Content-Type': 'multipart/form-data' }
          : undefined,
    }),
  update: (id: string, data: FormData | Record<string, any>) =>
    api.patch(`/categories/${id}`, data, {
      headers:
        data instanceof FormData
          ? { 'Content-Type': 'multipart/form-data' }
          : undefined,
    }),
  remove: (id: string) => api.delete(`/categories/${id}`),
};

// ── Users ─────────────────────────────────────
export const usersApi = {
  getAll:         (params?: Record<string, any>) => api.get('/users', { params }),
  getOne:         (id: string) => api.get(`/users/${id}`),
  toggleActive:   (id: string) => api.patch(`/users/${id}/toggle-active`),
  getStats:       () => api.get('/users/stats'),
  updateMe:       (data: Record<string, any>) => api.patch('/users/me', data),
  changePassword: (data: { currentPassword: string; newPassword: string; confirmPassword: string }) =>
    api.patch('/users/me/change-password', data),
  updateAdmin:    (id: string, data: Record<string, any>) => api.patch(`/users/${id}`, data),
  remove:         (id: string) => api.delete(`/users/${id}`),
}

// ── Employer ──────────────────────────────────
export const employerApi = {
  getMyJobs:       (params?: Record<string, any>) => api.get('/jobs/employer/my', { params }),
  createJob:       (data: FormData) => api.post('/jobs/employer', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateJob:       (id: string, data: FormData) => api.patch(`/jobs/employer/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteJob:       (id: string) => api.delete(`/jobs/employer/${id}`),
  getApplications: () => api.get('/applications/employer'),
}

// ── News ──────────────────────────────────────
export const newsApi = {
  // News (type=news)
  getAll:              () => api.get('/news'),
  getAllAdmin:          () => api.get('/news/admin/all'),
  // Handbook (type=handbook)
  getAllHandbook:       () => api.get('/news/handbook'),
  getAllHandbookAdmin:  () => api.get('/news/admin/handbook'),
  // Shared
  getOne:  (slug: string) => api.get(`/news/${slug}`),
  create:  (data: FormData) => api.post('/news', data),
  update:  (id: string, data: FormData) => api.patch(`/news/${id}`, data),
  remove:  (id: string) => api.delete(`/news/${id}`),
}

// ── Contact ───────────────────────────────────
export const contactApi = {
  send:     (data: { name: string; email: string; phone?: string; message: string }) =>
    api.post('/contact', data),
  getAll:   () => api.get('/contact'),
  markRead: (id: string) => api.patch(`/contact/${id}/read`),
  remove:   (id: string) => api.delete(`/contact/${id}`),
}

// ── Settings ──────────────────────────────────
export const settingsApi = {
  getAll: () => api.get('/settings'),
  save:   (data: Record<string, string>) => api.put('/settings', data),
}

// ── Upload ────────────────────────────────────
export const uploadApi = {
  cv: (file: File) => {
    const fd = new FormData()
    fd.append('file', file)
    return api.post('/upload/cv', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
  },
  image: (file: File): Promise<{ url: string; filename: string }> => {
    const fd = new FormData()
    fd.append('file', file)
    return api.post<{ url: string; filename: string }>('/upload/image', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data)
  },
}

// ── Chores ────────────────────────────────────
export const choresApi = {
  getAll:  (params?: { date?: string; month?: string; assignedToId?: string }) =>
    api.get('/chores', { params }),
  getOne:  (id: string) => api.get(`/chores/${id}`),
  create:  (data: { title: string; description?: string; date: string; assignedToId?: string; status?: string }) =>
    api.post('/chores', data),
  update:  (id: string, data: Partial<{ title: string; description: string; date: string; assignedToId: string; status: string }>) =>
    api.patch(`/chores/${id}`, data),
  remove:  (id: string) => api.delete(`/chores/${id}`),
}

// Helper: chuyển path ảnh upload (/uploads/...) thành URL đầy đủ
export const getImageUrl = (image?: string) => {
  if (!image) return ''
  if (image.startsWith('http')) return image
  return `${BASE_URL}${image}`
}
