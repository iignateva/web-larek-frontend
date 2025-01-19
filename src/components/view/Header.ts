import { EVENT } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";


export interface IHeader {
	shoppingCartItemCounter: number;
}

export class Header extends Component<IHeader> {
	protected _shoppingCartButton: HTMLElement;
	protected _shoppingCartItemCounter: HTMLElement;
  
	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this._shoppingCartButton = ensureElement('.header__basket', container);
		this._shoppingCartItemCounter = ensureElement('.header__basket-counter', container);

		this._shoppingCartButton.addEventListener('click', () => {
			events.emit(EVENT.ShoppingCartChanged);
		})
	}

	set shoppingCartItemCounter(count: number) {
		this.setText(this._shoppingCartItemCounter, count);
	}

}