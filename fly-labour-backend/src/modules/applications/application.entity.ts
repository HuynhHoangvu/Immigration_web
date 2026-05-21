import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm'
import { User } from '../users/user.entity'
import { Job } from '../jobs/job.entity'

export enum ApplicationStatus {
  PENDING = 'pending',
  REVIEWING = 'reviewing',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  WITHDRAWN = 'withdrawn',
}

@Entity('applications')
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  fullName: string

  @Column()
  email: string

  @Column()
  phone: string

  @Column({ type: 'date', nullable: true })
  dateOfBirth: string

  @Column({ nullable: true })
  address: string

  @Column({ nullable: true })
  education: string

  @Column({ nullable: true })
  experience: string

  @Column({ nullable: true })
  languageLevel: string

  @Column({ nullable: true })
  cvUrl: string

  @Column({ type: 'text', nullable: true })
  coverLetter: string

  @Column({ type: 'text', nullable: true })
  adminNote: string

  @Column({ type: 'text', nullable: true })
  employerNote: string

  @Column({ type: 'enum', enum: ApplicationStatus, default: ApplicationStatus.PENDING })
  status: ApplicationStatus

  @ManyToOne(() => User, { nullable: true, eager: false })
  @JoinColumn({ name: 'userId' })
  user: User

  @Column({ nullable: true })
  userId: string

  @ManyToOne(() => Job, { eager: false })
  @JoinColumn({ name: 'jobId' })
  job: Job

  @Column()
  jobId: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
