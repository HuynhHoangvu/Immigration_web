/**
 * seed-travel.mjs — Seed 5 tour du lịch mẫu vào database
 * Chạy: node scripts/seed-travel.mjs
 * Yêu cầu: backend đang chạy tại http://localhost:3000 và đã có admin account
 *
 * Điền ADMIN_EMAIL + ADMIN_PASSWORD trước khi chạy
 */

import fetch from "node:fetch"; // Node 18+ built-in

const BASE_URL = "http://localhost:3000";
const ADMIN_EMAIL = "admin@fly-labour.vn"; // ← Đổi nếu khác
const ADMIN_PASSWORD = "Admin@123456";     // ← Đổi nếu khác

const TOURS = [
  {
    title: "Tour Hàn Quốc 5N4Đ - Seoul / Nami / Everland",
    slug: "tour-han-quoc-5n4d",
    excerpt: "Gói phổ thông phù hợp gia đình, lịch trình nhẹ, khách sạn 3-4 sao. Thăm cung điện Gyeongbokgung, đảo Nami lãng mạn, Everland vui chơi.",
    content: `<h2>Tổng quan chương trình</h2>
<p>Tour Hàn Quốc 5N4Đ là gói du lịch được thiết kế dành cho gia đình và cặp đôi muốn trải nghiệm văn hoá Hàn Quốc ở mức độ vừa phải, lịch trình nhẹ nhàng, không quá gấp.</p>

<h3>Điểm nổi bật</h3>
<ul>
  <li>Tham quan Cung điện Gyeongbokgung và Làng văn hoá Bukchon Hanok</li>
  <li>Đảo Nami - thiên đường lá vàng mùa thu</li>
  <li>Everland - công viên giải trí lớn nhất Hàn Quốc</li>
  <li>Phố mua sắm Myeongdong và Hongdae</li>
  <li>Ẩm thực Hàn: BBQ, tteokbokki, kimchi, samgyeopsal</li>
</ul>

<h3>Chính sách hoàn hủy</h3>
<ul>
  <li>Hủy trước 30 ngày: hoàn 90%</li>
  <li>Hủy trước 15 ngày: hoàn 70%</li>
  <li>Hủy trước 7 ngày: hoàn 50%</li>
  <li>Hủy dưới 7 ngày: không hoàn</li>
</ul>

<h3>Lưu ý</h3>
<p>Công dân Việt Nam cần visa Hàn Quốc (phí khoảng 800.000 VND - 1.200.000 VND). Chúng tôi hỗ trợ hồ sơ visa đầy đủ. Tỉ lệ đậu visa >95%.</p>`,
    image: "https://images.unsplash.com/photo-1538485399081-7c8976f33827?w=1200&q=80&fit=crop",
    isPublished: "true",
    type: "travel",
    country: "south_korea",
    priceFrom: "14900000",
    priceTo: "18900000",
    priceCurrency: "VND",
    itinerary: "Ngày 1: Bay đến Seoul, nhận phòng, tham quan Myeongdong\nNgày 2: Gyeongbokgung - Bukchon Hanok - Namsan Tower\nNgày 3: Đảo Nami - Petite France - Garden of Morning Calm\nNgày 4: Everland - mua sắm Dongdaemun\nNgày 5: Tự do mua sắm - ra sân bay về Việt Nam",
    registerUrl: "",
  },
  {
    title: "Tour Nhật Bản 6N5Đ - Tokyo / Núi Fuji / Osaka",
    slug: "tour-nhat-ban-6n5d",
    excerpt: "Lộ trình vàng mùa hoa anh đào, tối ưu điểm check-in và mua sắm. Trải nghiệm văn hoá Nhật Bản từ cổ điển đến hiện đại.",
    content: `<h2>Tổng quan chương trình</h2>
<p>Tour Nhật Bản 6N5Đ kết hợp hoàn hảo giữa thủ đô Tokyo hiện đại, núi thiêng Fuji và cố đô Kyoto - Osaka cổ kính. Đây là hành trình "phải đi ít nhất 1 lần trong đời" với người Việt.</p>

<h3>Điểm nổi bật</h3>
<ul>
  <li>Tokyo: Shinjuku, Shibuya Crossing, Asakusa, Akihabara</li>
  <li>Núi Fuji: Cảnh quan thiên nhiên hùng vĩ, Fuji Five Lakes</li>
  <li>Kyoto: Chùa Kinkakuji (Kim Các Tự), Fushimi Inari, Arashiyama</li>
  <li>Osaka: Thành Osaka, Dotonbori, mua sắm tại Shinsaibashi</li>
  <li>Trải nghiệm shinkansen (tàu cao tốc) giữa các thành phố</li>
</ul>

<h3>Chính sách hoàn hủy</h3>
<ul>
  <li>Hủy trước 45 ngày: hoàn 90%</li>
  <li>Hủy trước 30 ngày: hoàn 70%</li>
  <li>Hủy trước 15 ngày: hoàn 50%</li>
  <li>Hủy dưới 15 ngày: không hoàn</li>
</ul>

<p><strong>Tặng sim data 5GB</strong> sử dụng toàn quốc Nhật Bản trong suốt chuyến đi.</p>`,
    image: "https://images.unsplash.com/photo-1492571350019-22de08371fd3?w=1200&q=80&fit=crop",
    isPublished: "true",
    type: "travel",
    country: "japan",
    priceFrom: "28900000",
    priceTo: "35900000",
    priceCurrency: "VND",
    itinerary: "Ngày 1: Bay đến Tokyo - nhận phòng - Shinjuku\nNgày 2: Asakusa - Tokyo Skytree - Shibuya Crossing\nNgày 3: Núi Fuji - Fuji Five Lakes - Hakone\nNgày 4: Shinkansen đến Kyoto - Fushimi Inari - Gion\nNgày 5: Kinkakuji - Arashiyama - Di chuyển Osaka\nNgày 6: Dotonbori - Shinsaibashi - Bay về Việt Nam",
    registerUrl: "",
  },
  {
    title: "Tour Úc 7N6Đ - Sydney / Melbourne / Blue Mountains",
    slug: "tour-uc-7n6d",
    excerpt: "Hành trình chuẩn premium, phù hợp gia đình và khách muốn trải nghiệm city + thiên nhiên hùng vĩ của Úc.",
    content: `<h2>Tổng quan chương trình</h2>
<p>Tour Úc 7N6Đ đưa bạn khám phá hai thành phố lớn nhất Úc - Sydney và Melbourne - cùng vẻ đẹp thiên nhiên hùng vĩ của Blue Mountains và Great Ocean Road. Chương trình hoàn toàn sử dụng xe riêng, không đi chung với khách khác quốc gia.</p>

<h3>Điểm nổi bật</h3>
<ul>
  <li>Sydney: Opera House, Harbour Bridge, Bondi Beach</li>
  <li>Blue Mountains: Leap Leap Sisters, Scenic Railway</li>
  <li>Thăm trại kangaroo và koala</li>
  <li>Melbourne: Federation Square, Queen Victoria Market</li>
  <li>Great Ocean Road: Twelve Apostles</li>
</ul>

<h3>Thông tin visa</h3>
<p>Cần xin visa du lịch Úc (eVisitor hoặc Tourist Visa) trước khi đặt tour. Phí visa khoảng 145 AUD (~2.500.000 VND). Chúng tôi hỗ trợ hồ sơ đầy đủ.</p>

<h3>Chính sách hoàn hủy</h3>
<ul>
  <li>Hủy trước 60 ngày: hoàn 85%</li>
  <li>Hủy trước 30 ngày: hoàn 60%</li>
  <li>Hủy dưới 30 ngày: không hoàn</li>
</ul>`,
    image: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=1200&q=80&fit=crop",
    isPublished: "true",
    type: "travel",
    country: "australia",
    priceFrom: "42900000",
    priceTo: "52900000",
    priceCurrency: "VND",
    itinerary: "Ngày 1: Bay đến Sydney - nhận phòng\nNgày 2: Sydney Opera House - Harbour Bridge - Bondi Beach\nNgày 3: Blue Mountains - Scenic Railway\nNgày 4: Thăm trại động vật - Taronga Zoo\nNgày 5: Bay đến Melbourne - Federation Square\nNgày 6: Great Ocean Road - Twelve Apostles\nNgày 7: Tự do - bay về Việt Nam",
    registerUrl: "",
  },
  {
    title: "Tour Châu Âu 10N9Đ - Pháp / Ý / Thụy Sĩ",
    slug: "tour-chau-au-10n9d",
    excerpt: "Lộ trình liên tuyến nổi bật, tối ưu thời gian và chi phí visa Schengen. Khám phá 3 quốc gia với 9 thành phố đặc sắc.",
    content: `<h2>Tổng quan chương trình</h2>
<p>Tour Châu Âu 3 nước 10N9Đ là hành trình dream trip của nhiều người Việt. Chỉ với 1 visa Schengen duy nhất, bạn sẽ khám phá Paris hoa lệ, các thành phố Ý cổ kính và cảnh quan thiên nhiên tuyệt đẹp của Thụy Sĩ.</p>

<h3>Lộ trình chi tiết</h3>
<ul>
  <li><strong>Pháp:</strong> Paris - Tháp Eiffel, Bảo tàng Louvre, cung điện Versailles</li>
  <li><strong>Thụy Sĩ:</strong> Lucerne, Interlaken, núi Jungfraujoch (nóc nhà châu Âu)</li>
  <li><strong>Ý:</strong> Milan, Venice (thành phố nước), Rome (Colosseum, Vatican)</li>
</ul>

<h3>Thông tin visa</h3>
<p>Visa Schengen France (mục đích nhập cảnh chính): phí khoảng 80 EUR (~2.200.000 VND). Thời gian xử lý 5-15 ngày làm việc. Hỗ trợ hồ sơ đầy đủ và tư vấn ngân hàng.</p>

<h3>Chính sách hoàn hủy</h3>
<ul>
  <li>Hủy trước 60 ngày: hoàn 80%</li>
  <li>Hủy trước 45 ngày: hoàn 60%</li>
  <li>Hủy trước 30 ngày: hoàn 40%</li>
  <li>Hủy dưới 30 ngày: không hoàn</li>
</ul>`,
    image: "https://images.unsplash.com/photo-1491557345352-5929e343eb89?w=1200&q=80&fit=crop",
    isPublished: "true",
    type: "travel",
    country: "europe",
    priceFrom: "69900000",
    priceTo: "89900000",
    priceCurrency: "VND",
    itinerary: "Ngày 1: Bay đến Paris\nNgày 2: Tháp Eiffel - Louvre - Sông Seine\nNgày 3: Cung điện Versailles - Montmartre\nNgày 4: Bay/Tàu đến Lucerne (Thụy Sĩ)\nNgày 5: Interlaken - Jungfraujoch\nNgày 6: Bay/Tàu đến Milan (Ý)\nNgày 7: Venice - Quảng trường San Marco\nNgày 8: Di chuyển Rome - Colosseum\nNgày 9: Vatican - Fontana di Trevi\nNgày 10: Bay về Việt Nam",
    registerUrl: "",
  },
  {
    title: "Tour Singapore 4N3Đ - Sentosa / Marina Bay / Universal",
    slug: "tour-singapore-4n3d",
    excerpt: "Tour ngắn ngày lý tưởng, lịch trình nhẹ phù hợp gia đình có trẻ nhỏ. Visa miễn phí cho công dân Việt Nam.",
    content: `<h2>Tổng quan chương trình</h2>
<p>Singapore - quốc đảo sư tử chỉ cách Việt Nam 2 tiếng bay, không cần visa, là điểm đến lý tưởng cho chuyến nghỉ dưỡng ngắn ngày. Tour 4N3Đ bao gồm tất cả các điểm tham quan nổi tiếng nhất với giá tốt nhất.</p>

<h3>Điểm nổi bật</h3>
<ul>
  <li>Gardens by the Bay: Supertree Grove, Cloud Forest, Flower Dome</li>
  <li>Marina Bay Sands: Sky Park, ánh đèn đêm huyền ảo</li>
  <li>Universal Studios Singapore: 7 khu vực giải trí</li>
  <li>Sentosa Island: S.E.A Aquarium, Adventure Cove Waterpark</li>
  <li>Chinatown, Little India, Orchard Road shopping</li>
</ul>

<h3>Ưu đãi đặc biệt</h3>
<ul>
  <li>Combo vé Universal Studios + Gardens by the Bay</li>
  <li>Hỗ trợ hoàn thuế GST mua sắm (9%)</li>
  <li>Miễn phí sim data 5GB Singapore</li>
</ul>

<h3>Lưu ý</h3>
<p>Công dân Việt Nam được miễn visa Singapore. Chỉ cần hộ chiếu còn hạn trên 6 tháng.</p>`,
    image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1200&q=80&fit=crop",
    isPublished: "true",
    type: "travel",
    country: "singapore",
    priceFrom: "15900000",
    priceTo: "21900000",
    priceCurrency: "VND",
    itinerary: "Ngày 1: Bay đến Singapore - nhận phòng - Chinatown, Little India\nNgày 2: Universal Studios Singapore - Sentosa Island\nNgày 3: Gardens by the Bay - Marina Bay Sands - Orchard Road\nNgày 4: Tự do mua sắm - bay về Việt Nam",
    registerUrl: "",
  },
];

async function main() {
  // 1. Login
  console.log("🔑 Logging in as admin...");
  const loginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });

  if (!loginRes.ok) {
    const err = await loginRes.text();
    console.error("❌ Login failed:", err);
    process.exit(1);
  }

  const { access_token } = await loginRes.json();
  console.log("✅ Login successful");

  // 2. Seed tours
  for (const tour of TOURS) {
    // Check if slug already exists
    const checkRes = await fetch(`${BASE_URL}/news/${tour.slug}`);
    if (checkRes.ok) {
      console.log(`⏭  Skip (already exists): ${tour.slug}`);
      continue;
    }

    // Build FormData-like body (using URLSearchParams since no file upload)
    const body = new URLSearchParams();
    for (const [k, v] of Object.entries(tour)) {
      body.append(k, v);
    }

    // The backend uses multipart/form-data but we can send form-urlencoded for text fields
    const res = await fetch(`${BASE_URL}/news`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    if (res.ok) {
      const data = await res.json();
      console.log(`✅ Created: ${data.title} (${data.slug})`);
    } else {
      const err = await res.text();
      console.error(`❌ Failed to create ${tour.slug}:`, err);
    }
  }

  console.log("\n🎉 Seed completed! Visit http://localhost:5173/travel to view tours.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
