import { IProduct, IShoppingCart } from '../../types';
import { Model } from '../base/Model';
import { IEvents } from '../base/events';

export class ShoppingCart extends Model<IShoppingCart<IProduct>> {
	private _items: IProduct[] = [];

	constructor(events: IEvents) {
		super({}, events);
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

	clear() {
		this._items = [];
	}

	get items(): IProduct[] {
		return this._items ?? [];
	}

	get itemIds(): string[] {
		return this._items.filter((it) => it.price !== null).map((it) => it.id);
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
