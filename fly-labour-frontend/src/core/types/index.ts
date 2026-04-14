export type Country = string
export type JobType = 'full_time' | 'part_time' | 'contract' | 'seasonal'
export type JobStatus = 'active' | 'paused' | 'closed' | 'draft' | 'pending_review'
export type AppStatus = 'pending' | 'reviewing' | 'approved' | 'rejected' | 'withdrawn'
export type UserRole = 'admin' | 'user' | 'employer'

export interface Category {
  id: string
  name: string
  nameEn?: string
  icon?: string
  description?: string
  image?: string
  isActive: boolean
  sortOrder: number
  _count?: { jobs: number }
}

export interface Job {
  id: string
  title: string
  description: string
  requirements?: string
  benefits?: string
  company?: string
  location?: string
  country: Country
  jobType: JobType
  status: JobStatus
  salaryMin?: number
  salaryMax?: number
  salaryCurrency?: string
  slots?: number
  deadline?: string
  image?: string
  images?: string[]
  isHot: boolean
  isFeatured: boolean
  viewCount: number
  category?: Category
  categoryId?: string
  createdById?: string
  createdBy?: Pick<User, 'id' | 'fullName' | 'companyName' | 'email'>
  _count?: { applications: number }
  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  email: string
  fullName: string
  phone?: string
  avatar?: string
  address?: string
  role: UserRole
  isActive: boolean
  companyName?: string
  companyDescription?: string
  website?: string
  createdAt: string
}

export interface Application {
  id: string
  fullName: string
  email: string
  phone: string
  dateOfBirth?: string
  address?: string
  education?: string
  experience?: string
  languageLevel?: string
  cvUrl?: string
  coverLetter?: string
  adminNote?: string
  status: AppStatus
  job?: Job
  jobId: string
  user?: User
  userId?: string
  createdAt: string
  updatedAt: string
}

export interface News {
  id: string
  title: string
  slug: string
  excerpt?: string
  content: string
  image?: string
  isPublished: boolean
  type: 'news' | 'handbook'
  createdAt: string
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: { total: number; page: number; limit: number; totalPages: number }
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  setUser: (user: User) => void
}

export interface RegisterData {
  fullName: string
  email: string
  phone: string
  password: string
  address?: string
  role?: 'user' | 'employer'
  companyName?: string
  website?: string
}

export type ChoreStatus = 'pending' | 'in_progress' | 'done'

export interface Chore {
  id: string
  title: string
  description?: string
  date: string          // 'YYYY-MM-DD'
  status: ChoreStatus
  assignedToId?: string
  assignedTo?: User
  createdById?: string
  createdAt: string
  updatedAt: string
}

export interface DashboardStats {
  totalUsers: number
  totalJobs: number
  totalApplications: number
  pendingApplications: number
  totalViews: number
  newUsersThisMonth: number
  applicationsByStatus: { status: string; count: number }[]
  jobsByCountry: { country: string; count: number }[]
  recentApplications: Application[]
}
