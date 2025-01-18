import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";


export interface IHeader {
	shoppingCartItemCounter: number;
}

export class Header extends Component<IHeader> {
	protected _shoppingCartItemCounter: HTMLElement;
  
	constructor(container: HTMLElement) {
		super(container);

		this._shoppingCartItemCounter = ensureElement('.header__basket-counter');
	}

	set shoppingCartItemCounter(count: number) {
		this.setText(this._shoppingCartItemCounter, count);
	}

}