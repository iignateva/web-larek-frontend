import {
	IProduct,
	IProducts,
	OrderConfirmation,
	WebLarekApi,
} from '../types';
import { Api } from './base/api';
import { IOrderRequest } from './model/Order';

export class WebLarek implements WebLarekApi {
	private _api: Api;
	private _cdnUrl: string;

	constructor(url: string, cdnUrl: string) {
		this._api = new Api(url);
		this._cdnUrl = cdnUrl;
	}

	getProducts(): Promise<IProducts<IProduct>> {
		return this._api.get('/product/').then((products: IProducts<IProduct>) => {
			const withUpdatedImages = products.items.map((product: IProduct) =>
				this.enrichImageUrl(product)
			);
			return {
				total: products.total,
				items: withUpdatedImages,
			};
		});
	}

	getProduct(id: string): Promise<IProduct> {
		return this._api
			.get(`/product/${id}`)
			.then((product: IProduct) => this.enrichImageUrl(product));
	}

	confirmOrder(orderRequest: IOrderRequest): Promise<OrderConfirmation> {
		return this._api.post('/order', orderRequest);
	}

	private enrichImageUrl(product: IProduct) {
		return {
			...product,
			image: this._cdnUrl + product.image,
		};
	}
}
