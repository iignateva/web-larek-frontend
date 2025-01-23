import { ProductCategory } from '../../types';
import { EVENT, settings } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';
import { CatalogItem } from './CatalogItem';

export class CatalogItemPreview extends CatalogItem {
	protected _description: HTMLElement;
	protected _toShoppingCartButton: HTMLElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);
		this._description = ensureElement(settings.gallery.item.text, container);
		this._toShoppingCartButton = ensureElement(
			settings.gallery.item.buttonToShoppingCart,
			container
		);

		this._toShoppingCartButton.addEventListener('click', () => {
			this._events.emit(EVENT.CatalogItemToShoppingCartClicked, {
				id: this.id,
				category: this._category.textContent,
				title: this._title.textContent,
				image: this._image.src,
				description: this._description.textContent,
				price: this._itemPrice,
			});
		});
	}

	set description(description: string) {
		this.setText(this._description, description);
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
		if (isInShoppingCart) {
			this.setText(this._toShoppingCartButton, settings.deleteFromShoppingCart);
		} else {
			this.setText(this._toShoppingCartButton, settings.addToShoppingCart);
		}
	}
}
