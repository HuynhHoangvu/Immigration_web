import { DataSource } from 'typeorm'
import * as dotenv from 'dotenv'
dotenv.config()

async function migrate() {
  const databaseUrl = process.env.DATABASE_URL

  console.log('🔗 Đang kiểm tra URL kết nối:', databaseUrl ? 'Đã nhận DATABASE_URL' : 'Dùng local fallback')

  const ds = new DataSource(
    databaseUrl
      ? {
          type: 'postgres',
          url: databaseUrl,
          ssl: { rejectUnauthorized: false },
          extra: { max: 2, connectionTimeoutMillis: 15000 },
        }
      : {
          type: 'postgres',
          host: process.env.DB_HOST || 'localhost',
          port: parseInt(process.env.DB_PORT || '5432'),
          username: process.env.DB_USERNAME || 'postgres',
          password: process.env.DB_PASSWORD || '123456',
          database: process.env.DB_NAME || 'fly_labour',
        }
  )

  await ds.initialize()
  console.log('🔧 Bắt đầu migration...')

  // Đổi country từ PostgreSQL enum → varchar (idempotent)
  await ds.query(`
    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'jobs'
          AND column_name = 'country'
          AND data_type = 'USER-DEFINED'
      ) THEN
        ALTER TABLE jobs ALTER COLUMN country TYPE varchar(100) USING country::text;
        RAISE NOTICE 'Đã đổi country → varchar';
      ELSE
        RAISE NOTICE 'country đã là varchar, bỏ qua';
      END IF;
    END
    $$;
  `)

  // Xóa enum type cũ nếu còn tồn tại (tránh TypeORM tự cleanup phá dữ liệu)
  await ds.query(`DROP TYPE IF EXISTS "public"."jobs_country_enum"`)
  console.log('✅ jobs_country_enum cleaned up')

  // Add employer role to users_role_enum (idempotent)
  const enumExists = await ds.query(`
    SELECT 1 FROM pg_type WHERE typname = 'users_role_enum'
  `)
  if (enumExists.length > 0) {
    await ds.query(`ALTER TYPE users_role_enum ADD VALUE IF NOT EXISTS 'employer'`)
    console.log('✅ users_role_enum checked/updated')
  }

  // Add employer company fields, phone, and other missing columns to users table (idempotent)
  await ds.query(`
    DO $$
    BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users') THEN
        ALTER TABLE users ADD COLUMN IF NOT EXISTS phone varchar;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar varchar;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS address varchar;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS "cvUrl" varchar;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS "companyName" varchar;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS "companyDescription" text;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS website varchar;
      END IF;
    END
    $$;
  `)

  // Add createdById to jobs table (idempotent)
  await ds.query(`
    DO $$
    BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'jobs') THEN
        ALTER TABLE jobs ADD COLUMN IF NOT EXISTS "createdById" varchar;
      END IF;
    END
    $$;
  `)

  // Tạo bảng contacts nếu chưa có
  await ds.query(`
    CREATE TABLE IF NOT EXISTS contacts (
      id UUID PRIMARY KEY,
      name VARCHAR NOT NULL,
      email VARCHAR NOT NULL,
      phone VARCHAR,
      message TEXT NOT NULL,
      "isRead" BOOLEAN NOT NULL DEFAULT false,
      "createdAt" TIMESTAMP NOT NULL DEFAULT now()
    )
  `)
  console.log('✅ contacts table ready')

  // Tạo bảng settings nếu chưa có
  await ds.query(`
    CREATE TABLE IF NOT EXISTS settings (
      key VARCHAR PRIMARY KEY,
      value TEXT,
      "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
    )
  `)
  console.log('✅ settings table ready')

  await ds.destroy()
  console.log('✅ Migration hoàn tất!')
}

migrate().catch(err => {
  console.error('❌ Migration thất bại:', err.message)
  process.exit(1)
})
