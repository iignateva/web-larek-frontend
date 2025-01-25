export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const settings = {
	page: {
		wrapper: '.page__wrapper',
		header: '.header__container',
		gallery: '.gallery',
	},
	wrapper: {
		classes: {
			locked: 'page__wrapper_locked',
		},
	},
	header: {
		shoppingCart: {
			button: '.header__basket',
			counter: '.header__basket-counter',
		},
	},
	gallery: {
		item: {
			template: '#card-catalog',
			category: '.card__category',
			title: '.card__title',
			image: '.card__image',
			price: '.card__price',
			text: '.card__text',
			buttonToShoppingCart: '.card__button',
			classes: {
				categoryPrefix: 'card__category_',
			},
			preview: {
				template: '#card-preview',
			},
		},
	},
	order: {
		contacts: {
			template: '#contacts',
		},
		template: '#order',
		email: '#email',
		phone: '#phone',
		formErrors: '.form__errors',
		submitButton: '#submit_button',
		address: '.form__input',
		payment: {
			online: '#paymentTypeCard',
			onReceiving: '#paymentTypeCash',
		},
		buttonToOrder: '.order__button',
		classes: {
			buttonActive: 'button_alt-active',
		},
		success: {
			template: '#success',
			title: '.order-success__title',
			desc: '.order-success__description',
			closeButton: '.order-success__close',
		},
	},
	modal: {
		template: '#modal-container',
		close: '.modal__close',
		content: '.modal__content',
		classes: {
			active: 'modal_active',
		},
	},
	shoppingCart: {
		template: '#basket',
		list: '.basket__list',
		price: '.basket__price',
		buttonToOrder: '.basket__button',
		item: {
			template: '#card-basket',
			index: '.basket__item-index',
			title: '.card__title',
			price: '.card__price',
			deleteButton: '.basket__item-delete',
		},
	},
	addToShoppingCart: 'В корзину',
	deleteFromShoppingCart: 'Удалить из корзины',
	priceless: 'Бесценно',
	units: 'синапсов',
	orderAddressDataErrorMsg: 'Введите адрес доставки',
	orderPaymentDataErrorMsg: 'Выберите тип платежа',
	orderEmailDataErrorMsg: 'Введите почтовый адрес',
	orderPhoneDataErrorMsg: 'Введите номер телефона',
};

export enum EVENT {
	CatalogChanged = 'catalog:changed',
	ModalOpen = 'modal:open',
	ModalClose = 'modal:close',
	ShoppingCartOpening = 'shoppingCart:opening',
	ShoppingCartCountChanged = 'shoppingCart:count:changed',
	CatalogItemPreviewOpening = 'catalog:item:preview:opening',
	CatalogItemToShoppingCartClicked = 'catalog:item:toShoppingCart:click',
	ShoppingCartItemDelete = 'shoppingCart:item:delete',
	ShoppingCartCreateOrder = 'shoppingCart:order:create',
	OrderDeliveryDataReady = 'order:deliveryData:ready',
	OrderDataReady = 'order:data:ready',
	OrderSuccesfullyDone = 'order:success:done',
	NeedCloseModalView = 'need:close:modalView',

	OrderDeliveryDataChanged = 'order:delivery:data:changed',
	OrderDeliveryDataChecked = 'order:delivery:data:checked',
	OrderContactsDataChanged = 'order:contacts:data:changed',
	OrderContactsDataChecked = 'order:contacts:data:checked',
}
