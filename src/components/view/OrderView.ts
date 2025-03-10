import { PaymentType, IDeliveryDataView } from '../../types';
import { EVENT, settings } from '../../utils/constants';
import { ensureElement, joinStringElements } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';

export class OrderView extends Component<IDeliveryDataView> {
	protected _address: HTMLInputElement;
	protected _payOnline: HTMLElement;
	protected _payOnReceiving: HTMLElement;
	protected _submitButton: HTMLElement;
	protected _formError: HTMLElement;
	protected _events: IEvents;
	private _selectedPaymentType: PaymentType | null;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this._events = events;
		this._address = ensureElement<HTMLInputElement>(
			settings.order.address,
			container
		);
		this._payOnline = ensureElement(settings.order.payment.online, container);
		this._payOnReceiving = ensureElement(
			settings.order.payment.onReceiving,
			container
		);
		this._submitButton = ensureElement(settings.order.buttonToOrder, container);
		this._formError = ensureElement(settings.order.formErrors, container);

		this._payOnline.addEventListener('click', () => {
			this.paymentType = PaymentType.ONLINE;
			this.emitDataChangedEvent();
		});

		this._payOnReceiving.addEventListener('click', () => {
			this.paymentType = PaymentType.ON_RECEIVING;
			this.emitDataChangedEvent();
		});

		this._address.addEventListener('input', (evt) => {
			evt.preventDefault();
			this.emitDataChangedEvent();
		});

		this.container.addEventListener('submit', () => {
			this._events.emit(EVENT.OrderDeliveryDataReady, {
				address: this._address.value,
				payment: this._selectedPaymentType,
			});
		});
	}

	set errorMessages(errorMsg: string[]) {
		if (errorMsg && errorMsg.length > 0) {
			this._formError.replaceChildren(joinStringElements(errorMsg));
			this.setVisible(this._formError);
			this.setDisabled(this._submitButton, true);
		} else {
			this.setHidden(this._formError);
			this.setText(this._formError, '');
			this.setDisabled(this._submitButton, false);
		}
	}

	set address(address: string) {
		this._address.value = address ?? '';
	}

	set paymentType(paymentType: PaymentType) {
		this._selectedPaymentType = paymentType;
		this.toggleClass(
			this._payOnline,
			settings.order.classes.buttonActive,
			paymentType === PaymentType.ONLINE
		);
		this.toggleClass(
			this._payOnReceiving,
			settings.order.classes.buttonActive,
			paymentType === PaymentType.ON_RECEIVING
		);
	}

	emitDataChangedEvent() {
		this._events.emit(EVENT.OrderDeliveryDataChanged, {
			paymentType: this._selectedPaymentType,
			address: this._address.value,
		});
	}
}
