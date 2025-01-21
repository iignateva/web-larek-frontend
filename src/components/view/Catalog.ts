import { ICatalogItemView, ICatalogView } from '../../types';
import { cloneTemplate } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';
import { CatalogItemView } from './CatalogItemView';

export class Catalog extends Component<ICatalogView> {
protected _itemTemplate: HTMLTemplateElement;
protected _events: IEvents;

	constructor(container: HTMLElement, events: IEvents, itemTemplate: HTMLTemplateElement) {
		super(container);
		this._events = events;
		this._itemTemplate = itemTemplate;
	}

	set catalog(items: ICatalogItemView[]) {
		const itemsEls: HTMLElement[] = items.map(item => {
			const templateProduct = cloneTemplate(this._itemTemplate);
			return new CatalogItemView(templateProduct, this._events).render(item);
		});
		this.container.replaceChildren(...itemsEls);
	}
}
