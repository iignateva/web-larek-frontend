import { ICatalogItemView, ItemPrice, ProductCategory } from '../../types';
import { settings } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';

const mapCategoryToCssClassName = new Map<ProductCategory, string>([
	[ProductCategory.SOFT_SKILL, 'soft'],
	[ProductCategory.OTHER, 'other'],
	[ProductCategory.ADDITIONAL, 'additional'],
	[ProductCategory.BUTTON, 'button'],
	[ProductCategory.HARD_SKILL, 'hard'],
]);

export abstract class CatalogItem extends Component<ICatalogItemView> {
	protected _events: IEvents;
	protected _category: HTMLElement;
	protected _title: HTMLElement;
	protected _image: HTMLImageElement;
	protected _price: HTMLElement;
	protected _itemPrice: ItemPrice;
	protected _desc: string;
	id: string;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this._events = events;
		this._category = ensureElement(settings.gallery.item.category, container);
		this._title = ensureElement(settings.gallery.item.title, container);
		this._image = ensureElement<HTMLImageElement>(
			settings.gallery.item.image,
			container
		);
		this._price = ensureElement(settings.gallery.item.price, container);
	}

	set category(category: ProductCategory) {
		this.setText(this._category, category);
		const cssClassName = this.getCategoryCssClassName(category);
		if (cssClassName) {
			this.toggleClass(
				this._category,
				`${settings.gallery.item.classes.categoryPrefix}${cssClassName}`,
				true
			);
		}
	}

	set title(title: string) {
		this.setText(this._title, title);
	}

	get title(): string {
		return this._title.textContent ?? '';
	}

	set image(src: string) {
		this.setImage(this._image, src, this.title);
	}

	set price(price: ItemPrice) {
		this._itemPrice = price;
		if (price == null) {
			this.setText(this._price, settings.priceless);
		} else {
			this.setText(this._price, `${price} ${settings.units}`);
		}
	}

  set description(description: string) {
    this._desc = description;
  }

	private getCategoryCssClassName(
		category: ProductCategory
	): string | undefined {
		return mapCategoryToCssClassName.get(category);
	}
}
