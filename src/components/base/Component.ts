import { createElement } from "../../utils/utils";

/**
 * Базовый компонент
 */
export abstract class Component<T> {
	protected constructor(protected readonly container: HTMLElement) {
		// Учитывайте что код в конструкторе исполняется ДО всех объявлений в дочернем классе
	}

	// Переключить класс
	toggleClass(element: HTMLElement, className: string, force?: boolean) {
		element.classList.toggle(className, force);
	}

	// Установить текстовое содержимое
	protected setText(element: HTMLElement, value: unknown) {
		if (element) {
			element.textContent = String(value);
		}
	}

	// Сменить статус блокировки
	setDisabled(element: HTMLElement, state: boolean) {
		if (element) {
			if (state) element.setAttribute('disabled', 'disabled');
			else element.removeAttribute('disabled');
		}
	}

	// Скрыть
	protected setHidden(element: HTMLElement) {
		element.style.display = 'none';
	}

	// Показать
	protected setVisible(element: HTMLElement) {
		element.style.removeProperty('display');
	}

	// Установить изображение с алтернативным текстом
	protected setImage(element: HTMLImageElement, src: string, alt?: string) {
		if (element) {
			element.src = src;
			if (alt) {
				element.alt = alt;
			}
		}
	}
/*
	protected isValid(
		errorElement: HTMLElement,
		...elements: HTMLElement[]
	): boolean {
		const inputElements: HTMLInputElement[] = elements
			.filter((it) => it instanceof HTMLInputElement)
			.map((it) => it as HTMLInputElement);
		let errorMessage = '';
		let invalid = false;
		inputElements.forEach((element: HTMLInputElement) => {
			if (element.validity.valueMissing) {
				invalid = true;
                errorMessage += element.dataset.errorEmptyValueMessage + '; ';
			} else {
				this.setHidden(errorElement);
			}
		});

		if (invalid) {
			this.setVisible(errorElement);
			this.setText(errorElement, errorMessage);
		} else {
			this.setHidden(errorElement);
			this.setText(errorElement, errorMessage);
		}
		return !invalid;
	}
*/
	// Вернуть корневой DOM-элемент
	render(data?: Partial<T>): HTMLElement {
		Object.assign(this as object, data ?? {});
		return this.container;
	}
}