import { EventEmitter, IEvents } from './components/base/events';
import { AppState } from './components/model/AppState';
import { Order } from './components/model/Order';
import { SuccessOrderView } from './components/view/SuccessOrderView';
import { ContactsView } from './components/view/ContactsView';
import { Modal } from './components/view/Modal';
import { OrderView } from './components/view/OrderView';
import { Page } from './components/view/Page';
import { ShoppingCartItem, ShoppingCartView } from './components/view/ShoppingCartView';
import { WebLarek } from './components/webLarekApi';
import './scss/styles.scss';
import { API_URL, CDN_URL, EVENT, settings } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import {
	IApiErrorResponse,
	ICatalogItemView,
	IOrder,
	IOrderResponse,
	WebLarekApi,
} from './types';
import { CatalogItemPreview } from './components/view/CatalogItemPreview';
import { HeaderView } from './components/view/HeaderView';
import { CatalogItemView } from './components/view/CatalogItemView';
import { ShoppingCart } from './components/model/ShoppingCart';

const api: WebLarekApi = new WebLarek(API_URL, CDN_URL);

// брокер событий
const events: IEvents = new EventEmitter();

// Глобальные контейнеры
const page = new Page(events);
const header = new HeaderView(ensureElement(settings.page.header), events);
const modal = new Modal(ensureElement(settings.modal.template), events);

// Все шаблоны
const successTemplate = ensureElement<HTMLTemplateElement>(
	settings.order.success.template
);
const catalogItemTemplate = ensureElement<HTMLTemplateElement>(
	settings.gallery.item.template
);
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>(
	settings.gallery.item.preview.template
);
const cardBasketTemplate = ensureElement<HTMLTemplateElement>(
	settings.shoppingCart.item.template
);
const basketTemplate = ensureElement<HTMLTemplateElement>(
	settings.shoppingCart.template
);
const orderTemplate = ensureElement<HTMLTemplateElement>(
	settings.order.template
);
const contactsTemplate = ensureElement<HTMLTemplateElement>(
	settings.order.contacts.template
);

// переиспользуемые view
const productPreviewModal = cloneTemplate(cardPreviewTemplate);
const previewCatalogItem = new CatalogItemPreview(productPreviewModal, events);
const shoppingCartModal = cloneTemplate(basketTemplate);
const shoppingCartView = new ShoppingCartView(shoppingCartModal, events);
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
const appData = new AppState({
	shoppingCart: new ShoppingCart(events),
	order: new Order(events)
}, events);

// обработка событий
events.on(EVENT.CatalogChanged, () => {
	const itemViews = appData.products.items.map((product) => {
		const templateProduct = cloneTemplate(catalogItemTemplate);
		return new CatalogItemView(templateProduct, events).render(product);
	});
	page.catalog = itemViews;
});

events.on(EVENT.ShoppingCartOpening, () => {
	renderShoppingCartModal();
});

events.on(
	EVENT.CatalogItemPreviewOpening, (item: ICatalogItemView) => {
		const inShoppingCart =
			appData.shoppingCart.items.findIndex((it) => it.id === item.id) >= 0;
		renderCatalogItemPreviewModal(item, inShoppingCart);
	}
);

events.on(
	EVENT.CatalogItemToShoppingCartClicked, (product: ICatalogItemView ) => {
		const inShoppingCart =
			appData.shoppingCart.items.findIndex((it) => it.id === product.id) >= 0;
		if (inShoppingCart) {
			appData.shoppingCart.deleteItem(product.id);
		} else {
			appData.shoppingCart.addItem(product);
		}
		header.shoppingCartItemCounter = appData.shoppingCart.totalCount;
		renderCatalogItemPreviewModal(product, !inShoppingCart);
	}
);

function renderCatalogItemPreviewModal(item: ICatalogItemView, inShoppingCart: boolean) {
	previewCatalogItem.inShoppingCart = inShoppingCart;
  modal.render({
		content: previewCatalogItem.render({...item})
	})
}

events.on(EVENT.ShoppingCartItemDelete, ({ id }: { id: string }) => {
	deleteFromShoppingCart(id);
	renderShoppingCartModal();
});

function deleteFromShoppingCart(id: string) {
	appData.shoppingCart.deleteItem(id);
	header.shoppingCartItemCounter = appData.shoppingCart.totalCount;
}

function renderShoppingCartModal() {
	const shoppingCartItems = appData.shoppingCart.items.map((item, index) => {
		const itemContainer = cloneTemplate(cardBasketTemplate);
		return new ShoppingCartItem(itemContainer, events).render({
			index: index + 1,
			title: item.title,
			price: item.price,
			itemId: item.id,
		});
	});

	let totalPrice = 0;
	if (appData.shoppingCart.items.length > 0) { 
		totalPrice = appData.shoppingCart.items.map((it) => it.price ?? 0)
			.reduce((totalPrice, itemPrice) => totalPrice + itemPrice);
	}

	modal.render({
		content: shoppingCartView.render({
			items: shoppingCartItems,
			total: totalPrice,
		})
	});
}

events.on(EVENT.ShoppingCartCreateOrder, () => {
	modal.render({
		content: orderModalView.render(),
	});
});

events.on(EVENT.OrderDeliveryDataReady, (data: Partial<IOrder>) => {
	Object.assign(appData.order, {
		total: appData.shoppingCart.total,
		items: appData.shoppingCart.itemIds,
		...data,
	});

	modal.render({
		content: contactsModalView.render(),
	});
});

events.on(EVENT.OrderDataReady, (data: Partial<IOrder>) => {
	Object.assign(appData.order, data ?? {});

	api
		.confirmOrder(appData.order)
		.then((data) => {
			if (Object.keys('id')) {
				modal.render({
					content: successModal.render({
						totalPrice: appData.order.total,
						orderNumber: (data as IOrderResponse).id,
					}),
				});
				events.emit(EVENT.OrderSuccesfullyDone);
			} else if (Object.keys('error')) {
				console.log((data as IApiErrorResponse).error);
			}
		})
		.catch((err) => console.log(err));
});

events.on(EVENT.OrderSuccesfullyDone, () => {
	appData.shoppingCart.clear();
	orderModalView.clear();
	contactsModalView.clear();
	header.shoppingCartItemCounter = appData.shoppingCart.totalCount;
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
	})
	.catch((err) => {
		console.error(err);
	});
