"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config();
const user_entity_1 = require("../../modules/users/user.entity");
const category_entity_1 = require("../../modules/categories/category.entity");
const job_entity_1 = require("../../modules/jobs/job.entity");
const news_entity_1 = require("../../modules/news/news.entity");
async function seed() {
    const databaseUrl = process.env.DATABASE_URL;
    const AppDataSource = new typeorm_1.DataSource(databaseUrl
        ? {
            type: 'postgres',
            url: databaseUrl,
            ssl: { rejectUnauthorized: false },
            entities: [user_entity_1.User, category_entity_1.Category, job_entity_1.Job, news_entity_1.News],
            synchronize: true,
            extra: { max: 2, connectionTimeoutMillis: 10000 },
        }
        : {
            type: 'postgres',
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '5432'),
            username: process.env.DB_USERNAME || 'postgres',
            password: process.env.DB_PASSWORD || '123456',
            database: process.env.DB_NAME || 'fly_labour',
            entities: [user_entity_1.User, category_entity_1.Category, job_entity_1.Job, news_entity_1.News],
            synchronize: true,
        });
    await AppDataSource.initialize();
    console.log('🌱 Bắt đầu seed dữ liệu...');
    const userRepo = AppDataSource.getRepository(user_entity_1.User);
    const existAdmin = await userRepo.findOne({ where: { email: 'admin@flylabour.com' } });
    if (!existAdmin) {
        await userRepo.save([
            userRepo.create({
                fullName: 'Admin Fly Labour',
                email: 'admin@flylabour.com',
                phone: '0901234567',
                password: await bcrypt.hash('Admin@123', 12),
                role: user_entity_1.UserRole.ADMIN,
                isActive: true,
            }),
            userRepo.create({
                fullName: 'Nguyễn Văn A',
                email: 'user@example.com',
                phone: '0912345678',
                password: await bcrypt.hash('User@123', 12),
                role: user_entity_1.UserRole.USER,
                isActive: true,
            }),
        ]);
        console.log('✅ Tạo 2 users (admin + user demo)');
    }
    else {
        console.log('⏭️  Users đã tồn tại, bỏ qua');
    }
    const catRepo = AppDataSource.getRepository(category_entity_1.Category);
    const catCount = await catRepo.count();
    if (catCount === 0) {
        const categories = [
            { name: 'Nông nghiệp', nameEn: 'Farm', icon: '🌾', description: 'Hái quả, trồng trọt, chăn nuôi', sortOrder: 1 },
            { name: 'Nail & Spa', nameEn: 'Nail', icon: '💅', description: 'Kỹ thuật viên nail, thẩm mỹ', sortOrder: 2 },
            { name: 'Kỹ thuật', nameEn: 'Engineering', icon: '⚙️', description: 'Kỹ sư, vận hành máy móc', sortOrder: 3 },
            { name: 'Xây dựng', nameEn: 'Construction', icon: '🏗️', description: 'Thợ hồ, xây dựng công trình', sortOrder: 4 },
            { name: 'Nhà hàng', nameEn: 'Hospitality', icon: '🍽️', description: 'Đầu bếp, phục vụ nhà hàng', sortOrder: 5 },
            { name: 'Y tế', nameEn: 'Healthcare', icon: '🏥', description: 'Y tá, chăm sóc người cao tuổi', sortOrder: 6 },
            { name: 'Logistics', nameEn: 'Logistics', icon: '🚛', description: 'Lái xe, kho vận, giao hàng', sortOrder: 7 },
            { name: 'Công nghệ', nameEn: 'IT', icon: '💻', description: 'Lập trình viên, IT support', sortOrder: 8 },
            { name: 'Dịch vụ', nameEn: 'Services', icon: '💼', description: 'Bán lẻ, dịch vụ khách hàng, văn phòng', sortOrder: 9 },
        ];
        const savedCats = await catRepo.save(categories.map(c => catRepo.create(c)));
        console.log(`✅ Tạo ${savedCats.length} danh mục`);
        const jobRepo = AppDataSource.getRepository(job_entity_1.Job);
        const farmCat = savedCats[0];
        const nailCat = savedCats[1];
        const engCat = savedCats[2];
        const resCat = savedCats[4];
        await jobRepo.save([
            jobRepo.create({
                title: 'Công nhân Hái Quả Mùa Vụ',
                company: 'Sunshine Farms',
                location: 'Queensland',
                country: 'australia',
                jobType: job_entity_1.JobType.SEASONAL,
                status: job_entity_1.JobStatus.ACTIVE,
                salaryMin: 2800, salaryMax: 3500, salaryCurrency: 'AUD',
                slots: 50, deadline: '2025-06-30',
                description: 'Tuyển 50 lao động hái quả mùa vụ tại Queensland, Úc. Bao ăn ở, hỗ trợ visa.',
                requirements: 'Sức khỏe tốt, chịu khó, không yêu cầu kinh nghiệm.',
                benefits: 'Bao visa. Bao vé máy bay. Bao ăn ở tại farm.',
                isHot: true, isFeatured: true,
                image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=75',
                categoryId: farmCat.id,
            }),
            jobRepo.create({
                title: 'Kỹ thuật viên Nail cao cấp',
                company: 'Melbourne Nail Studio',
                location: 'Melbourne',
                country: 'australia',
                jobType: job_entity_1.JobType.FULL_TIME,
                status: job_entity_1.JobStatus.ACTIVE,
                salaryMin: 3200, salaryMax: 4500, salaryCurrency: 'AUD',
                slots: 10, deadline: '2025-05-30',
                description: 'Cần tuyển kỹ thuật viên nail có kinh nghiệm làm việc tại studio sang trọng Melbourne.',
                requirements: 'Kinh nghiệm nail tối thiểu 1 năm. Biết tiếng Anh cơ bản.',
                benefits: 'Lương + tip. Hỗ trợ tìm nhà ở. Visa sponsored.',
                isHot: true, isFeatured: true,
                image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=75',
                categoryId: nailCat.id,
            }),
            jobRepo.create({
                title: 'Thợ Hàn Công Nghiệp',
                company: 'BC Steel Works',
                location: 'British Columbia',
                country: 'canada',
                jobType: job_entity_1.JobType.FULL_TIME,
                status: job_entity_1.JobStatus.ACTIVE,
                salaryMin: 3500, salaryMax: 5000, salaryCurrency: 'CAD',
                slots: 20, deadline: '2025-07-15',
                description: 'Tuyển thợ hàn có tay nghề làm việc tại nhà máy thép British Columbia, Canada.',
                requirements: 'Bằng nghề hàn. Kinh nghiệm 2 năm trở lên.',
                benefits: 'Lương cao. Bao visa. Bảo hiểm y tế đầy đủ.',
                isHot: true, isFeatured: false,
                image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=75',
                categoryId: engCat.id,
            }),
            jobRepo.create({
                title: 'Đầu bếp Việt Nam',
                company: 'Pho Saigon Restaurant',
                location: 'Auckland',
                country: 'new_zealand',
                jobType: job_entity_1.JobType.FULL_TIME,
                status: job_entity_1.JobStatus.ACTIVE,
                salaryMin: 2900, salaryMax: 3800, salaryCurrency: 'NZD',
                slots: 5, deadline: '2025-06-01',
                description: 'Nhà hàng Việt Nam tại Auckland cần tuyển đầu bếp có kinh nghiệm nấu ẩm thực Việt.',
                requirements: 'Kinh nghiệm nấu ăn 2 năm. Ưu tiên có bằng nghề bếp.',
                benefits: 'Bao ăn ở. Hỗ trợ visa. Môi trường thân thiện.',
                isHot: false, isFeatured: false,
                image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=75',
                categoryId: resCat.id,
            }),
            jobRepo.create({
                title: 'Lái Xe Container Hạng Nặng',
                company: 'TransOz Logistics',
                location: 'Perth',
                country: 'australia',
                jobType: job_entity_1.JobType.FULL_TIME,
                status: job_entity_1.JobStatus.ACTIVE,
                salaryMin: 4000, salaryMax: 5500, salaryCurrency: 'AUD',
                slots: 15, deadline: '2026-06-15',
                description: 'Tuyển lái xe container hạng nặng có bằng HR tại Perth, Úc.',
                requirements: 'Bằng lái HR. Kinh nghiệm 2 năm. Tiếng Anh giao tiếp.',
                benefits: 'Lương rất cao. Phụ cấp đường dài. Visa sponsored.',
                isHot: true, isFeatured: false,
                image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&q=75',
                categoryId: savedCats[6].id,
            }),
            jobRepo.create({
                title: 'Y Tá Chăm Sóc Người Cao Tuổi',
                company: 'Sunrise Aged Care',
                location: 'Sydney',
                country: 'australia',
                jobType: job_entity_1.JobType.FULL_TIME,
                status: job_entity_1.JobStatus.ACTIVE,
                salaryMin: 3800, salaryMax: 5200, salaryCurrency: 'AUD',
                slots: 20, deadline: '2026-08-31',
                description: 'Tuyển y tá và trợ lý chăm sóc người cao tuổi tại trung tâm dưỡng lão Sydney. Bao gồm hỗ trợ vật lý trị liệu, chăm sóc hàng ngày và giao tiếp với gia đình bệnh nhân.',
                requirements: 'Bằng y tá hoặc điều dưỡng. Tiếng Anh IELTS 6.0+. Có kinh nghiệm chăm sóc người cao tuổi là lợi thế.',
                benefits: 'Visa 482 sponsored. Lương theo giờ cao. Bảo hiểm y tế. Cơ hội PR sau 2 năm.',
                isHot: true, isFeatured: true,
                image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=75',
                categoryId: savedCats[5].id,
            }),
            jobRepo.create({
                title: 'Kỹ Sư Phần Mềm Backend',
                company: 'TechVenture Canada',
                location: 'Toronto',
                country: 'canada',
                jobType: job_entity_1.JobType.FULL_TIME,
                status: job_entity_1.JobStatus.ACTIVE,
                salaryMin: 6000, salaryMax: 9000, salaryCurrency: 'CAD',
                slots: 8, deadline: '2026-09-30',
                description: 'Startup công nghệ tại Toronto cần tuyển kỹ sư backend có kinh nghiệm Node.js/Python. Làm việc remote 3 ngày/tuần, văn phòng 2 ngày.',
                requirements: 'Kinh nghiệm 3 năm Node.js hoặc Python. Biết Docker, AWS. Tiếng Anh tốt.',
                benefits: 'Lương cạnh tranh. Work permit sponsored. Stock options. Remote linh hoạt.',
                isHot: true, isFeatured: true,
                image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=75',
                categoryId: savedCats[7].id,
            }),
            jobRepo.create({
                title: 'Công Nhân Xây Dựng Tổng Hợp',
                company: 'Auckland Build Group',
                location: 'Auckland',
                country: 'new_zealand',
                jobType: job_entity_1.JobType.CONTRACT,
                status: job_entity_1.JobStatus.ACTIVE,
                salaryMin: 2600, salaryMax: 3400, salaryCurrency: 'NZD',
                slots: 30, deadline: '2026-07-31',
                description: 'Tuyển công nhân xây dựng tổng hợp cho các dự án nhà ở và thương mại tại Auckland. Công việc bao gồm đổ bê tông, lắp đặt khung thép, hoàn thiện nội thất.',
                requirements: 'Sức khỏe tốt. Kinh nghiệm xây dựng 1 năm. Có thể làm việc ngoài trời.',
                benefits: 'Bao visa. Phụ cấp nhà ở. Làm thêm giờ được trả 1.5x lương.',
                isHot: false, isFeatured: true,
                image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=75',
                categoryId: savedCats[3].id,
            }),
            jobRepo.create({
                title: 'Nhân Viên Kho Hàng Amazon',
                company: 'Amazon Fulfillment Center',
                location: 'Vancouver',
                country: 'canada',
                jobType: job_entity_1.JobType.FULL_TIME,
                status: job_entity_1.JobStatus.ACTIVE,
                salaryMin: 2800, salaryMax: 3600, salaryCurrency: 'CAD',
                slots: 40, deadline: '2026-10-15',
                description: 'Amazon Canada tuyển nhân viên kho vận tại trung tâm phân phối Vancouver. Nhiệm vụ: nhận hàng, phân loại, đóng gói, vận chuyển nội bộ.',
                requirements: 'Không yêu cầu kinh nghiệm. Có thể đứng 8 tiếng. Làm được ca đêm.',
                benefits: 'Lương theo giờ $19-23/h. Bảo hiểm y tế. Work permit. Thưởng năng suất.',
                isHot: true, isFeatured: false,
                image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=75',
                categoryId: savedCats[6].id,
            }),
            jobRepo.create({
                title: 'Thợ Điện Công Nghiệp',
                company: 'Electra Engineering GmbH',
                location: 'Munich',
                country: 'germany',
                jobType: job_entity_1.JobType.FULL_TIME,
                status: job_entity_1.JobStatus.ACTIVE,
                salaryMin: 2800, salaryMax: 4000, salaryCurrency: 'EUR',
                slots: 12, deadline: '2026-11-30',
                description: 'Công ty kỹ thuật Đức tuyển thợ điện công nghiệp lắp đặt và bảo trì hệ thống điện nhà máy.',
                requirements: 'Bằng nghề điện công nghiệp. Kinh nghiệm 2 năm. Tiếng Anh hoặc Đức cơ bản.',
                benefits: 'Visa lao động Đức. Lương theo bảng lương Đức. Bảo hiểm xã hội đầy đủ.',
                isHot: false, isFeatured: false,
                image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=75',
                categoryId: savedCats[2].id,
            }),
            jobRepo.create({
                title: 'Nhân Viên Phục Vụ Nhà Hàng',
                company: 'The Crown Hotel',
                location: 'Melbourne',
                country: 'australia',
                jobType: job_entity_1.JobType.PART_TIME,
                status: job_entity_1.JobStatus.ACTIVE,
                salaryMin: 2200, salaryMax: 2800, salaryCurrency: 'AUD',
                slots: 25, deadline: '2026-06-30',
                description: 'Khách sạn 5 sao Crown tại Melbourne tuyển nhân viên phục vụ nhà hàng và bar. Ca làm việc linh hoạt, phù hợp du học sinh và người mới.',
                requirements: 'Tiếng Anh giao tiếp tốt. Ngoại hình lịch sự. Kinh nghiệm phục vụ là lợi thế.',
                benefits: 'Tip cao. Bao bữa ăn ca. Hỗ trợ visa. Môi trường 5 sao chuyên nghiệp.',
                isHot: false, isFeatured: false,
                image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=75',
                categoryId: savedCats[4].id,
            }),
            jobRepo.create({
                title: 'Công Nhân Chế Biến Hải Sản',
                company: 'SeaFresh NZ Ltd',
                location: 'Christchurch',
                country: 'new_zealand',
                jobType: job_entity_1.JobType.SEASONAL,
                status: job_entity_1.JobStatus.ACTIVE,
                salaryMin: 2400, salaryMax: 3000, salaryCurrency: 'NZD',
                slots: 35, deadline: '2026-05-31',
                description: 'Nhà máy chế biến hải sản tại Christchurch tuyển công nhân sơ chế, đóng gói tôm cá. Làm theo ca, bao ăn ở ký túc xá.',
                requirements: 'Chịu khó, chịu lạnh. Không yêu cầu kinh nghiệm. Làm được ca đêm.',
                benefits: 'Bao ăn ở tại nhà máy. Visa seasonal worker. Thưởng hoàn thành hợp đồng.',
                isHot: false, isFeatured: false,
                image: 'https://images.unsplash.com/photo-1497019944517-2b9c9a742a80?w=800&q=75',
                categoryId: savedCats[4].id,
            }),
            jobRepo.create({
                title: 'Kỹ Thuật Viên Máy CNC',
                company: 'Precision Parts Canada',
                location: 'Calgary',
                country: 'canada',
                jobType: job_entity_1.JobType.FULL_TIME,
                status: job_entity_1.JobStatus.ACTIVE,
                salaryMin: 3500, salaryMax: 5000, salaryCurrency: 'CAD',
                slots: 10, deadline: '2026-12-31',
                description: 'Công ty gia công cơ khí chính xác tại Calgary tuyển kỹ thuật viên vận hành máy CNC tiện, phay.',
                requirements: 'Bằng nghề cơ khí. Kinh nghiệm máy CNC 2 năm. Đọc bản vẽ kỹ thuật.',
                benefits: 'Visa lao động. Lương + OT. Đào tạo nâng cao. Bảo hiểm y tế gia đình.',
                isHot: true, isFeatured: false,
                image: 'https://images.unsplash.com/photo-1565688534245-05d6b5be184a?w=800&q=75',
                categoryId: savedCats[2].id,
            }),
            jobRepo.create({
                title: 'Trợ Lý Nha Khoa',
                company: 'SmileBright Dental',
                location: 'Brisbane',
                country: 'australia',
                jobType: job_entity_1.JobType.FULL_TIME,
                status: job_entity_1.JobStatus.ACTIVE,
                salaryMin: 3000, salaryMax: 4000, salaryCurrency: 'AUD',
                slots: 6, deadline: '2026-09-15',
                description: 'Phòng khám nha khoa tại Brisbane tuyển trợ lý nha khoa hỗ trợ bác sĩ trong các ca điều trị, tiếp đón bệnh nhân và quản lý hồ sơ.',
                requirements: 'Bằng trợ lý nha khoa hoặc y tế. Tiếng Anh tốt. Cẩn thận, chuyên nghiệp.',
                benefits: 'Visa 482. Lương tốt. Môi trường làm việc sạch sẽ chuyên nghiệp.',
                isHot: false, isFeatured: false,
                image: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=800&q=75',
                categoryId: savedCats[5].id,
            }),
            jobRepo.create({
                title: 'Thợ Hàn TIG Inox Xuất Khẩu',
                company: 'SteelFab NZ',
                location: 'Wellington',
                country: 'new_zealand',
                jobType: job_entity_1.JobType.FULL_TIME,
                status: job_entity_1.JobStatus.ACTIVE,
                salaryMin: 3000, salaryMax: 4200, salaryCurrency: 'NZD',
                slots: 8, deadline: '2026-08-15',
                description: 'Công ty chế tạo kết cấu thép tại Wellington cần tuyển thợ hàn TIG inox và thép không gỉ cho các đơn hàng xuất khẩu Mỹ, Úc.',
                requirements: 'Chứng chỉ hàn TIG. Kinh nghiệm hàn inox 2 năm. Làm theo ca.',
                benefits: 'Lương cao + phụ cấp kỹ thuật. Visa sponsored. Bảo hiểm tai nạn lao động.',
                isHot: true, isFeatured: true,
                image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=75',
                categoryId: savedCats[2].id,
            }),
        ]);
        console.log('✅ Tạo 15 việc làm mẫu (5 cũ + 10 mới)');
    }
    else {
        console.log('⏭️  Danh mục & việc làm đã tồn tại, bỏ qua');
    }
    const newsRepo = AppDataSource.getRepository(news_entity_1.News);
    const newsCount = await newsRepo.count();
    if (newsCount === 0) {
        await newsRepo.save([
            newsRepo.create({
                title: 'Chính sách visa lao động Úc 2025 có gì mới?',
                slug: 'visa-uc-2025',
                excerpt: 'Chính phủ Úc vừa công bố một số thay đổi quan trọng trong chính sách visa lao động năm 2025...',
                content: 'Nội dung chi tiết về chính sách visa Úc 2025...',
                isPublished: true,
            }),
            newsRepo.create({
                title: 'Top 5 ngành nghề dễ xin việc tại Canada năm 2025',
                slug: 'nganh-nghe-canada-2025',
                excerpt: 'Canada đang thiếu hụt lao động trầm trọng trong nhiều ngành. Đây là cơ hội vàng cho lao động Việt Nam...',
                content: 'Nội dung chi tiết về các ngành nghề tại Canada...',
                isPublished: true,
            }),
            newsRepo.create({
                title: 'Kinh nghiệm chuẩn bị hồ sơ xin việc tại New Zealand',
                slug: 'ho-so-new-zealand',
                excerpt: 'Bộ hồ sơ hoàn chỉnh là chìa khóa để được nhà tuyển dụng New Zealand chú ý...',
                content: 'Nội dung chi tiết về hồ sơ xin việc NZ...',
                isPublished: true,
            }),
        ]);
        console.log('✅ Tạo 3 tin tức mẫu');
    }
    await AppDataSource.destroy();
    console.log('\n🎉 Seed hoàn tất!');
    console.log('📧 Admin: admin@flylabour.com / Admin@123');
    console.log('📧 User:  user@example.com / User@123');
}
seed().catch(err => { console.error('❌ Seed thất bại:', err.message); process.exit(1); });
//# sourceMappingURL=run-seeds.js.map