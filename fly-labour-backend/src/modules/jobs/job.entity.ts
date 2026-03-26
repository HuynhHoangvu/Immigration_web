import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm'
import { Category } from '../categories/category.entity'

export enum JobType { FULL_TIME = 'full_time', PART_TIME = 'part_time', CONTRACT = 'contract', SEASONAL = 'seasonal' }
export enum JobStatus { ACTIVE = 'active', PAUSED = 'paused', CLOSED = 'closed', DRAFT = 'draft' }

@Entity('jobs')
export class Job {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  title: string

  @Column({ type: 'text' })
  description: string

  @Column({ type: 'text', nullable: true })
  requirements: string

  @Column({ type: 'text', nullable: true })
  benefits: string

  @Column({ nullable: true })
  company: string

  @Column({ nullable: true })
  location: string

  @Column({ type: 'varchar', length: 100 })
  country: string

  @Column({ type: 'enum', enum: JobType, default: JobType.FULL_TIME })
  jobType: JobType

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

  @Column({ default: false })
  isHot: boolean

  @Column({ default: false })
  isFeatured: boolean

  @Column({ default: 0 })
  viewCount: number

  @ManyToOne(() => Category, { nullable: true, eager: true })
  @JoinColumn({ name: 'categoryId' })
  category: Category

  @Column({ nullable: true })
  categoryId: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
