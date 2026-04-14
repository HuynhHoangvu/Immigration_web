import type { Job, Category, Application, News, DashboardStats } from '@/core/types'

export const MOCK_CATEGORIES: Category[] = [
  { id: '1', name: 'Nông nghiệp', nameEn: 'Farm', icon: '🌾', description: 'Hái quả, trồng trọt, chăn nuôi', isActive: true, sortOrder: 1, _count: { jobs: 24 } },
  { id: '2', name: 'Nail & Spa', nameEn: 'Nail', icon: '💅', description: 'Kỹ thuật viên nail, thẩm mỹ', isActive: true, sortOrder: 2, _count: { jobs: 18 } },
  { id: '3', name: 'Kỹ thuật', nameEn: 'Engineering', icon: '⚙️', description: 'Kỹ sư, vận hành máy móc', isActive: true, sortOrder: 3, _count: { jobs: 15 } },
  { id: '4', name: 'Xây dựng', nameEn: 'Construction', icon: '🏗️', description: 'Thợ hồ, xây dựng công trình', isActive: true, sortOrder: 4, _count: { jobs: 12 } },
  { id: '5', name: 'Nhà hàng', nameEn: 'Hospitality', icon: '🍽️', description: 'Đầu bếp, phục vụ nhà hàng', isActive: true, sortOrder: 5, _count: { jobs: 20 } },
  { id: '6', name: 'Chăm sóc sức khỏe', nameEn: 'Healthcare', icon: '🏥', description: 'Y tá, chăm sóc người cao tuổi', isActive: true, sortOrder: 6, _count: { jobs: 9 } },
  { id: '7', name: 'Logistics', nameEn: 'Logistics', icon: '🚛', description: 'Lái xe, kho vận, giao hàng', isActive: true, sortOrder: 7, _count: { jobs: 11 } },
  { id: '8', name: 'Công nghệ', nameEn: 'IT', icon: '💻', description: 'Lập trình viên, IT support', isActive: true, sortOrder: 8, _count: { jobs: 7 } },
]

