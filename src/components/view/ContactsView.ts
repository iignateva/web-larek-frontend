import { EVENT } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';

export interface IContacts {
	email: string;
	phone: string;
}

export class ContactsView extends Component<IContacts> {
	protected _events: IEvents;
	protected _email: HTMLInputElement;
	protected _phone: HTMLInputElement;
	protected _formError: HTMLElement;
	protected _submitButton: HTMLElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this._events = events;

		this._email = ensureElement<HTMLInputElement>('#email', container);
		this._phone = ensureElement<HTMLInputElement>('#phone', container);
		this._formError = ensureElement('.form__errors', container);
    this._submitButton = ensureElement('#submit_button', container);

		this._email.addEventListener('input', (evt) => {
			evt.preventDefault();
			this.checkForm();
		});

		this._phone.addEventListener('input', (evt) => {
			evt.preventDefault();
			this.checkForm();
		});

		this.container.addEventListener('submit', (evt) => {
			evt.preventDefault();
			this.checkForm();
      events.emit(EVENT.OrderDataReady, {
        email: this._email.value, 
        phone: this._phone.value
      });
		});
	}

	private checkForm() {
		const isValid = this.isValid(this._formError, this._email, this._phone);

		if (isValid) {
			this.setDisabled(this._submitButton, false);
		} else {
			this.setDisabled(this._submitButton, true);
		}
	}
}
