import { Component } from '@angular/core';
import { Input }  from '@angular/core';
import { OnChanges } from '@angular/core';

import { Item } from '../types/item.type';

import { ItemsService } from '../services/items.service';

declare var BigDecimal: any;
declare var RoundingMode: any;

@Component({
	moduleId: module.id,
	selector: 'prices-component',
	templateUrl: 'prices-component.html'
})
export class PricesComponent implements OnChanges {
	@Input() item: Item;
	private prices: any[];
	private selectedPrice: any;
	private amount: string;
	private value: number;
	private processing: boolean;
	private messages: string[];

	constructor(private itemsService: ItemsService) {
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
		if (this.isValidInt(this.amount)) {
			this.computeValue();
		}
	}
	amountChange(): void {
		if (this.isValidInt(this.amount)) {
			this.computeValue();
		}
	}
}
