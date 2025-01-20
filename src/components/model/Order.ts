import { PaymentType } from "../../types";
import { Model } from "../base/Model";

export interface IOrderRequest {
	payment: PaymentType;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
}

export class Order extends Model<IOrderRequest>{
	items: string[];
	total: number;
	payment: PaymentType;
	email: string;
	phone: string;
	address: string;
}
