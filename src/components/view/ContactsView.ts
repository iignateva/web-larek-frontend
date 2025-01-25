import { IContactsDataView } from '../../types';
import { EVENT, settings } from '../../utils/constants';
import { ensureElement, joinStringElements } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';

export class ContactsView extends Component<IContactsDataView> {
	protected _events: IEvents;
	protected _email: HTMLInputElement;
	protected _phone: HTMLInputElement;
	protected _formError: HTMLElement;
	protected _submitButton: HTMLElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this._events = events;

		this._email = ensureElement<HTMLInputElement>(
			settings.order.email,
			container
		);
		this._phone = ensureElement<HTMLInputElement>(
			settings.order.phone,
			container
		);
		this._formError = ensureElement(settings.order.formErrors, container);
		this._submitButton = ensureElement(settings.order.submitButton, container);

		this._email.addEventListener('input', (evt) => {
			evt.preventDefault();
			this.emitDataChangedEvent();
		});

		this._phone.addEventListener('input', (evt) => {
			evt.preventDefault();
			this.emitDataChangedEvent();
		});

		this.container.addEventListener('submit', (evt) => {
			evt.preventDefault();
			events.emit(EVENT.OrderDataReady, {
				email: this._email.value,
				phone: this._phone.value,
			});
		});
	}

	set email(email: string) {
		this._email.value = email ?? '';
	}

	set phone(phone: string) {
		this._phone.value = phone ?? '';
	}

	set errorMessages(errorMsg: string[]) {
		if (errorMsg && errorMsg.length > 0) {
			this.setVisible(this._formError);
			this._formError.replaceChildren(joinStringElements(errorMsg));
			this.setDisabled(this._submitButton, true);
		} else {
			this.setHidden(this._formError);
			this.setText(this._formError, '');
			this.setDisabled(this._submitButton, false);
		}
	}

	emitDataChangedEvent() {
		this._events.emit(EVENT.OrderContactsDataChanged, {
			email: this._email.value,
			phone: this._phone.value,
		});
	}
}
