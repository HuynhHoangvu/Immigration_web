# Fly Labour Mobile

Ứng dụng tuyển dụng lao động quốc tế (Úc, Canada, New Zealand...) — React Native + Expo SDK 54.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native 0.81 + Expo SDK 54 |
| Navigation | Expo Router v6 (file-based) |
| Styling | NativeWind v4 (Tailwind syntax) |
| State / Auth | Zustand — token lưu `expo-secure-store` |
| Data fetch | TanStack React Query 5 + Axios |
| Build | Expo EAS Build |

## Cài đặt & Chạy

```bash
cd fly-labour-mobile
npm install --legacy-peer-deps
npx expo start
```

Quét QR bằng **Expo Go** trên điện thoại.

## Environment

Tạo file `.env` từ `.env.example`:

```bash
cp .env.example .env
```

Sửa URL backend:
```
EXPO_PUBLIC_API_URL=https://fly-labour-production-d3a6.up.railway.app
```

## Cấu trúc thư mục

```
app/
  _layout.tsx          # Root: QueryClient, AuthGuard, Toast
  (auth)/              # login, register
  (tabs)/              # index (home), jobs, applications, profile
  jobs/[id].tsx        # Chi tiết job + form nộp đơn + upload CV
  employer/index.tsx   # Quản lý tin đăng (employer only)
  profile/edit.tsx     # Chỉnh sửa hồ sơ + đổi mật khẩu
src/
  services/api.ts      # Axios — đọc token từ SecureStore
  store/authStore.ts   # hydrate() gọi khi app khởi động
  types/index.ts
  utils/helpers.ts     # formatSalary, timeAgo, getImageUrl...
  constants/colors.ts  # Dark theme
  components/ui/       # Button, Input, Badge, LoadingScreen
  components/jobs/     # JobCard
  components/home/     # HeroBanner, CategoryGrid
```

## Chức năng hiện có

### Guest (không cần đăng nhập)
- Xem trang chủ: job hot, job nổi bật, danh mục ngành nghề
- Tìm kiếm & lọc việc làm (theo từ khóa, danh mục, quốc gia)
- Xem chi tiết job
- Tab Profile & Applications hiển thị prompt mời đăng nhập/đăng ký

### User (người tìm việc)
- Nộp đơn ứng tuyển với form CV + đính kèm file PDF/Word
- Xem danh sách đơn đã nộp và trạng thái
- Chỉnh sửa hồ sơ cá nhân, đổi mật khẩu

### Employer (nhà tuyển dụng)
- Xem danh sách tin đăng + thống kê
- Xem danh sách ứng viên đã nộp đơn

## Chức năng TODO (chưa làm)

| # | Chức năng | Ghi chú |
|---|---|---|
| 1 | Tạo tin đăng mới | Employer — API `POST /jobs/employer` |
| 2 | Chỉnh sửa tin đăng | Employer — API `PATCH /jobs/employer/:id` |
| 3 | Tạm dừng / Mở lại tin | Toggle status active/paused |
| 4 | Duyệt ứng viên (approve/reject) | Employer |
| 5 | Rút đơn ứng tuyển | User — API `PATCH /applications/:id/withdraw` |
| 6 | Trang tin tức / Blog | API `newsApi` đã sẵn |
| 7 | Upload avatar | Profile edit |

## Lịch sử fix lỗi

### Upgrade Expo SDK 51 → 54

1. `npx expo install expo@~54.0.0` — cập nhật expo + packages tương thích
2. `npm install --legacy-peer-deps` — resolve peer dependency conflict
3. `npm install react-native-worklets` — peer dep mới của reanimated v4

### Fix NativeWind 4.2.3 → 4.0.36

**Vấn đề:** `nativewind@4.2.3` bundle react-native 0.76+ bên trong gây parse error với Expo 51 (RN 0.74).

**Fix:**
- Downgrade `nativewind@4.0.36` + `react-native-css-interop@0.0.36`
- Xóa `'nativewind/babel'` khỏi `babel.config.js` (v4 chỉ cần `jsxImportSource: 'nativewind'`)

### Fix babel.config.js

`nativewind/babel` → `react-native-css-interop/babel.js` cố load `react-native-worklets/plugin` (không tồn tại).

**Fix:** Xóa `'nativewind/babel'` khỏi presets — chỉ giữ:
```js
presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }]]
```

## Build APK (Production)

```bash
# Cần tài khoản Expo EAS
eas build --platform android
eas build --platform ios
```
