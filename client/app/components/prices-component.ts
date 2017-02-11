import { Component, OnChanges, Input } from '@angular/core';

import { Item } from '../types/item.type';

import { EventEmitterService } from '../services/event-emitter.service';
import { ItemsService } from '../services/items.service';

declare var BigDecimal: any;
declare var RoundingMode: any;

@Component({
	moduleId: module.id,
	selector: 'prices-component',
	templateUrl: 'prices-component.html'
})
export class PricesComponent implements /*OnDestroy,*/ OnChanges {
	@Input() item: Item;
	private prices: any[];
	private selectedPrice: any;
	private amount: string;
	private value: number;
	private processing: boolean;
	private messages: string[];

	constructor(
		private eventEmitterService: EventEmitterService,
		private itemsService: ItemsService
	) {
		this.processing = false;
		this.messages = [];
		this.prices = undefined;
		this.selectedPrice = undefined;
		this.amount = '1';
		this.value = 0;
	}
	ngOnChanges() {
		if (this.item) {
			this.processing = true;
			this.itemsService.getItemPrices(this.item.id).subscribe((value: any) => {
				this.processing = false;
				this.selectedPrice = undefined;
				this.amount = '1';
				this.prices = value.data;
				this.value = 0;
			}, error => {
				this.processing = false;
				this.messages.push(error);
			});
		}
	}
	private isValidInt(value: string): boolean {
		let res: RegExpMatchArray = value.match(/^[-+]?\d+$/);

		return (res && (res.length > 0)) ? true: false;
	}
	private computeValue(): void {
		let amountBD: any = new BigDecimal(this.amount);
		let priceBD: any = new BigDecimal(this.selectedPrice.c_cena);
		let valueBD: any = priceBD.multiply(amountBD).setScale(2, RoundingMode.HALF_UP());

		this.value = Number(valueBD.toString());
	}
	priceClick(selectedPrice: any): void {
		// nie ma gwarancji że this.amount jest typu string, jak do pola wprowadzi
		//  się liczbę to typ się zmienia
		if (this.isValidInt(String(this.amount))) {
			this.computeValue();
		}
	}
	amountChange(): void {
		// nie ma gwarancji że this.amount jest typu string, jak do pola wprowadzi
		// się liczbę to typ się zmienia
		if (this.isValidInt(String(this.amount))) {
			this.computeValue();
		}
	}
	checkForm(): boolean {
		let res: boolean = true;

		this.messages = [];
		if (!this.selectedPrice) {
			res = false;
			this.messages.push('Proszę wybrać wariant ceny.');
		}
		if (!((this.isValidInt(String(this.amount))) && (Number(this.amount) > 0))) {
			res = false;
			this.messages.push('Proszę wprowadzić prawidłową liczbę zamawianego towaru [1..].');
		}

		return res;
	}
	addItemToCart(): void {
		if (this.checkForm()) {
			this.processing = true;
			this.itemsService.addItemToCart(Number(this.amount), this.selectedPrice.c_id, this.value).subscribe((value: any) => {
				this.processing = false;

				this.prices = undefined;
				this.selectedPrice = undefined;
				this.amount = '1';
				this.value = 0;
				this.item = undefined;

				// wygenerowanie zdarzenia przez EventEmitter nie jest możliwe, ponieważ
				// nie ma powiązania pomiędzy komponentami przez router, konieczne jest
				// użycie serwisu
				this.eventEmitterService.confirmUsersCartChanged({ event: 'refresh' });
			}, error => {
				this.processing = false;
				console.log('PricesComponent.addItemToCart() error:', error);
				this.messages.push(error);
			});
		}
	}
}
