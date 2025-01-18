import { IProduct, ProductCategory } from '../../types';
import { Model } from '../base/Model';

export class CatalogItem extends Model<IProduct> {
	id: string;
	description: string;
	image: string;
	title: string;
	category: ProductCategory;
	price: number | null;
}
