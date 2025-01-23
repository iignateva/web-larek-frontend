import { EVENT } from '../../utils/constants';
import { CatalogItem } from './CatalogItem';
import { IEvents } from '../base/events';
 
export class CatalogItemView extends CatalogItem {

	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);

		this.container.addEventListener('click', () => {
			this._events.emit(EVENT.CatalogItemPreviewOpening, {
				id: this.id,
				category: this._category.textContent,
				title: this._title.textContent,
				image: this._image.src,
				description: this._desc,
				price: this._itemPrice
			});
		});
	}
}
