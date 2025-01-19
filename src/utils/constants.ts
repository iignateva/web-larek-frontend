export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const settings = {

};

export enum EVENT {
	CatalogChanged = 'catalog:changed',
	ModalOpen = 'modal:open',
	ModalClose = 'modal:close',
	ShoppingCartChanged = 'shoppingCart:changed',
	CatalogItemAddToShoppingCart = 'catalog:item:addToShoppingCart',
	CatalogItemDeleteFromShoppingCart = 'catalog:item:deleteFromShoppingCart',
	ShoppingCartItemDelete = 'shoppingCart:item:delete',
  ShoppingCartCreateOrder = 'shoppingCart:order:create',

  CatalogItemAdded = 'catalog:item:added',
  CatalogItemDeleted = 'catalog:item:deleted'
}