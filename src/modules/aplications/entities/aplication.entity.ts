import { Entity, PrimaryGeneratedColumn, Column, DeleteDateColumn } from 'typeorm';

@Entity()
export class Aplications {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  backend_version: string;

  @Column({ nullable: false })
  frontend_version: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  image: string;

  @Column({ nullable: false })
  description: string;

  @Column({ nullable: false })
  key: string;

  @Column({ type: 'text', nullable: false })
  text: string;

  @Column({ nullable: false })
  licence_type: string;

  @Column({ type: 'int', nullable: false })
  type_id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', default: null, nullable: true })
  deleted_at: Date;
}
