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

export interface IProducts<T> {
  total: number;
  items: T[];
}

export enum PaymentType {
  ONLINE = 'online',
  ON_RECEIVING = 'при получении'
}
 
export interface IOrderRequest {
  payment: PaymentType;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}

export type OrderConfirmation = IOrderResponse | IApiErrorResponse;

export interface IOrderResponse {
  id: string;
  total: number;
}

export interface IApiErrorResponse {
  error: string;
}

export interface WebLarekApi {
  getProducts(): Promise<IProducts<IProduct>>
  getProduct(id: string): Promise<IProduct>

  confirmOrder(order: IOrderRequest): Promise<OrderConfirmation>
}

export interface IOrder {
	toOrderRequest(): IOrderRequest;
}

export interface IShoppingCart<T> {
	addItem(item: T): void;
	deleteItem(id: string): void;
	order(): void;
	items: T[];
	totalCount: number;
}


export interface IAppState<T> {
	products: IProducts<T>;
	shoppingCart: IShoppingCart<T>;
	preview: string | null;
	order: IOrder | null;
	loading: boolean;
}
