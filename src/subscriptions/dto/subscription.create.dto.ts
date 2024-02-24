import { IsNotEmpty, IsOptional, Length, IsString, IsDate, IsNumber, IsBoolean, IsDefined } from 'class-validator';

export class SubscriptionCreateDto {

	@IsOptional()
	@IsNumber()
	id?: number;

	@IsNotEmpty()
	@IsString()
	@Length(1, 255)
	description: string; // ready!

	@IsOptional()
	@IsBoolean()
	@IsDefined() // not null
	freezing: boolean; // ready!

	@IsNumber()
	price: number; // ready!

	// @IsOptional()
	// @IsDate()
	// start_date: Date;  // ready! created in entity
	// @IsOptional() // убрать
	// @IsDate()
	// end_date: Date;

	@IsOptional() // убрать
	@IsDate()
	days_freezing?: Date | null;

	@IsOptional()
	@IsString()
	image: string | null;

	@IsOptional()
	@IsDate()
	expiration_at?: Date | null;

	@IsBoolean()
	
	discount: boolean;

	@IsOptional() // убрать
	@IsDate()
	discount_sum: Date;

	@IsOptional() // убрать
	@IsDate()
	discount_date: Date;

	@IsNotEmpty()
	@IsString()
	text: string;

	@IsNotEmpty()
	@IsString()
	@Length(1, 255)
	title: string;  // ready!

	@IsNumber()
	status_id: number; // ready!

}
