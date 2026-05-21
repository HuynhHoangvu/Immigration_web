import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm'
import { Category } from '../categories/category.entity'
import { User } from '../users/user.entity'

export enum JobType { FULL_TIME = 'full_time', PART_TIME = 'part_time', CONTRACT = 'contract', SEASONAL = 'seasonal' }
export enum JobStatus { ACTIVE = 'active', PAUSED = 'paused', CLOSED = 'closed', DRAFT = 'draft', PENDING_REVIEW = 'pending_review' }

@Entity('jobs')
export class Job {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  title: string

  @Column({ nullable: true })
  titleEn: string

  @Column({ type: 'text' })
  description: string

  @Column({ type: 'text', nullable: true })
  descriptionEn: string

  @Column({ type: 'text', nullable: true })
  requirements: string

  @Column({ type: 'text', nullable: true })
  requirementsEn: string

  @Column({ type: 'text', nullable: true })
  benefits: string

  @Column({ type: 'text', nullable: true })
  benefitsEn: string

  @Column({ nullable: true })
  company: string

  @Column({ nullable: true })
  location: string

  @Index()
  @Column({ type: 'varchar', length: 100, nullable: true, default: 'australia' })
  country: string

  @Column({ type: 'enum', enum: JobType, default: JobType.FULL_TIME })
  jobType: JobType

  @Index()
  @Column({ type: 'enum', enum: JobStatus, default: JobStatus.ACTIVE })
  status: JobStatus

  @Column({ nullable: true })
  salaryMin: number

  @Column({ nullable: true })
  salaryMax: number

  @Column({ nullable: true, default: 'AUD' })
  salaryCurrency: string

  @Column({ nullable: true })
  slots: number

  @Column({ type: 'date', nullable: true })
  deadline: string

  @Column({ nullable: true })
  image: string

  @Column({ type: 'simple-json', nullable: true })
  images: string[]

  @Index()
  @Column({ default: false })
  isHot: boolean

  @Index()
  @Column({ default: false })
  isFeatured: boolean

  @Column({ default: 0 })
  viewCount: number

  @ManyToOne(() => Category, { nullable: true, eager: false })
  @JoinColumn({ name: 'categoryId' })
  category: Category

  @Index()
  @Column({ nullable: true })
  categoryId: string

  // Employer who created this job (null = created by admin)
  @ManyToOne(() => User, { nullable: true, eager: false, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'createdById' })
  createdBy: User

  @Index()
  @Column({ nullable: true })
  createdById: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