export const MOCK_JOBS: Job[] = [
  {
    id: '1', title: 'Công nhân Hái Quả Mùa Vụ', company: 'Sunshine Farms', location: 'Queensland',
    country: 'australia', jobType: 'seasonal', status: 'active', salaryMin: 2800, salaryMax: 3500,
    salaryCurrency: 'AUD', slots: 50, isHot: true, isFeatured: true, viewCount: 320, image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=70&fit=crop',
    description: 'Tuyển 50 lao động hái quả mùa vụ tại Queensland, Úc. Bao ăn ở, hỗ trợ visa.',
    requirements: 'Sức khỏe tốt, chịu khó, không yêu cầu kinh nghiệm.',
    benefits: 'Bao visa, bao vé máy bay, bao ăn ở tại farm.',
    deadline: '2025-06-30', category: MOCK_CATEGORIES[0], categoryId: '1',
    createdAt: '2025-01-15T00:00:00Z', updatedAt: '2025-01-15T00:00:00Z',
  },
  {
    id: '2', title: 'Kỹ thuật viên Nail cao cấp', company: 'Melbourne Nail Studio', location: 'Melbourne',
    country: 'australia', jobType: 'full_time', status: 'active', salaryMin: 3200, salaryMax: 4500,
    salaryCurrency: 'AUD', slots: 10, isHot: true, isFeatured: true, viewCount: 280, image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=70&fit=crop',
    description: 'Cần tuyển kỹ thuật viên nail có kinh nghiệm làm việc tại studio sang trọng Melbourne.',
    requirements: 'Có kinh nghiệm nail tối thiểu 1 năm, biết tiếng Anh cơ bản.',
    benefits: 'Lương + tip, hỗ trợ tìm nhà ở, visa sponsored.',
    deadline: '2025-05-30', category: MOCK_CATEGORIES[1], categoryId: '2',
    createdAt: '2025-01-20T00:00:00Z', updatedAt: '2025-01-20T00:00:00Z',
  },
  {
    id: '3', title: 'Thợ Hàn Công Nghiệp', company: 'BC Steel Works', location: 'British Columbia',
    country: 'canada', jobType: 'full_time', status: 'active', salaryMin: 3500, salaryMax: 5000,
    salaryCurrency: 'CAD', slots: 20, isHot: true, isFeatured: false, viewCount: 195, image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=70&fit=crop',
    description: 'Tuyển thợ hàn có tay nghề làm việc tại nhà máy thép British Columbia, Canada.',
    requirements: 'Bằng nghề hàn, kinh nghiệm 2 năm trở lên.',
    benefits: 'Lương cao, bao visa, bảo hiểm y tế đầy đủ.',
    deadline: '2025-07-15', category: MOCK_CATEGORIES[2], categoryId: '3',
    createdAt: '2025-01-22T00:00:00Z', updatedAt: '2025-01-22T00:00:00Z',
  },
  {
    id: '4', title: 'Đầu bếp Việt Nam', company: 'Pho Saigon Restaurant', location: 'Auckland',
    country: 'new_zealand', jobType: 'full_time', status: 'active', salaryMin: 2900, salaryMax: 3800,
    salaryCurrency: 'NZD', slots: 5, isHot: false, isFeatured: false, viewCount: 143, image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=70&fit=crop',
    description: 'Nhà hàng Việt Nam tại Auckland cần tuyển đầu bếp có kinh nghiệm nấu ẩm thực Việt.',
    requirements: 'Kinh nghiệm nấu ăn 2 năm, ưu tiên có bằng nghề bếp.',
    benefits: 'Bao ăn ở, hỗ trợ visa, môi trường thân thiện.',
    deadline: '2025-06-01', category: MOCK_CATEGORIES[4], categoryId: '5',
    createdAt: '2025-01-25T00:00:00Z', updatedAt: '2025-01-25T00:00:00Z',
  },
  {
    id: '5', title: 'Công nhân Lắp Ráp Điện Tử', company: 'TechAssemble Pty', location: 'Sydney',
    country: 'australia', jobType: 'full_time', status: 'active', salaryMin: 3000, salaryMax: 3800,
    salaryCurrency: 'AUD', slots: 30, isHot: false, isFeatured: false, viewCount: 210, image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&q=70&fit=crop',
    description: 'Tuyển công nhân lắp ráp linh kiện điện tử tại nhà máy Sydney.',
    requirements: 'Tốt nghiệp THPT, cẩn thận tỉ mỉ.',
    benefits: 'Tăng ca extra, bảo hiểm, hỗ trợ visa 482.',
    deadline: '2025-08-01', category: MOCK_CATEGORIES[2], categoryId: '3',
    createdAt: '2025-01-28T00:00:00Z', updatedAt: '2025-01-28T00:00:00Z',
  },
  {
    id: '6', title: 'Lái Xe Container Hạng Nặng', company: 'TransOz Logistics', location: 'Perth',
    country: 'australia', jobType: 'full_time', status: 'active', salaryMin: 4000, salaryMax: 5500,
    salaryCurrency: 'AUD', slots: 15, isHot: true, isFeatured: false, viewCount: 267, image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&q=70&fit=crop',
    description: 'Tuyển lái xe container hạng nặng có bằng HR tại Perth.',
    requirements: 'Bằng lái HR, kinh nghiệm 2 năm, tiếng Anh giao tiếp.',
    benefits: 'Lương rất cao, phụ cấp đường dài, visa sponsored.',
    deadline: '2025-06-15', category: MOCK_CATEGORIES[6], categoryId: '7',
    createdAt: '2025-02-01T00:00:00Z', updatedAt: '2025-02-01T00:00:00Z',
  },
  {
    id: '7', title: 'Y Tá Chăm Sóc Người Cao Tuổi', company: 'Sunrise Aged Care', location: 'Christchurch',
    country: 'new_zealand', jobType: 'full_time', status: 'active', salaryMin: 3500, salaryMax: 4500,
    salaryCurrency: 'NZD', slots: 8, isHot: false, isFeatured: true, viewCount: 132, image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=70&fit=crop',
    description: 'Trung tâm chăm sóc người cao tuổi tại NZ cần tuyển y tá có chứng chỉ.',
    requirements: 'Bằng điều dưỡng hoặc y tá, tiếng Anh IELTS 6.0.',
    benefits: 'Hỗ trợ đăng ký chứng chỉ NZ, visa PR sau 2 năm.',
    deadline: '2025-07-31', category: MOCK_CATEGORIES[5], categoryId: '6',
    createdAt: '2025-02-05T00:00:00Z', updatedAt: '2025-02-05T00:00:00Z',
  },
  {
    id: '8', title: 'Thợ Xây Dựng Cơ Bản', company: 'Ontario Build Co.', location: 'Ontario',
    country: 'canada', jobType: 'contract', status: 'active', salaryMin: 3200, salaryMax: 4200,
    salaryCurrency: 'CAD', slots: 25, isHot: false, isFeatured: false, viewCount: 178, image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=70&fit=crop',
    description: 'Tuyển thợ xây dựng làm việc các công trình dân dụng Ontario, Canada.',
    requirements: 'Kinh nghiệm xây dựng 1 năm, sức khỏe tốt.',
    benefits: 'Hỗ trợ visa, bao ở, phụ cấp công trường.',
    deadline: '2025-09-01', category: MOCK_CATEGORIES[3], categoryId: '4',
    createdAt: '2025-02-08T00:00:00Z', updatedAt: '2025-02-08T00:00:00Z',
  },
]

