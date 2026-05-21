import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm'
import { User } from '../users/user.entity'

export enum StudyApplicationStatus {
  PENDING = 'pending',
  REVIEWING = 'reviewing',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  WITHDRAWN = 'withdrawn',
}

@Entity('study_applications')
export class StudyApplication {
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

  // Study-specific fields
  @Column({ nullable: true })
  targetCountry: string

  @Column({ nullable: true })
  university: string

  @Column({ nullable: true })
  major: string

  @Column({ nullable: true })
  degreeLevel: string

  @Column({ nullable: true })
  intake: string

  @Column({ nullable: true })
  budget: string

  @Column({ type: 'text', nullable: true })
  adminNote: string

  @Column({ type: 'enum', enum: StudyApplicationStatus, default: StudyApplicationStatus.PENDING })
  status: StudyApplicationStatus

  @ManyToOne(() => User, { nullable: true, eager: false })
  @JoinColumn({ name: 'userId' })
  user: User

  @Column({ nullable: true })
  userId: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
