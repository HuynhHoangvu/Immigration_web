# 📋 Hướng Dẫn Quản Lý Điều Khoản & Chính Sách (Hồ Sơ Đăng Ký Bộ Công Thương)

## 📌 Tổng Quan Tính Năng

Hệ thống đã được cập nhật để cho phép quản lý các mục **Điều khoản, Chính sách, Quy định** cho hồ sơ đăng ký với Bộ Công Thương.

### Các Tính Năng Chính:

- ✅ **Quản lý Policies** - Admin có thể tạo, sửa, xóa các mục policy
- ✅ **Hiển thị Dynamic Footer** - Policy links tự động hiển thị ở footer dựa trên cài đặt
- ✅ **Trang Chi Tiết Policy** - Mỗi policy có trang riêng để hiển thị nội dung
- ✅ **Điều khiển Hiển Thị** - Toggle "Hiển thị Footer" để kiểm soát link nào công khai
- ✅ **Sắp Xếp Thứ Tự** - Điều chỉnh thứ tự hiển thị các policy links

---

## 🔧 Cách Sử Dụng

### 1️⃣ Truy Cập Trang Quản Lý

1. Đăng nhập vào **Admin Dashboard** (`/admin`)
2. Vào menu bên trái: **📋 Điều khoản & Chính sách**
3. Bạn sẽ thấy danh sách các policy mặc định:
   - ✅ Điều khoản sử dụng
   - ✅ Chính sách bảo mật
   - ✅ Chính sách hoàn tiền
   - ❌ Chính sách liên hệ (ẩn, chỉ dành cho IT)

### 2️⃣ Thêm Policy Mới

```
1. Click nút "➕ Thêm mới"
2. Điền Tiêu đề (vd: "Chính sách liên hệ")
3. Slug tự động tạo từ tiêu đề (vd: "chinh-sach-lien-he")
   - Có thể sửa lại để phù hợp
   - Đây là phần ID trong URL: /policy/{slug}
4. Chọn "Hiển thị ở Footer" nếu muốn công khai
5. Nhập nội dung (text hoặc markdown)
6. Điều chỉnh "Thứ tự hiển thị" (số nhỏ hơn = ưu tiên hơn)
7. Click "💾 Lưu"
```

### 3️⃣ Sửa Policy Hiện Tại

```
1. Tìm policy trong bảng danh sách
2. Click nút "✏️ Sửa"
3. Chỉnh sửa thông tin
4. Click "💾 Lưu"
```

### 4️⃣ Xóa Policy

```
1. Tìm policy trong bảng danh sách
2. Click nút "🗑️ Xóa"
3. Xác nhận xóa
```

### 5️⃣ Điều Khiển Hiển Thị

- **Hiển thị Footer** column:
  - 🟢 **Có** = Policy link sẽ xuất hiện ở footer website
  - 🔴 **Không** = Policy ẩn, chỉ dùng cho nội bộ
  - Click vào để toggle

### 6️⃣ Sắp Xếp Thứ Tự

- Column **Thứ tự** cho phép nhập số
- Số nhỏ hiển thị trước (vd: 1, 2, 3...)
- Thay đổi xong tự động lưu

---

## 📚 Các Policy Mặc Định Cần Bổ Sung

### 🔴 Bắt Buộc Cho Bộ Công Thương:

| Tên                      | Slug               | Nội Dung                              |
| ------------------------ | ------------------ | ------------------------------------- |
| **Điều khoản sử dụng**   | `terms-of-service` | Quy tắc, cam kết dịch vụ, trách nhiệm |
| **Chính sách bảo mật**   | `privacy-policy`   | Cách xử lý dữ liệu cá nhân            |
| **Chính sách hoàn tiền** | `return-policy`    | Điều kiện hoàn tiền, bồi thường       |

### 🟡 Khuyến Nghị Thêm:

