import { IOrder, PaymentType } from '../../types';
import { Model } from '../base/Model';
import { IEvents } from '../base/events';

export class Order extends Model<IOrder> {
	items: string[];
	total: number;
	payment?: PaymentType;
	email?: string;
	phone?: string;
	address?: string;

	constructor(events: IEvents) {
		super({ items: [], total: 0 }, events);
	}
}
