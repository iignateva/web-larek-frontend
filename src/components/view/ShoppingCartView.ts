import { IShoppingCartItem, IShoppingCartView, ItemPrice } from '../../types';
import { EVENT, settings } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';

export class ShoppingCartView extends Component<IShoppingCartView> {
	protected _shoppingCartList: HTMLElement;
	protected _shoppingCartPrice: HTMLElement;
	protected _orderButton: HTMLElement;
	protected _events: IEvents;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this._events = events;
		this._shoppingCartList = ensureElement(
			settings.shoppingCart.list,
			container
		);
		this._shoppingCartPrice = ensureElement(
			settings.shoppingCart.price,
			container
		);
		this._orderButton = ensureElement(
			settings.shoppingCart.buttonToOrder,
			container
		);

		this._orderButton.addEventListener('click', () => {
			this._events.emit(EVENT.ShoppingCartCreateOrder);
		});
	}

	set total(totalPrice: ItemPrice) {
		this.setText(this._shoppingCartPrice, `${totalPrice} ${settings.units}`);
		if (totalPrice === 0) {
			this.setDisabled(this._orderButton, true);
		} else {
			this.setDisabled(this._orderButton, false);
		}
	}

	set items(items: HTMLElement[]) {
		this._shoppingCartList.replaceChildren(...items);
	}
}

export class ShoppingCartItem extends Component<IShoppingCartItem> {
	protected _itemIndex: HTMLElement;
	protected _itemTitle: HTMLElement;
	protected _itemPrice: HTMLElement;
	protected _deleteButton: HTMLElement;
	protected _itemId: string;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);

		this._itemIndex = ensureElement(
			settings.shoppingCart.item.index,
			container
		);
		this._itemTitle = ensureElement(
			settings.shoppingCart.item.title,
			container
		);
		this._itemPrice = ensureElement(
			settings.shoppingCart.item.price,
			container
		);
		this._deleteButton = ensureElement(
			settings.shoppingCart.item.deleteButton,
			container
		);

		this._deleteButton.addEventListener('click', (evt) => {
			events.emit(EVENT.ShoppingCartItemDelete, { id: this._itemId });
		});
	}

	set itemId(id: string) {
		this._itemId = id;
	}

	set index(index: number) {
		this.setText(this._itemIndex, index);
	}

	set title(title: string) {
		this.setText(this._itemTitle, title);
	}

	set price(price: number | null) {
		if (price == null) {
			this.setText(this._itemPrice, settings.priceless);
		} else {
			this.setText(this._itemPrice, `${price} ${settings.units}`);
		}
	}
}
