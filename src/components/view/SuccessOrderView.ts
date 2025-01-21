import { EVENT, settings } from '../../utils/constants';
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
		this._orderNumber = ensureElement(settings.order.success.title, container);
		this._totalPrice = ensureElement(settings.order.success.desc, container);
		this._buttonSuccess = ensureElement(settings.order.success.closeButton, container);

		events.emit(EVENT.OrderSuccesfullyDone);

		this._buttonSuccess.addEventListener('click', () => {
			events.emit(EVENT.NeedCloseModalView);
		})
	}

	set totalPrice(totalPrice: number) {
		this.setText(this._totalPrice, `списано ${totalPrice} ${settings.units}`);
	}

	set orderNumber(id: string) {
		this.setText(this._orderNumber, `Заказ ${id} оформлен`);
	}
}
