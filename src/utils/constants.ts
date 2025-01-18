export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const settings = {

};

export enum EVENT {
	CatalogChanged = 'catalog:changed',
	ModalOpen = 'modal:open',
	ModalClose = 'modal:close',
}