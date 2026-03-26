import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'

@Entity('contacts')
export class Contact {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column()
  email: string

  @Column({ nullable: true })
  phone: string

  @Column({ type: 'text' })
  message: string

  @Column({ default: false })
  isRead: boolean

  @CreateDateColumn()
  createdAt: Date
}
