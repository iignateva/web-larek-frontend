import { IAppState, IProduct, IProducts } from "../../types";
import { EVENT } from "../../utils/constants";
import { Model } from "../base/Model";
import { Order } from "./Order";
import { ShoppingCart } from "./ShoppingCart";

export class AppState extends Model<IAppState<IProduct>> {
	products: IProducts<IProduct>;
	shoppingCart: ShoppingCart;
	order: Order
 
	setCatalog(products: IProducts<IProduct>) {
		this.products = products;
		this.emitChanges(EVENT.CatalogChanged, { catalog: this.products });
	}
}