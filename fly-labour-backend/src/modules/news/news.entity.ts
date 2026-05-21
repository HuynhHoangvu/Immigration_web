import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity('news')
export class News {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  title: string

  @Column({ unique: true })
  slug: string

  @Column({ type: 'text', nullable: true })
  excerpt: string

  @Column({ type: 'text', nullable: true })
  content: string

  @Column({ nullable: true })
  image: string

  @Column({ default: 'news' })
  type: 'news' | 'handbook' | 'study' | 'travel'

  @Column({ nullable: true })
  country: string

  @Column({ nullable: true })
  studyType: string

  @Column({ nullable: true })
  registerUrl: string

  @Column({ nullable: true, type: 'decimal', precision: 12, scale: 2 })
  priceFrom: number

  @Column({ nullable: true, type: 'decimal', precision: 12, scale: 2 })
  priceTo: number

  @Column({ nullable: true, default: 'VND' })
  priceCurrency: string

  @Column({ type: 'text', nullable: true })
  itinerary: string

  @Column({ default: true })
  isPublished: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
