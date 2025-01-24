import {
	IDeliveryDataView,
	IOrder,
	OrderDataOnCheck,
	PaymentType,
} from '../../types';
import { EVENT, settings } from '../../utils/constants';
import { Model } from '../base/Model';
import { IEvents } from '../base/events';

export class Order extends Model<IOrder> {
	protected _payment: PaymentType;
	protected _address: string;
	items: string[];
	total: number;
	email?: string;
	phone?: string;

	constructor(events: IEvents) {
		super({ items: [], total: 0 }, events);
	}

	set address(address: string) {
		this._address = address;
		this.checkDeliveryData();
	}

	get address() {
		return this._address;
	}

	set payment(paymentType: PaymentType) {
		this._payment = paymentType;
		this.checkDeliveryData();
	}

	get payment() {
		return this._payment;
	}

	checkDeliveryData() {
		this.checkDataFilled({
			event: EVENT.OrderDeliveryDataChecked,
			fields: [
				{ field: this.address, errorMsg: settings.orderAddressDataErrorMsg },
				{ field: this.payment, errorMsg: settings.orderPaymentDataErrorMsg },
			],
		});
	}

	private checkDataFilled(data: OrderDataOnCheck) {
		const errorMessages: string[] = [];
		data.fields.forEach(({ field, errorMsg }) => {
			if (!field || field === null || field.trim() === '') {
				errorMessages.push(errorMsg);
			}
		});

		this.events.emit<Partial<IDeliveryDataView>>(data.event, {
			errorMessages: errorMessages,
		});
	}
}
