import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';
import { Catalog } from './Catalog';
import { Header } from './Header';
import { settings } from '../../utils/constants';
import { ICatalogItemView, ICatalogView, IHeader, IPage } from '../../types';

export class Page implements IPage, IHeader, ICatalogView {
	protected _wrapper: HTMLElement;
	protected _header: IHeader;
	protected _catalog: ICatalogView;
	protected _locked: boolean;

	constructor(protected events: IEvents) {
		this._wrapper = ensureElement(settings.page.wrapper);
		this._header = new Header(ensureElement(settings.page.header), events);
		this._catalog = new Catalog(
			ensureElement(settings.page.gallery),
			events,
			ensureElement<HTMLTemplateElement>(settings.gallery.item.template)
		);
		this._locked = false;
	}

	set shoppingCartItemCounter(value: number) {
		this._header.shoppingCartItemCounter = value;
	}

	set catalog(items: ICatalogItemView[]) {
		this._catalog.catalog = items;
	}

	set locked(value: boolean) {
		if (value) {
			this._wrapper.classList.add(settings.wrapper.classes.locked);
		} else {
			this._wrapper.classList.remove(settings.wrapper.classes.locked);
		}
	}
}
