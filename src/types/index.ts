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

export interface IProducts {
  total: number;
  items: IProduct[];
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
  getProducts(): Promise<IProducts>
  getProduct(id: string): Promise<IProduct>

  confirmOrder(order: IOrderRequest): Promise<OrderConfirmation>
}

export interface IOrder {
	toOrderRequest(): IOrderRequest;
}

export interface IShoppingCart<T> {
	addItem(item: T): void;
	deleteItem(item: T): void;
	order(): void;
	get items(): Map<T, number>;
	get totalCount(): number;
}


export interface IAppState {
	products: IProducts;
	shoppingCart: string[];
	preview: string | null;
	order: IOrder | null;
	loading: boolean;
}
