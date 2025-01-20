import { IProduct, IShoppingCart } from "../../types";
import { EventEmitter } from "../base/events";

export class ShoppingCart implements IShoppingCart<IProduct> {
	private _items: IProduct[] = [];
  protected _events: EventEmitter;

  constructor(events: EventEmitter) {
    this._events = events;
  }

	addItem(item: IProduct) {
		if (!this.getItemsId().includes(item.id)) {
			this._items.push(item);
		}
	}

	private getItemsId(): string[] {
		return this._items.map((item) => item.id);
	}

	deleteItem(itemId: string) {
		if (!this.getItemsId().includes(itemId)) {
			return;
		} else {
			const itemIndex = this.getItemsId().indexOf(itemId);
			this._items.splice(itemIndex, 1);
		}
	}

	get items(): IProduct[] {
		return this._items;
	}

	get totalCount(): number {
		return this._items.length;
	}

	get total(): number {
		if (this._items.length > 0) {
			return this._items
				.map((it) => it.price ?? 0)
				.reduce((totalPrice, itemPrice) => totalPrice + itemPrice);
		} else {
			return 0;
		}
	}
}
