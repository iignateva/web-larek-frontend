import { PaymentType } from '../../types';
import { EVENT } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';

export interface IOrderView {
	total: number;
	items: string[];
}

export class OrderView extends Component<IOrderView> {
	protected _address: HTMLInputElement;
	protected _payOnline: HTMLElement;
	protected _payOnReceiving: HTMLElement;
	protected _submitButton: HTMLElement;
	protected _formError: HTMLElement;
	protected _events: IEvents;
	private _selectedPaymentType: PaymentType;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this._events = events;

		this._address = ensureElement<HTMLInputElement>('.form__input', container);
		this._payOnline = ensureElement('#paymentTypeCard', container);
		this._payOnReceiving = ensureElement('#paymentTypeCash', container);
		this._submitButton = ensureElement('.order__button', container);
		this._formError = ensureElement('.form__errors', container);

		this._payOnline.addEventListener('click', () => {
			this.setPaymentType(PaymentType.ONLINE);
		});

		this._payOnReceiving.addEventListener('click', () => {
			this.setPaymentType(PaymentType.ON_RECEIVING);
		});

		this._address.addEventListener('input', (evt) => {
			evt.preventDefault();
			const isValid = this.isValid(this._formError, this._address);

			if (isValid) {
				this.setDisabled(this._submitButton, false);
			} else {
				this.setDisabled(this._submitButton, true);
			}
		});

		this.container.addEventListener('submit', () => {
			this.isValid(this._formError, this._address);
			this._events.emit(EVENT.OrderDeliveryDataReady, {
				address: this._address.value,
				payment: this._selectedPaymentType,
			});
		});
	}

	private setPaymentType(paymentType: PaymentType) {
		this._selectedPaymentType = paymentType;
		this.toggleClass(
			this._payOnline,
			'button_alt-active',
			paymentType === PaymentType.ONLINE
		);
		this.toggleClass(
			this._payOnReceiving,
			'button_alt-active',
			paymentType === PaymentType.ON_RECEIVING
		);
	}

}
