import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';
import { FolderTypeEntity } from './folder.type.entity';

@Entity()
export class FileEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 77, nullable: false })
  name: string;

  @ManyToOne(() => FolderTypeEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'folder_id' })
  folderType: FolderTypeEntity;

  @Column({ default: true })
  visible: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deleted_at: Date;
}
