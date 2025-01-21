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
	clear(): void;
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

export interface ICatalogItemView {
	id: string;
	category: ProductCategory;
	title: string;
	image: string;
	text: string;
	price: number | null;
}

export interface ICatalogView {
	catalog: ICatalogItemView[];
}

export interface ICatalogItemPreview {
	inShoppingCart: boolean;
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
}

export interface ISuccessOrder {
	totalPrice: number;
	orderNumber: string;
}
