import { EventEmitter } from './components/base/events';
import { Order } from './components/model';
import { AppState } from './components/model/AppState';
import { ShoppingCart } from './components/model/ShoppingCart';
import { CatalogItem, CatalogItemPreview, ICatalogItem } from './components/view/CatalogItem';
import { Modal } from './components/view/Modal';
import { Page } from './components/view/Page';
import { ShoppingCartView } from './components/view/ShoppingCartView';
import { WebLarek } from './components/webLarekApi';
import './scss/styles.scss';
import { IProduct, PaymentType } from './types';
import { API_URL, CDN_URL, EVENT } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

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

// модель данных
const appData = new AppState(
	{
		shoppingCart: new ShoppingCart(events)
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
		}
		const catalogItem = new CatalogItem(templateProduct, {
			evt: 'click',
			handler: (evt) => {
				previewCatalogItem.inShoppingCart = appData.shoppingCart.items.findIndex(
					(it) => it.id === product.id
				) >= 0;
				modal.render({
					content: previewCatalogItem.render({
						...productData
					}),
				});
			},
		});
		catalogItem.fill(productData)

		return catalogItem;
	});
});

events.on(EVENT.ShoppingCartChanged, () => {
	renderShoppingCartModal();
});

events.on(EVENT.CatalogItemAddToShoppingCart, ({id}: {id:string}) => {
	const product = appData.products.items.find(it => it.id === id);
	appData.shoppingCart.addItem(product);
	page.shoppingCartItemCounter = appData.shoppingCart.totalCount;
});

events.on(EVENT.CatalogItemDeleteFromShoppingCart, ({ id }: { id: string }) => {
		deleteFromShoppingCart(id);
});

events.on(EVENT.ShoppingCartItemDelete, ({id}: {id: string}) => {
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
			items: appData.shoppingCart.items,
			totalCount: appData.shoppingCart.totalCount,
		}),
	});
}

events.on(EVENT.CatalogItemAdded, () => {
	previewCatalogItem.inShoppingCart = true;
});

events.on(EVENT.CatalogItemDeleted, () => {
	previewCatalogItem.inShoppingCart = false;
});


events.on(EVENT.ModalOpen, () => {
	page.locked = true
})

events.on(EVENT.ModalClose, () => {
	page.locked = false;
});

api
	.getProducts()
	.then((products) => {
		const itemsInBusket = [
			products.items[0],
			products.items[1],
			products.items[4],
		];

		const total = itemsInBusket
			.map((item) => item.price)
			.reduce((total, curr) => total + curr, 0);

		const order = new Order(total, [
			products.items[0].id,
			products.items[1].id,
			products.items[4].id,
		]);

		order.address = 'my address';
		order.email = 'ret@ewr.ru';
		order.payment = PaymentType.ONLINE;
		order.phone = '2345';

		api
			.confirmOrder(order.toOrderRequest())
			.then((orderResponse) => {
				console.log(orderResponse);
			})
			.catch((err) => console.log(err));

		api
			.getProduct(products.items[5].id)
			.then((product) => console.log(product))
			.catch((err) => console.log(err));
	})
	.catch((err) => console.log(err));



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
