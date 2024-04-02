import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'status' })
export class StatusEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ length: 70, nullable: false, type: 'varchar' })
  value: string;

  @Column({ default: true })
  visible: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleted_at: Date;
}
