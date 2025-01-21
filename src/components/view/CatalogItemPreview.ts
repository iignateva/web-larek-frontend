import { ProductCategory } from "../../types";
import { EVENT, settings } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { CatalogItemView } from "./CatalogItemView";

export interface ICatalogItemPreview {
	inShoppingCart: boolean;
}

export class CatalogItemPreview
	extends CatalogItemView
	implements ICatalogItemPreview
{
	protected _text: HTMLElement;
	protected _toShoppingCartButton: HTMLElement;
	protected _isInShoppingCart: boolean;
	protected _events: IEvents;

	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);
		this._events = events;
		this._text = ensureElement(settings.gallery.item.text, container);
		this._toShoppingCartButton = ensureElement(
			settings.gallery.item.buttonToShoppingCart,
			container
		);

		this._toShoppingCartButton.addEventListener('click', () => {
			if (this._isInShoppingCart) {
				this._events.emit(EVENT.CatalogItemDeleteFromShoppingCart, {
					id: this.id,
				});
				this._events.emit(EVENT.CatalogItemDeleted);
			} else {
				this._events.emit(EVENT.CatalogItemAddToShoppingCart, { id: this.id });
				this._events.emit(EVENT.CatalogItemAdded);
			}
		});
	}

	set text(description: string) {
		super.setText(this._text, description);
	}

	set category(category: ProductCategory) {
		for (let [, value] of this._category.classList.entries()) {
			if (
				value !== category &&
				value.startsWith(settings.gallery.item.classes.categoryPrefix)
			) {
				this._category.classList.remove(value);
			}
		}
		super.category = category;
	}

	set inShoppingCart(isInShoppingCart: boolean) {
		this._isInShoppingCart = isInShoppingCart;

		if (this._isInShoppingCart) {
			this.setText(this._toShoppingCartButton, settings.deleteFromShoppingCart);
		} else {
			this.setText(this._toShoppingCartButton, settings.addToShoppingCart);
		}
	}
}
