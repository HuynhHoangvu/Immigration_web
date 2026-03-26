import { DataSource } from 'typeorm'
import * as dotenv from 'dotenv'
dotenv.config()

const databaseUrl = process.env.DATABASE_URL
const isInternal = databaseUrl?.includes('.railway.internal') ?? false

const ds = new DataSource(
  databaseUrl
    ? {
        type: 'postgres',
        url: databaseUrl,
        ssl: isInternal ? false : { rejectUnauthorized: false },
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

  await ds.destroy()
  console.log('✅ Migration hoàn tất!')
}

migrate().catch(err => {
  console.error('❌ Migration thất bại:', err)
  process.exit(1)
})
