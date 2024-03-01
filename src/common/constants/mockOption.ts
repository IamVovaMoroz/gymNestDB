import { OptionEntity } from '../../options/entities/option.entity';
import { OptionUpdateDto } from '../../options/dto/option.update.dto';
import { OptionCreateDto } from '../../options/dto/option.create.dto';


export const MockOptionDto: OptionCreateDto = {
	key: 'example key option',
	value: 'example value',
	visible: true,
	created_at: new Date(),

};


export const MockExpectedResultOfOption: OptionEntity = {
	id: 1,
	...MockOptionDto,
	autoload: true,
	visible: true,
	value: 'example value 70',
	created_at: new Date(),
	updated_at: new Date(),
	deleted_at: null,
};

export const mockUpdateOptionDto: OptionUpdateDto = {
	value: 'New Type Value 70',
	visible: false,
};
