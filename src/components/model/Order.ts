import {
	IDeliveryDataView,
	IOrder,
	OrderDataOnCheck,
	PaymentType,
} from '../../types';
import { EVENT, settings } from '../../utils/constants';
import { isEmpty } from '../../utils/utils';
import { Model } from '../base/Model';
import { IEvents } from '../base/events';

export class Order extends Model<IOrder> {
	protected _payment: PaymentType | null;
	protected _address: string;
	protected _email: string;
	protected _phone: string;

	constructor(events: IEvents) {
		super({}, events);
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

	set email(email: string) {
		this._email = email;
		this.checkContactsData();
	}

	get email() {
		return this._email;
	}

	set phone(phone: string) {
		this._phone = phone;
		this.checkContactsData();
	}

	get phone() {
		return this._phone;
	}

	clear() {
		this._address = '';
		this._email = '';
		this._payment = null;
		this._phone = '';
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

	checkContactsData() {
		this.checkDataFilled({
			event: EVENT.OrderContactsDataChecked,
			fields: [
				{ field: this.email, errorMsg: settings.orderEmailDataErrorMsg },
				{ field: this.phone, errorMsg: settings.orderPhoneDataErrorMsg },
			],
		});
	}

	private checkDataFilled(data: OrderDataOnCheck) {
		const errorMessages: string[] = [];
		data.fields.forEach(({ field, errorMsg }) => {
			if (isEmpty(field) || field.trim() === '') {
				errorMessages.push(errorMsg);
			}
		});

		this.events.emit<Partial<IDeliveryDataView>>(data.event, {
			errorMessages: errorMessages,
		});
	}
}
