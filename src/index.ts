import { EventEmitter } from './components/base/events';
import { Order } from './components/model';
import { AppState } from './components/model/AppState';
import { CatalogItem, CatalogItemPreview, ICatalogItem } from './components/view/CatalogItem';
import { Modal } from './components/view/Modal';
import { Page } from './components/view/Page';
import { WebLarek } from './components/webLarekApi';
import './scss/styles.scss';
import { PaymentType } from './types';
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

// модель данных
const appData = new AppState({}, events);

// обработка событий
events.on(EVENT.CatalogChanged, () => {
	page.catalog = appData.products.items.map((product) => {
		const templateProduct = cloneTemplate(cardCatalogTemplate);
		const templatePreview = cloneTemplate(cardPreviewTemplate);
		const productData: ICatalogItem = {
			category: product.category,
			title: product.title,
  		text: product.description,
			price: product.price,
			image: product.image,
		}
		const previewCatalogItem = new CatalogItemPreview(templatePreview);
		const catalogItem = new CatalogItem(templateProduct, {
			evt: 'click',
			handler: (evt) => {
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
	.then(appData.setCatalog.bind(appData))
	.catch((err) => {
		console.error(err);
	});
