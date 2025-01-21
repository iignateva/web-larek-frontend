import { IOrder, PaymentType } from "../../types";
import { Model } from "../base/Model";

export class Order extends Model<IOrder>{
	items: string[];
	total: number;
	payment: PaymentType;
	email: string;
	phone: string;
	address: string;
}
