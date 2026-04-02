# Fly Labour — Project Guide

## Purpose

Nền tảng tuyển dụng lao động quốc tế (Úc, Canada, New Zealand). Kết nối người tìm việc, nhà tuyển dụng, và admin quản lý hệ thống.

## Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Frontend   | React 18 + TypeScript + Vite            |
| Styling    | Tailwind CSS 3                          |
| State      | Zustand 4 (persist to localStorage)     |
| Data fetch | TanStack React Query 5 + Axios          |
| Routing    | React Router DOM 6                      |
| Backend    | NestJS 10 + TypeScript                  |
| Database   | PostgreSQL 16 + TypeORM 0.3             |
| Auth       | Passport.js + JWT                       |
| Storage    | Google Cloud Storage (file uploads)     |
| Container  | Docker Compose (postgres + api + web)   |

## Key Directories

```
fly-labour-backend/src/
  modules/          # Feature modules: auth, users, jobs, applications, categories, news, contact, settings, upload
  common/guards/    # JwtAuthGuard, AdminGuard, EmployerGuard
  common/services/  # GCS upload service
  database/         # Migration scripts and seeds
  config/           # Database and app configuration

fly-labour-frontend/src/
  pages/            # Route-level pages (user/, employer/, admin/ sub-folders by role)
  components/       # Reusable UI (admin/, home/, jobs/, layout/, ui/)
  services/api.ts   # Single Axios instance + all API endpoint functions
  store/            # Zustand stores: authStore, langStore
  types/index.ts    # Shared TypeScript interfaces
  i18n/             # Vietnamese/English translations
  hooks/useT.ts     # Translation hook
```

## User Roles

- `admin` — full access
- `employer` — manage own job posts and view applications
- `user` — apply for jobs, manage own profile

## Build & Run Commands

### Backend
```bash
cd fly-labour-backend
npm run start:dev          # Development (watch mode)
npm run build              # Production build
npm run start:prod         # Run production build
npm run migration:run      # Apply DB migrations
npm run migration:revert   # Rollback last migration
```

### Frontend
```bash
cd fly-labour-frontend
npm run dev                # Development server (Vite)
npm run build              # TypeScript check + Vite build
npm run preview            # Preview production build
```

### Docker (full stack)
```bash
docker-compose up -d       # Start all services
docker-compose down        # Stop all services
```

## Environment Variables

- Backend: `fly-labour-backend/.env` — DB credentials, JWT_SECRET, PORT, GCS config
- Frontend: `VITE_API_URL` — backend base URL (defaults to `http://localhost:3000`)

## API Pattern

All endpoints under `/auth`, `/jobs`, `/applications`, `/users`, `/categories`, `/news`, `/contact`, `/settings`, `/upload`.
Auth: `Authorization: Bearer <JWT>` header injected automatically by Axios interceptor.
See `fly-labour-frontend/src/services/api.ts:1` for all endpoint definitions.

## Admin — Lưu ý quan trọng

### AdminJobsPage (`fly-labour-frontend/src/pages/admin/AdminJobsPage.tsx`)
- **Danh mục** trong modal chỉnh sửa: KHÔNG hardcode option nào — chỉ dùng `cats.map()` từ API (`categoriesApi.getAllAdmin()`). Nếu thêm hardcode sẽ gây trùng value và select không đổi được.
- **Salary calculator (modal):** `salaryPeriod` state (hourly/weekly/monthly/yearly) + hàm `getSalaryEstimates()` tính ước lượng 4 chu kỳ dựa trên 40h/tuần, 52 tuần/năm. Giá trị lưu DB là tháng.
- **Hiển thị lương bảng:** `tableSalaryPeriod` state — toggle Giờ/Tuần/Tháng/Năm ở thanh search, header cột và cell tự cập nhật theo.

### AdminCategoriesPage (`fly-labour-frontend/src/pages/admin/AdminCategoriesPage.tsx`)
- Đã kết nối thật vào API — KHÔNG còn dùng `MOCK_CATEGORIES`.
- Tạo/sửa/xóa/toggle isActive đều gọi `categoriesApi` và reload từ backend.
- Thêm danh mục mới (như "Dịch vụ") trực tiếp qua trang này, không cần chạy seed hay hardcode.

### Categories — Seed
- Seed (`fly-labour-backend/src/database/seeds/run-seeds.ts`) chỉ chạy khi DB trống (`catCount === 0`).
- Trên Railway (DB đang có data) thì seed không có tác dụng — dùng trang Admin để thêm danh mục.

## Mobile App (`fly-labour-mobile/`)

React Native + Expo SDK 51. Cùng folder với backend/frontend.

### Tech
| Layer | Technology |
|---|---|
| Framework | React Native 0.74 + Expo SDK 51 |
| Navigation | Expo Router v3 (file-based) |
| Styling | NativeWind v4 (Tailwind syntax) |
| State / Auth | Zustand — token lưu `expo-secure-store` (thay localStorage) |
| Data fetch | TanStack React Query 5 + Axios |
| Build | Expo EAS Build |

### Cấu trúc chính
```
fly-labour-mobile/
  app/
    _layout.tsx          # Root: QueryClient, AuthGuard, Toast
    (auth)/              # login, register
    (tabs)/              # index (home), jobs, applications, profile
    jobs/[id].tsx        # Chi tiết + form nộp đơn
    employer/index.tsx   # Quản lý tin đăng (employer only)
    profile/edit.tsx     # Chỉnh sửa hồ sơ + đổi mật khẩu
  src/
    services/api.ts      # Axios — đọc token từ SecureStore
    store/authStore.ts   # hydrate() gọi khi app khởi động
    types/index.ts       # Copy từ web
    utils/helpers.ts     # formatSalary, timeAgo, getImageUrl...
    constants/colors.ts  # Bảng màu dark theme
    components/ui/       # Button, Input, Badge, LoadingScreen
    components/jobs/     # JobCard
    components/home/     # HeroBanner, CategoryGrid
```

### Lưu ý quan trọng
- **Env:** tạo file `.env` từ `.env.example`, đặt `EXPO_PUBLIC_API_URL` trỏ tới Railway backend
- **Auth guard:** nằm trong `app/_layout.tsx` — tự redirect login/tabs dựa trên `isAuthenticated`
- **Token:** lưu key `fly-labour-token` trong SecureStore, `hydrate()` restore khi mở app
- **Employer guard:** kiểm tra `user.role === 'employer'` ở component level, chưa có route guard riêng

### Chạy dev
```bash
cd fly-labour-mobile
npm install
npx expo start
```

## Additional Documentation

- [Architectural Patterns](.claude/docs/architectural_patterns.md) — module structure, guards, state management, API conventions
- [Real-time Sync Options](.claude/docs/realtime_sync_options.md) — 3 options for syncing chore changes across browser tabs/clients (Vietnamese)
