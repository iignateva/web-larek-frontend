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

export type ItemPrice = number | null;

export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: ProductCategory;
	price: ItemPrice;
}

export interface IItems<T> {
  total: number;
  items: T[];
}

export interface IOrder {
	payment?: PaymentType;
	email?: string;
	phone?: string;
	address?: string;
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

export interface IShoppingCartItem {
	index: number;
	title: string;
	price: ItemPrice;
	itemId: string;
}

export interface IShoppingCartView {
	addItem(item: HTMLElement): void;
	deleteItem(id: string): void;
	items: HTMLElement[];
	total: number;
}

export interface IShoppingCart<T> {
	addItem(item: T): void;
	deleteItem(id: string): void;
	clear(): void;
	items: T[];
	itemIds: string[];
	total: number;
}

export interface IAppState<T> {
	products: IItems<T>;
	shoppingCart: IShoppingCart<T>;
	order: IOrder | null;
}

export interface ICatalogItemView {
	id: string;
	category: ProductCategory;
	title: string;
	image: string;
	description: string;
	price: ItemPrice;
}

export interface IHeader {
	shoppingCartItemCounter: number;
}

export interface IModal {
	content: HTMLElement;
}

export interface View {
	clear(): void;
}

export interface IPage {
	locked: boolean;
	catalog: HTMLElement[];
}

export interface ISuccessOrder {
	totalPrice: number;
	orderNumber: string;
}
