import { EventEmitter } from './components/base/events';
import { AppState } from './components/model/AppState';
import { IOrderRequest, Order } from './components/model/Order';
import { ShoppingCart } from './components/model/ShoppingCart';
import {
	CatalogItem,
	CatalogItemPreview,
	ICatalogItem,
} from './components/view/CatalogItem';
import { SuccessOrderView } from './components/view/SuccessOrderView';
import { ContactsView } from './components/view/ContactsView';
import { Modal } from './components/view/Modal';
import { OrderView } from './components/view/OrderView';
import { Page } from './components/view/Page';
import { ShoppingCartView } from './components/view/ShoppingCartView';
import { WebLarek } from './components/webLarekApi';
import './scss/styles.scss';
import { API_URL, CDN_URL, EVENT } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { IApiErrorResponse, IOrderResponse } from './types';

const api = new WebLarek(API_URL, CDN_URL);

// брокер событий
const events = new EventEmitter();

// Глобальные контейнеры
const page = new Page(events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Все шаблоны
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

// переиспользуемые view
const productPreviewModal = cloneTemplate(cardPreviewTemplate);
const previewCatalogItem = new CatalogItemPreview(productPreviewModal, events);
const shoppingCartModal = cloneTemplate(basketTemplate);
const shoppingCartView = new ShoppingCartView(
	shoppingCartModal,
	cardBasketTemplate,
	events
);
const orderModalView = new OrderView(cloneTemplate(orderTemplate), events);

const contactsModalView = new ContactsView(
	cloneTemplate(contactsTemplate),
	events
);

const successModal = new SuccessOrderView(
	cloneTemplate(successTemplate),
	events
);

// модель данных
const appData = new AppState(
	{
		shoppingCart: new ShoppingCart(events),
	},
	events
);

// обработка событий
events.on(EVENT.CatalogChanged, () => {
	page.catalog = appData.products.items.map((product) => {
		const templateProduct = cloneTemplate(cardCatalogTemplate);
		const productData: ICatalogItem = {
			id: product.id,
			category: product.category,
			title: product.title,
			text: product.description,
			price: product.price,
			image: product.image,
		};
		const catalogItem = new CatalogItem(templateProduct, {
			evt: 'click',
			handler: (evt) => {
				previewCatalogItem.inShoppingCart =
					appData.shoppingCart.items.findIndex((it) => it.id === product.id) >=
					0;
				modal.render({
					content: previewCatalogItem.render({
						...productData,
					}),
				});
			},
		});
		catalogItem.fill(productData);

		return catalogItem;
	});
});

events.on(EVENT.ShoppingCartChanged, () => {
	renderShoppingCartModal();
});

events.on(EVENT.CatalogItemAddToShoppingCart, ({ id }: { id: string }) => {
	const product = appData.products.items.find((it) => it.id === id);
	appData.shoppingCart.addItem(product);
	page.shoppingCartItemCounter = appData.shoppingCart.totalCount;
});

events.on(EVENT.CatalogItemDeleteFromShoppingCart, ({ id }: { id: string }) => {
	deleteFromShoppingCart(id);
});

events.on(EVENT.ShoppingCartItemDelete, ({ id }: { id: string }) => {
	deleteFromShoppingCart(id);
	renderShoppingCartModal();
});

function deleteFromShoppingCart(id: string) {
	appData.shoppingCart.deleteItem(id);
	page.shoppingCartItemCounter = appData.shoppingCart.totalCount;
}

function renderShoppingCartModal() {
	modal.render({
		content: shoppingCartView.render({
			items: appData.shoppingCart.items
		}),
	});
}

events.on(EVENT.CatalogItemAdded, () => {
	previewCatalogItem.inShoppingCart = true;
});

events.on(EVENT.CatalogItemDeleted, () => {
	previewCatalogItem.inShoppingCart = false;
});

events.on(EVENT.ShoppingCartCreateOrder, () => {
	appData.order = new Order(
		{
			total: appData.shoppingCart.total,
			items: appData.shoppingCart.items.filter(it => it.price !== null).map((it) => it.id),
		},
		events
	);

	modal.render({
		content: orderModalView.render(appData.order),
	});
});

events.on(EVENT.OrderDeliveryDataReady, (data: Partial<IOrderRequest>) => {
	Object.assign(appData.order, data ?? {});

	modal.render({
		content: contactsModalView.render(),
	});
});

events.on(EVENT.OrderDataReady, (data: Partial<IOrderRequest>) => {
	Object.assign(appData.order, data ?? {});

	api.confirmOrder(appData.order).then((data) => {
		if (Object.keys('id')) {
			modal.render({
				content: successModal.render({
					totalPrice: appData.order.total,
					orderNumber: (data as IOrderResponse).id,
				}),
			});
		} else if (Object.keys('error')) {
			console.log((data as IApiErrorResponse).error);
		}
	}).catch( (err) => console.log(err));
});

events.on(EVENT.OrderSuccesfullyDone, () => {
	appData.products.items = [];
	appData.products.total = 0;
	appData.order = null;
});

events.on(EVENT.ModalOpen, () => {
	page.locked = true;
});

events.on(EVENT.ModalClose, () => {
	page.locked = false;
});

events.on(EVENT.NeedCloseModalView, () => {
	modal.close();
});

// Получаем лоты с сервера
api
	.getProducts()
	.then((products) => {
		appData.setCatalog(products);
		appData.shoppingCart.addItem(appData.products.items[0]);
		appData.shoppingCart.addItem(appData.products.items[2]);
	})
	.catch((err) => {
		console.error(err);
	});
