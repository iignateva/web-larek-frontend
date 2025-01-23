import { IHeader } from "../../types";
import { EVENT, settings } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";

export class HeaderView extends Component<IHeader> {
	protected _shoppingCartButton: HTMLElement;
	protected _shoppingCartItemCounter: HTMLElement;
  
	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this._shoppingCartButton = ensureElement(settings.header.shoppingCart.button, container);
		this._shoppingCartItemCounter = ensureElement(settings.header.shoppingCart.counter, container);

		this._shoppingCartButton.addEventListener('click', () => {
			events.emit(EVENT.ShoppingCartOpening);
		})
	}

	set shoppingCartItemCounter(count: number) {
		this.setText(this._shoppingCartItemCounter, count);
	}
}