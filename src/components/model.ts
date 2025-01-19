import { IOrder, IOrderRequest, IProduct, IShoppingCart, PaymentType } from '../types';

export class Order implements IOrder {
	private _items: string[];
	private _total: number = 0;
	payment: PaymentType;
	email: string;
	phone: string;
	address: string;

	constructor(cartTotal: number, cartItems: string[]) {
		this._items = cartItems;
		this._total = cartTotal;
	}

	toOrderRequest(): IOrderRequest {
		return {
			payment: this.payment,
			email: this.email,
			phone: this.phone,
			address: this.address,
			total: this._total,
			items: this._items,
		};
	}
}
