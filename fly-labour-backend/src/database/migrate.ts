import { DataSource } from 'typeorm'
import * as dotenv from 'dotenv'
dotenv.config()

const databaseUrl = process.env.DATABASE_URL

const ds = new DataSource(
  databaseUrl
    ? {
        type: 'postgres',
        url: databaseUrl,
        ssl: { rejectUnauthorized: false },
        extra: { max: 2, connectionTimeoutMillis: 10000 },
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

async function migrate() {
  await ds.initialize()
  console.log('🔗 Đang kiểm tra URL kết nối:', databaseUrl ? 'Đã nhận DATABASE_URL' : 'Đang dùng DB_HOST mặc định');
  
  await ds.initialize() // <-- Nếu sai mật khẩu, nó sẽ văng lỗi ngay tại đây
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

  // Add employer role to users_role_enum (idempotent, PG 9.3+)
  // ALTER TYPE ... ADD VALUE IF NOT EXISTS runs outside PL/pgSQL to avoid transaction issues
  const enumExists = await ds.query(`
    SELECT 1 FROM pg_type WHERE typname = 'users_role_enum'
  `)
  if (enumExists.length > 0) {
    await ds.query(`ALTER TYPE users_role_enum ADD VALUE IF NOT EXISTS 'employer'`)
    console.log('✅ users_role_enum checked/updated')
  }

  // Add employer company fields to users table (idempotent)
  await ds.query(`
    DO $$
    BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users') THEN
        ALTER TABLE users ADD COLUMN IF NOT EXISTS "companyName" varchar;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS "companyDescription" text;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS website varchar;
      END IF;
    END
    $$;
  `)

  // Add createdById to jobs table (links job to employer who created it)
  await ds.query(`
    DO $$
    BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'jobs') THEN
        ALTER TABLE jobs ADD COLUMN IF NOT EXISTS "createdById" varchar;
      END IF;
    END
    $$;
  `)

  await ds.destroy()
  console.log('✅ Migration hoàn tất!')
}

migrate().catch(err => {
  console.error('❌ Migration thất bại:', err)
  process.exit(1)
})
