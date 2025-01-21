import { ProductCategory } from "../../types";
import { EVENT, settings } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";

export interface ICatalogItemView {
  id: string;
	category: ProductCategory;
	title: string;
	image: string;
	text: string;
	price: number | null;
}

const mapCategoryToCssClassName = new Map<ProductCategory, string>([
        [ProductCategory.SOFT_SKILL, 'soft'],
        [ProductCategory.OTHER, 'other'],
        [ProductCategory.ADDITIONAL, 'additional'],
        [ProductCategory.BUTTON, 'button'],
        [ProductCategory.HARD_SKILL, 'hard']
    ]);

export class CatalogItemView extends Component<ICatalogItemView> {
	protected _events: IEvents;
	protected _category: HTMLElement;
	protected _title: HTMLElement;
	protected _image: HTMLImageElement;
	protected _price: HTMLElement;
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

		this.container.addEventListener('click', () => {
			this._events.emit(EVENT.CatalogItemPreviewOpening, {id: this.id});
		});
	}

	set category(category: ProductCategory) {
		this.setText(this._category, category);
		const cssClassName = this.getCategoryCssClassName(category);
		this.toggleClass(
			this._category,
			`${settings.gallery.item.classes.categoryPrefix}${cssClassName}`,
			true
		);
	}

	set title(title: string) {
		this.setText(this._title, title);
	}

	get title(): string {
		return this._title.textContent || '';
	}

	set image(src: string) {
		this.setImage(this._image, src, this.title);
	}

	set price(price: number | null) {
		if (price == null) {
			this.setText(this._price, settings.priceless);
		} else {
			this.setText(this._price, `${price} ${settings.units}`);
		}
	}

	fill(data?: Partial<ICatalogItemView>): CatalogItemView {
		Object.assign(this as object, data ?? {});
		return this;
	}

	private getCategoryCssClassName(category: ProductCategory): string {
		return mapCategoryToCssClassName.get(category);
	}
}