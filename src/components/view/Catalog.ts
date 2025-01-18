import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { CatalogItem } from './CatalogItem';

export interface ICatalog {
	catalog: CatalogItem[];
}

export class Catalog extends Component<ICatalog> {

	constructor(container: HTMLElement) {
		super(container);
	}

	set catalog(items: CatalogItem[]) {
		const itemsEls: HTMLElement[] = items.map(item => item.render())
		this.container.replaceChildren(...itemsEls);
	}
}
