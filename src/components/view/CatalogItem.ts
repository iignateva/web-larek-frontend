import { EVENT } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { EventEmitter } from "../base/events";

export interface ICatalogItem {
  id: string;
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
    const cssClassName = this.getCategoryCssClassName(category);
		this.toggleClass(this._category, `card__category_${cssClassName}`, true);
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

	private getCategoryCssClassName(category: string): string {
		return mapCategoryToCssClassName.get(category);
	}
}

export class CatalogItemPreview extends CatalogItem {
  protected _id: string;
	protected _text: HTMLElement;
  protected _toShoppingCartButton: HTMLElement;
  protected _isInShoppingCart: boolean;
  protected _events: EventEmitter;

	constructor(container: HTMLElement, events: EventEmitter) {
    super(container);
    this._events = events;
    this._text = ensureElement('.card__text', container);
    this._toShoppingCartButton = ensureElement('.card__button', container);

    this._toShoppingCartButton.addEventListener('click', () => {
      if (this._isInShoppingCart) {
        this._events.emit(EVENT.CatalogItemDeleteFromShoppingCart, {id: this._id});
        this._events.emit(EVENT.CatalogItemDeleted);
      } else {
        this._events.emit(EVENT.CatalogItemAddToShoppingCart, { id: this._id });
        this._events.emit(EVENT.CatalogItemAdded);
      }
    })
  };

  set id(id:string) {
    this._id = id;
  }

  set text(description: string) {
    super.setText(this._text, description);
  }

  set category(category: string) {
		for (let [key, value] of this._category.classList.entries()) {
      if (value !== category && value.startsWith('card__category_')) {
				this._category.classList.remove(value);
			}
		}
    super.category = category;
  }

  set inShoppingCart(isInShoppingCart: boolean) {
    this._isInShoppingCart = isInShoppingCart;

    if (this._isInShoppingCart) {
			this.setText(this._toShoppingCartButton, 'Удалить из корзины');
		} else {
			this.setText(this._toShoppingCartButton, 'В корзину');
		}
  }
}