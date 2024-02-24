import { Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'options' })
export class OptionEntity {
	@PrimaryGeneratedColumn('increment')
	id: number;

	@Column({ default: true })
	autoload: boolean;

	@Column({ length: 70, nullable: false, type: 'varchar' })
	key: string;

	@Column({ default: null })
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