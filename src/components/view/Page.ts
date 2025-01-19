import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Catalog, ICatalog } from "./Catalog";
import { CatalogItem, ICatalogItem } from "./CatalogItem";
import { Header, IHeader } from "./Header";


export class Page implements IHeader, ICatalog {
  protected _wrapper: HTMLElement;
	protected _header: IHeader;
	protected _catalog: ICatalog;
	protected _locked: boolean;

	constructor(protected events: IEvents) {
    this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
		this._header = new Header(ensureElement<HTMLElement>('.header__container'), events);
		this._catalog = new Catalog(ensureElement<HTMLElement>('.gallery'));
    this._locked = false;
	}

	set shoppingCartItemCounter(value: number) {
		this._header.shoppingCartItemCounter = value;
	}

	set catalog(items: CatalogItem[]) {
		this._catalog.catalog = items;
	}

	set locked(value: boolean) {
		if (value) {
			this._wrapper.classList.add('page__wrapper_locked');
		} else {
			this._wrapper.classList.remove('page__wrapper_locked');
		}
	}
}