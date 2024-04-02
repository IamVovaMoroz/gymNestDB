import { Entity, PrimaryGeneratedColumn, Column, DeleteDateColumn } from 'typeorm';

@Entity()
export class Roles {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: false })
  value: string;

  @Column({ type: 'boolean', default: true })
  visible: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', default: null, nullable: true })
  deleted_at: Date;
}
