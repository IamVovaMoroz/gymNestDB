import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn, DeleteDateColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class AuthEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  userEmail: string;

  @Column()
  accessToken: string;

  @Column({ nullable: true })
  refreshToken: string | null;

  @Column({ nullable: true })
  actionToken: string | null;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deleted_at: Date;
}
