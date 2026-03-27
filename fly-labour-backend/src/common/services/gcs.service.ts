import { Injectable, Logger } from '@nestjs/common'
import { Storage } from '@google-cloud/storage'
import { extname } from 'path'
import { randomUUID } from 'crypto'

@Injectable()
export class GcsService {
  private storage: Storage
  private bucketName: string
  private readonly logger = new Logger(GcsService.name)

  constructor() {
    this.bucketName = process.env.GCS_BUCKET_NAME || ''

    const keyJson = process.env.GCS_KEY_JSON
    const privateKey = process.env.GCS_PRIVATE_KEY
    const clientEmail = process.env.GCS_CLIENT_EMAIL
    const projectId = process.env.GCS_PROJECT_ID

    if (keyJson) {
      // Format 1: full JSON (ưu tiên)
      try {
        const credentials = JSON.parse(keyJson)
        this.storage = new Storage({ credentials })
        this.logger.log('GCS khởi tạo từ GCS_KEY_JSON')
      } catch {
        this.logger.error('GCS_KEY_JSON không hợp lệ')
        this.storage = new Storage()
      }
    } else if (privateKey && clientEmail) {
      // Format 2: từng biến riêng lẻ (Railway)
      this.storage = new Storage({
        projectId,
        credentials: {
          client_email: clientEmail,
          private_key: privateKey.replace(/\\n/g, '\n'),
        },
      })
      this.logger.log('GCS khởi tạo từ GCS_PRIVATE_KEY + GCS_CLIENT_EMAIL')
    } else {
      this.logger.warn('Không có GCS credentials — upload sẽ thất bại')
      this.storage = new Storage()
    }
  }

  async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
    if (!this.bucketName) {
      throw new Error('GCS_BUCKET_NAME chưa được cấu hình')
    }

    const ext = extname(file.originalname).toLowerCase()
    const filename = `${folder}/${randomUUID()}${ext}`

    try {
      const bucket = this.storage.bucket(this.bucketName)
      const fileRef = bucket.file(filename)

      await fileRef.save(file.buffer, {
        metadata: { contentType: file.mimetype },
        // Không dùng public: true vì bucket dùng Uniform access control
        // File public/private được quản lý qua IAM của bucket (allUsers = Storage Object Viewer)
      })

      const url = `https://storage.googleapis.com/${this.bucketName}/${filename}`
      this.logger.log(`Uploaded: ${url}`)
      return url
    } catch (err: any) {
      this.logger.error(`GCS upload thất bại: ${err?.message || err}`)
      throw err
    }
  }
}
