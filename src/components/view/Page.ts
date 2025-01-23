import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';
import { settings } from '../../utils/constants';
import { IPage } from '../../types';

export class Page implements IPage {
	protected _wrapper: HTMLElement;
	protected _catalog: HTMLElement;
	protected _locked: boolean;

	constructor(protected events: IEvents) {
		this._wrapper = ensureElement(settings.page.wrapper);
		this._catalog = ensureElement(settings.page.gallery);
		this._locked = false;
	}

	set catalog(items: HTMLElement[]) {
		this._catalog.replaceChildren(...items);
	}

	set locked(value: boolean) {
		if (value) {
			this._wrapper.classList.add(settings.wrapper.classes.locked);
		} else {
			this._wrapper.classList.remove(settings.wrapper.classes.locked);
		}
	}
}