export const MOCK_NEWS: News[] = [
  { id: '1', title: 'Chính sách visa lao động Úc 2025 có gì mới?', slug: 'visa-uc-2025', excerpt: 'Chính phủ Úc vừa công bố một số thay đổi quan trọng trong chính sách visa lao động năm 2025...', content: '', isPublished: true, type: 'news', createdAt: '2025-01-10T00:00:00Z', image: '' },
  { id: '2', title: 'Top 5 ngành nghề dễ xin việc tại Canada năm 2025', slug: 'nganh-nghe-canada-2025', excerpt: 'Canada đang thiếu hụt lao động trầm trọng trong nhiều ngành. Đây là cơ hội vàng cho lao động Việt Nam...', content: '', isPublished: true, type: 'news', createdAt: '2025-01-18T00:00:00Z', image: '' },
  { id: '3', title: 'Kinh nghiệm chuẩn bị hồ sơ xin việc tại New Zealand', slug: 'ho-so-new-zealand', excerpt: 'Bộ hồ sơ hoàn chỉnh là chìa khóa để được nhà tuyển dụng New Zealand chú ý. Fly Labour chia sẻ kinh nghiệm...', content: '', isPublished: true, type: 'news', createdAt: '2025-02-01T00:00:00Z', image: '' },
]

export const MOCK_APPLICATIONS: Application[] = [
  { id: '1', fullName: 'Nguyễn Văn An', email: 'an@example.com', phone: '0901234567', status: 'pending', jobId: '1', createdAt: '2025-02-10T00:00:00Z', updatedAt: '2025-02-10T00:00:00Z', job: MOCK_JOBS[0] },
  { id: '2', fullName: 'Trần Thị Bình', email: 'binh@example.com', phone: '0912345678', status: 'reviewing', jobId: '2', createdAt: '2025-02-11T00:00:00Z', updatedAt: '2025-02-11T00:00:00Z', job: MOCK_JOBS[1] },
  { id: '3', fullName: 'Lê Văn Cường', email: 'cuong@example.com', phone: '0923456789', status: 'approved', jobId: '3', createdAt: '2025-02-12T00:00:00Z', updatedAt: '2025-02-12T00:00:00Z', job: MOCK_JOBS[2] },
  { id: '4', fullName: 'Phạm Thị Dung', email: 'dung@example.com', phone: '0934567890', status: 'rejected', jobId: '1', createdAt: '2025-02-13T00:00:00Z', updatedAt: '2025-02-13T00:00:00Z', job: MOCK_JOBS[0] },
  { id: '5', fullName: 'Hoàng Văn Em', email: 'em@example.com', phone: '0945678901', status: 'pending', jobId: '4', createdAt: '2025-02-14T00:00:00Z', updatedAt: '2025-02-14T00:00:00Z', job: MOCK_JOBS[3] },
]

export const MOCK_STATS: DashboardStats = {
  totalUsers: 1284,
  totalJobs: 48,
  totalApplications: 327,
  pendingApplications: 89,
  totalViews: 15420,
  newUsersThisMonth: 143,
  applicationsByStatus: [
    { status: 'pending', count: 89 },
    { status: 'reviewing', count: 54 },
    { status: 'approved', count: 142 },
    { status: 'rejected', count: 42 },
  ],
  jobsByCountry: [
    { country: 'australia', count: 24 },
    { country: 'canada', count: 14 },
    { country: 'new_zealand', count: 10 },
  ],
  recentApplications: MOCK_APPLICATIONS,
}
