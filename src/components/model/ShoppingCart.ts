import { IProduct, IShoppingCart } from '../../types';
import { EVENT } from '../../utils/constants';
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
		this.events.emit(EVENT.ShoppingCartCountChanged);
	}

	deleteItem(itemId: string) {
		if (!this.getItemsId().includes(itemId)) {
			return;
		} else {
			const itemIndex = this.getItemsId().indexOf(itemId);
			this._items.splice(itemIndex, 1);
			this.events.emit(EVENT.ShoppingCartCountChanged);
		}
	}

	private getItemsId(): string[] {
		return this._items.map((item) => item.id);
	}

	contains(itemId: string): boolean {
		return this._items.findIndex((it) => it.id === itemId) >= 0;
	}

	clear() {
		this._items = [];
		this.events.emit(EVENT.ShoppingCartCountChanged);
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
