export enum PaymentType {
	ONLINE = 'online',
	ON_RECEIVING = 'при получении',
}

export enum ProductCategory { 
  SOFT_SKILL = 'софт-скил', 
  OTHER = 'другое',
  ADDITIONAL = 'дополнительное', 
  BUTTON = 'кнопка',
  HARD_SKILL = 'хард-скил'
}

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: ProductCategory;
  price: number | null;
}

export interface IItems<T> {
  total: number;
  items: T[];
}

export interface IOrder {
	payment: PaymentType;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
}

export interface IOrderResponse {
	id: string;
	total: number;
}

export interface IApiErrorResponse {
  error: string;
}

export type OrderConfirmation = IOrderResponse | IApiErrorResponse;

export interface WebLarekApi {
  getProducts(): Promise<IItems<IProduct>>
  getProduct(id: string): Promise<IProduct>

  confirmOrder(order: IOrder): Promise<OrderConfirmation>
}

export interface IShoppingCart<T> {
	addItem(item: T): void;
	deleteItem(id: string): void;
	items: T[];
	total: number;
}

export interface IAppState<T> {
	products: IItems<T>;
	shoppingCart: IShoppingCart<T>;
	preview: string | null;
	order: IOrder | null;
	loading: boolean;
}
