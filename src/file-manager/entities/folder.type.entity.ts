import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { FileEntity } from './file.entity';

@Entity()
export class FolderTypeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 70 })
  folder_name: string;

  @OneToMany(() => FileEntity, (files) => files.folderType)
  files: FileEntity[];

  @Column({ default: true })
  visible: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deleted_at: Date;
}
