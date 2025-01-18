import { IAppState, IProducts } from "../../types";
import { EVENT } from "../../utils/constants";
import { Model } from "../base/Model";

export class AppState extends Model<IAppState> {
  products: IProducts;

  setCatalog(products: IProducts) {
    this.products = products;
    this.emitChanges(EVENT.CatalogChanged, { catalog: this.products });
  }
  
}