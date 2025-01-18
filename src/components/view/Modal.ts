import { EVENT } from "../../utils/constants";
import { ensureElement } from "../../utils/utils"
import { Component } from "../base/Component"
import { IEvents } from "../base/events";

export interface IModal {
  content: HTMLElement
}


function handleClickOnModal(evt: PointerEvent) {
	if ((evt.target as Element).classList.contains('modal')) {
    if (this instanceof Modal) {
		  this.close();
    }
	}
};

export class Modal extends Component<IModal> {
	protected _closeButton: HTMLElement;
	protected _content: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._closeButton = ensureElement<HTMLButtonElement>(
			'.modal__close',
			container
		);
		this._content = ensureElement<HTMLElement>('.modal__content', container);

		this._closeButton.addEventListener('click', this.close.bind(this));
		this.container.addEventListener('click', handleClickOnModal.bind(this));
		this._content.addEventListener('click', (event) => event.stopPropagation());
	}

	set content(value: HTMLElement) {
		this._content.replaceChildren(value);
	}

	open() {
		this.container.classList.add('modal_active');
		this.events.emit(EVENT.ModalOpen);
	}

	close() {
		this.container.classList.remove('modal_active');
		this.content = null;
		this.events.emit(EVENT.ModalClose);
	}

	render(data: IModal): HTMLElement {
		super.render(data);
		this.open();
		return this.container;
	}
}
