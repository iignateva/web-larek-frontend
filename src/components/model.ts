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

export class ShoppingCart implements IShoppingCart<IProduct> {
	private _items: Map<IProduct, number> = new Map();

	addItem(item: IProduct) {
    if (!this._items.has(item)) {
      this._items.set(item, 1);
    } else {
      this._items.set(item, this._items.get(item) + 1);
    }
  }

	deleteItem(item: IProduct) {
    if (!this._items.has(item)) { return; }
    else {
      const itemCount = this._items.get(item);
      if (itemCount > 1) {
        this._items.set(item, this._items.get(item) - 1);
      } else {
        this._items.delete(item);
      }
		}
  }

	order() {}

	get items(): Map<IProduct, number> {
		return this._items;
	}

	get totalCount(): number {
		return Array.from(this._items.values()).reduce(
			(sum, curr) => sum + curr,
			0
		);
	}
}
