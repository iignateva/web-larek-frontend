import { IAppState, IProduct, IItems } from "../../types";
import { EVENT } from "../../utils/constants";
import { Model } from "../base/Model";
import { Order } from "./Order";
import { ShoppingCart } from "./ShoppingCart";

export class AppState extends Model<IAppState<IProduct>> {
	products: IItems<IProduct>;
	shoppingCart: ShoppingCart;
	order: Order
 
	setCatalog(products: IItems<IProduct>) {
		this.products = products;
		this.emitChanges(EVENT.CatalogChanged, { catalog: this.products });
	}
}