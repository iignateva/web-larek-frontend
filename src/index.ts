import { EventEmitter, IEvents } from './components/base/events';
import { Order } from './components/model/Order';
import { SuccessOrderView } from './components/view/SuccessOrderView';
import { ContactsView } from './components/view/ContactsView';
import { Modal } from './components/view/Modal';
import { OrderView } from './components/view/OrderView';
import { Page } from './components/view/Page';
import {
	ShoppingCartItem,
	ShoppingCartView,
} from './components/view/ShoppingCartView';
import { WebLarek } from './components/webLarekApi';
import './scss/styles.scss';
import { API_URL, CDN_URL, EVENT, settings } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import {
	IApiErrorResponse,
	ICatalogItemView,
	IContactsDataView,
	IDeliveryDataView,
	IItems,
	IOrder,
	IOrderResponse,
	IProduct,
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
const shoppingCart = new ShoppingCart(events);
const order = new Order(events);

// обработка событий
events.on(EVENT.CatalogChanged, (products: IItems<IProduct>) => {
	const itemViews = products.items.map((product) => {
		const templateProduct = cloneTemplate(catalogItemTemplate);
		return new CatalogItemView(templateProduct, events).render(product);
	});
	page.catalog = itemViews;
});

events.on(EVENT.ShoppingCartOpening, () => {
	modal.render({
		content: shoppingCartView.render({
			items: getShoppingCartItems(),
			total: shoppingCart.total,
		}),
	});
});

function getShoppingCartItems(): HTMLElement[] {
	return shoppingCart.items.map((item, index) => {
		const itemContainer = cloneTemplate(cardBasketTemplate);
		return new ShoppingCartItem(itemContainer, events).render({
			index: index + 1,
			...item,
		});
	});
}

events.on(EVENT.CatalogItemPreviewOpening, (item: ICatalogItemView) => {
	const inShoppingCart = shoppingCart.contains(item.id);
	previewCatalogItem.inShoppingCart = inShoppingCart;
	modal.render({
		content: previewCatalogItem.render({ ...item }),
	});
});

events.on(EVENT.CatalogItemToShoppingCartClicked, (item: ICatalogItemView) => {
	const inShoppingCart = shoppingCart.contains(item.id);
	if (inShoppingCart) {
		shoppingCart.deleteItem(item.id);
	} else {
		shoppingCart.addItem(item);
	}
	previewCatalogItem.inShoppingCart = shoppingCart.contains(item.id);
});

events.on(EVENT.ShoppingCartItemDelete, ({ id }: { id: string }) => {
	shoppingCart.deleteItem(id);
	shoppingCartView.items = getShoppingCartItems();
	shoppingCartView.total = shoppingCart.total;
});

events.on(EVENT.ShoppingCartCreateOrder, () => {
	modal.render({
		content: orderModalView.render({
			address: order.address,
			paymentType: order.payment,
		}),
	});
	order.checkDeliveryData();
});

events.on(EVENT.OrderDeliveryDataReady, (data: Partial<IOrder>) => {
	Object.assign(order, data);

	modal.render({
		content: contactsModalView.render({
			phone: order.phone,
			email: order.email,
		}),
	});
	order.checkContactsData();
});

events.on(EVENT.OrderDataReady, (data: Partial<IOrder>) => {
	Object.assign(order, data ?? {});
	const orderRequest = {
		payment: order.payment,
		email: order.email,
		phone: order.phone,
		address: order.address,
		total: shoppingCart.total,
		items: shoppingCart.items.map((it) => it.id),
	};
	api
		.confirmOrder(orderRequest)
		.then((data) => {
			if (Object.keys('id')) {
				modal.render({
					content: successModal.render({
						totalPrice: orderRequest.total,
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
	shoppingCart.clear();
	order.clear();
	orderModalView.address = order.address;
	orderModalView.paymentType = order.payment;
	contactsModalView.email = order.email;
	contactsModalView.phone = order.phone;
});

events.on(EVENT.ShoppingCartCountChanged, () => {
	header.shoppingCartItemCounter = shoppingCart.totalCount;
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

events.on(
	EVENT.OrderDeliveryDataChanged,
	(data: Partial<IDeliveryDataView>) => {
		order.payment = data.paymentType;
		order.address = data.address;
	}
);

events.on(EVENT.OrderDeliveryDataChecked, (data: IDeliveryDataView) => {
	orderModalView.errorMessages = data.errorMessages;
});

events.on(
	EVENT.OrderContactsDataChanged,
	(data: Partial<IContactsDataView>) => {
		order.email = data.email;
		order.phone = data.phone;
	}
);

events.on(EVENT.OrderContactsDataChecked, (data: IContactsDataView) => {
	contactsModalView.errorMessages = data.errorMessages;
});

// Получаем лоты с сервера
api
	.getProducts()
	.then((products) => {
		events.emit(EVENT.CatalogChanged, products);
	})
	.catch((err) => {
		console.error(err);
	});
