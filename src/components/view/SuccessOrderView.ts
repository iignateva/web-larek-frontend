import { EVENT } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';

export interface ISuccessOrder {
	totalPrice: number;
	orderNumber: string;
}

export class SuccessOrderView extends Component<ISuccessOrder> {
	protected _orderNumber: HTMLElement;
	protected _totalPrice: HTMLElement;
	protected _buttonSuccess: HTMLElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this._orderNumber = ensureElement('.order-success__title', container);
		this._totalPrice = ensureElement('.order-success__description', container);
		this._buttonSuccess = ensureElement('.order-success__close', container);

		events.emit(EVENT.OrderSuccesfullyDone);

		this._buttonSuccess.addEventListener('click', () => {
			events.emit(EVENT.NeedCloseModalView);
		})
	}

	set totalPrice(totalPrice: number) {
		this.setText(this._totalPrice, `списано ${totalPrice} синапсов`);
	}

	set orderNumber(id: string) {
		this.setText(this._orderNumber, `Заказ ${id} оформлен`);
	}
}