| Tên                             | Slug                | Nội Dung                            |
| ------------------------------- | ------------------- | ----------------------------------- |
| **Quy định liên hệ**            | `contact-policy`    | Hướng dẫn liên hệ, xử lý khiếu nại  |
| **Quy định áp dụng**            | `application-rules` | Điều kiện nộp đơn, yêu cầu tài liệu |
| **Chính sách hỗ trợ sau tuyển** | `support-policy`    | Hỗ trợ sau khi được tuyển dụng      |

---

## 🌐 Hiển Thị Trên Website

### 📍 Footer

- Tất cả policy có `displayInFooter = true` sẽ xuất hiện ở phần "Support" trong footer
- Sắp xếp theo `order` (thứ tự)
- Link: `/policy/{slug}`

### 📍 Trang Chi Tiết

- URL: `https://flylabour.com/policy/{slug}`
- Ví dụ: `https://flylabour.com/policy/terms-of-service`
- Hiển thị nội dung policy + CTA "Liên hệ chúng tôi"

### 📍 Bottom Footer

- Link "Điều khoản sử dụng" → `/policy/terms-of-service`
- Link "Chính sách bảo mật" → `/privacy`

---

## 📝 Mẫu Nội Dung Policy

### Điều Khoản Sử Dụng

```
# Điều Khoản Sử Dụng Dịch Vụ Fly Labour

## 1. Giới Thiệu
Fly Labour là nền tảng...

## 2. Cam Kết
- Cung cấp thông tin chính xác
- Bảo vệ quyền lợi người lao động
- ...

## 3. Trách Nhiệm Người Dùng
- Cung cấp thông tin đúng sự thật
- Tuân thủ pháp luật
- ...

## 4. Giới Hạn Trách Nhiệm
Fly Labour không chịu trách nhiệm về:
- Chất lượng dịch vụ của nhà tuyển dụng
- ...
```

### Chính Sách Bảo Mật

```
# Chính Sách Bảo Mật

## 1. Thông tin thu thập
- Họ tên, email, số điện thoại
- CV, kinh nghiệm, bằng cấp
- ...

## 2. Cách sử dụng
- Xử lý đơn ứng tuyển
- Cải thiện dịch vụ
- ...

## 3. Bảo vệ dữ liệu
- Mã hóa SSL
- Kiểm tra bảo mật định kỳ
- ...
```

---

## 🔒 Lưu Ý Bảo Mật

- ✅ Để `displayInFooter = true` chỉ cho các policy công khai
- ✅ Review nội dung trước khi công bố
- ✅ Lưu bản draft trong nội bộ nếu chưa sẵn sàng
- ✅ Tuân thủ quy định của Bộ Công Thương

---

## 📊 Database

Dữ liệu policies được lưu trong **settings table**:

```
settings table:
{
  key: "policies",
  value: JSON.stringify([
    {
      slug: "terms-of-service",
      title: "Điều khoản sử dụng",
      displayInFooter: true,
      content: "...",
      order: 1
    },
    ...
  ])
}
```

---

## 🚀 API Endpoints

### Get All Policies (Public)

```
GET /settings
Response: { policies: "[{...}]" }
```

### Save Policies (Admin Only)

```
PUT /settings
Body: { policies: "[{...}]" }
```

---

## ❓ Câu Hỏi Thường Gặp

### Q: Tôi muốn xóa một policy nhưng để URL còn tồn tại?

**A:** Đặt `displayInFooter = false` thay vì xóa. Nội dung vẫn giữ nguyên.

### Q: Làm sao để thay đổi URL của policy?

**A:** Sửa field **Slug** trong modal edit. Ví dụ: `terms` → `terms-of-service`

### Q: Policy hiện ra ở footer nhưng muốn ẩn tạm thời?

**A:** Click vào nút toggle "Hiển thị Footer" để thay đổi từ "Có" → "Không"

### Q: Tôi muốn backup nội dung policy?

**A:** Tất cả dữ liệu được lưu trong database. Admin có thể export settings nếu cần.

---

## 📞 Hỗ Trợ

Nếu có vấn đề, liên hệ:

- 📧 Email: admin@flylabour.com
- 💬 Admin Discord: [link]
- 📱 Hotline: 0333 318 882

---

**Cập nhật lần cuối:** 2026-01-06
