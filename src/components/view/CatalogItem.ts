import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

export interface ICatalogItem {
	category: string;
	title: string;
  text: string;
	image: string;
	price: number | null;
}

const mapCategoryToCssClassName = new Map<string, string>([
        ['софт-скил', 'soft'],
        ['другое', 'other'],
        ['дополнительное', 'additional'],
        ['кнопка', 'button'],
        ['хард-скил', 'hard']
    ]);

export type ItemEventListener = { 
  evt: string, 
  handler: (evt: Event) => void 
}


export class CatalogItem extends Component<ICatalogItem> {
	protected _category: HTMLElement;
	protected _title: HTMLElement;
	protected _image: HTMLImageElement;
	protected _price: HTMLElement;

	constructor(container: HTMLElement, eventListener?: ItemEventListener) {
		super(container);

		this._category = ensureElement<HTMLElement>('.card__category', container);
		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._image = ensureElement<HTMLImageElement>('.card__image', container);
		this._price = ensureElement<HTMLElement>('.card__price', container);

		if (eventListener) {
			this.container.addEventListener(eventListener.evt, eventListener.handler);
		}
	}

	set category(category: string) {
		this.setText(this._category, category);
		this.toggleClass(
			this._category,
			`card__category_${this.getCategoryCssClassName(category)}`,
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
			this.setText(this._price, 'Бесценно');
		} else {
			this.setText(this._price, `${price} синапсов`);
		}
	}

	fill(data?: Partial<ICatalogItem>): CatalogItem {
		Object.assign(this as object, data ?? {});
		return this;
	}

	getCategoryCssClassName(category: string): string {
		return mapCategoryToCssClassName.get(category);
	}
}

export class CatalogItemPreview extends CatalogItem {
	protected _text: HTMLElement;

	constructor(container: HTMLElement) {
    super(container);
    this._text = ensureElement<HTMLElement>('.card__text', container);
  };

  set text(description: string) {
    super.setText(this._text, description);
  }
}