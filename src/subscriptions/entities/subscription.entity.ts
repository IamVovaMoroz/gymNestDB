import { Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'subscriptions' })
export class SubscriptionEntity {
	@PrimaryGeneratedColumn('increment')
	id: number;

	@Column({ type: 'varchar', length: 255, nullable: false })
	description: string;

	@Column({ type: 'boolean', default: true })
	freezing: boolean;

	@Column({ type: 'numeric', precision: 5, scale: 2 })
	price: number;

	@Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
	start_date: Date;

	@Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
	end_date: Date;

	@Column({ type: 'timestamp', nullable: true, default: null })
	days_freezing: Date;
	// need change later - nullable: false!
	@Column({ type: 'varchar', length: 255, nullable: true })
	image: string | null;

	@Column({ type: 'timestamp', nullable: true, default: null })
	expiration_at: Date;

	@Column({ type: 'boolean', default: false })
	discount: boolean;

	@Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
	discount_sum: Date;

	@Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
	discount_date: Date;

	@Column({ type: 'text', nullable: false })
	text: string;

	@Column({ type: 'varchar', length: 255, nullable: false })
	title: string;

	@Column({ type: 'int', nullable: false })
	status_id: number;

	@UpdateDateColumn({ type: 'timestamp' })
	updated_at: Date;

	@DeleteDateColumn({ type: 'timestamp', nullable: false })
	deleted_at: Date;
}
