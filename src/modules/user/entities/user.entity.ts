import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: false })
  first_name: string;

  @Column({ nullable: false })
  last_name: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ default: null, nullable: true })
  email_verified_at: Date | null;

  @Column({ nullable: false, select: false })
  password: string;

  @Column({ nullable: true })
  remember_token: string | null;

  @Column({ nullable: true })
  photo: string | null;

  @Column({ nullable: false })
  phone: string;

  @Column({ default: true })
  visible: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deleted_at: Date;
}
