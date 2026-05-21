# TODO - Study Page & Admin Integration (Đã đồng bộ giống Lao động)

## Mục tiêu:
- Đồng bộ cấu trúc trang Du học theo mô hình Việc làm: Tuyển sinh du học (trên) + Tin tức du học (dưới).
- Cho phép Admin đăng bài tuyển sinh du học kèm các trường metadata (Quốc gia, Học phí, Kỳ tuyển sinh).
- Người dùng có thể tìm kiếm, xem chi tiết và đăng ký nộp đơn du học trực tiếp từ bài đăng.

## Backend
- [x] 1. API study-applications đã có sẵn
- [x] 2. Public endpoint cho đơn du học đã có
- [x] 3. Entity News đã hỗ trợ type='study' cùng các trường country, priceFrom, priceTo

## Frontend - Admin
- [x] 4. Tạo trang `AdminStudyNewsPage.tsx` quản lý tin bài du học (đăng bài có type='study' + thêm các trường Quốc gia, Học phí, Kỳ học)
- [x] 5. Đăng ký các route `/admin/study-news` và `/admin/study-applications` trong `App.tsx`
- [x] 6. Thêm link "Bài đăng Du học" và "Đơn Du học" vào `AdminSidebar.tsx`

## Frontend - User Site
- [x] 7. Cập nhật `StudyPage.tsx`:
    - Phần trên: Danh sách tuyển sinh du học (bài viết type='study' có country/price), hiển thị dạng card giống `/jobs` kèm tìm kiếm & bộ lọc quốc gia.
    - Phần dưới: Tin tức du học tổng hợp (các bài viết study thông thường).
- [x] 8. Tạo trang chi tiết du học `StudyDetailPage.tsx` (route `/study/:slug`) có cấu trúc giống trang chi tiết việc làm, hiển thị nội dung bài viết và hộp thông tin bên lề (Học phí, Kỳ tuyển sinh).
- [x] 9. Tích hợp Form đăng ký nộp đơn du học (modal đăng ký gửi lên `studyApplicationsApi.create`) vào trang chi tiết du học.

## Progress Checklist
- [x] Step 1: Xây dựng Admin biên tập bài viết Du học (`AdminStudyNewsPage`) & sidebar link
- [x] Step 2: Xây dựng trang danh sách tuyển sinh Du học và Tin tức ở Client (`StudyPage`)
- [x] Step 3: Xây dựng trang chi tiết tuyển sinh du học (`StudyDetailPage`) & tích hợp form nộp đơn
- [x] Step 4: Test đồng bộ luồng đăng bài du học (Admin) -> Xem & Tìm kiếm (Client) -> Nộp đơn đăng ký -> Quản lý đơn (Admin)

