import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { EventEmitterService } from '../services/event-emitter.service';
import { CartService } from '../services/cart.service';

declare var BigDecimal: any;
declare var RoundingMode: any;

@Component({
	moduleId: module.id,
	selector: 'cart-list-component',
	templateUrl: 'cart-list.component.html'
})
export class CartListComponent implements OnInit {
	private processing: boolean;
	private messages: string[];
	private items: any[];
	private totalValue: string;
	private selectedItem: any;
	private showDeleteItemConfirm: boolean;
	private showDeleteAllConfirm: boolean;

	constructor(
		private eventEmitterService: EventEmitterService,
		private cartService: CartService,
		private router: Router
	) {
		this.processing = false;
		this.messages = [];
		this.items = [];
		this.totalValue = '0.00';
		this.selectedItem = undefined;
		this.showDeleteItemConfirm = false;
		this.showDeleteAllConfirm = false;
	}
	ngOnInit(): void {
		this.getItemsList();
	}
	getItemsList(): void {
		this.processing = true;
		this.cartService.getItemsList().subscribe((value: any) => {
			this.processing = false;
			if (value.status === 200) {
				this.items = value.data;
				this.computeTotalValue();
			}
			else {
				this.messages.push(value.message);
			}
		}, error => {
			this.processing = false;
			console.log('CartListComponent.getItemsList() error:', error);
			this.messages.push(error);
		});
	}
	selectItemClick(item: any): void {
		this.selectedItem = item;

		this.showDeleteAllConfirm = false;
		this.showDeleteItemConfirm = false;
	}
	private isValidInt(value: string): boolean {
		let res: RegExpMatchArray = undefined;

		if (value) {
			res = value.match(/^[-+]?\d+$/);
		}

		return (res && (res.length > 0)) ? true: false;
	}
	private computeTotalValue() {
		let currentValue = '0';
		let validAmount = true;
		for (let i = 0; i < this.items.length; i += 1) {
			if (this.isValidInt(String(this.items[i].ko_ile))) {
				let amountBD: any = new BigDecimal(currentValue);
				let priceBD: any = new BigDecimal(this.items[i].wartosc);
				let valueBD: any = priceBD.add(amountBD).setScale(2, RoundingMode.HALF_UP());
				currentValue = valueBD.toString();
			}
			else {
				validAmount = false;
				break;
			}
		}
		if (validAmount) {
			this.totalValue = currentValue;
		}
	}
	private computeValue(item: any): void {
		let amountBD: any = new BigDecimal(item.ko_ile);
		let priceBD: any = new BigDecimal(item.c_cena);
		let valueBD: any = priceBD.multiply(amountBD).setScale(2, RoundingMode.HALF_UP());

		item.wartosc = Number(valueBD.toString());
	}
	customTrackBy(index: number, obj: any): any {
		return index;
	}
	amountChange(item: any): void {
		// nie ma gwarancji że this.amount jest typu string, jak do pola wprowadzi
		// się liczbę to typ się zmienia
		if (this.isValidInt(String(item.ko_ile))) {
			this.computeValue(item);
			this.computeTotalValue();
		}
	}
	registerOrder(): void {
		this.showDeleteAllConfirm = false;
		this.showDeleteItemConfirm = false;
		alert('TODO:'); // TODO:
	}
	deleteAllItems(): void {
		this.showDeleteAllConfirm = true;
		this.showDeleteItemConfirm = false;
	}
	deleteAllYes(): void {
		this.showDeleteAllConfirm = false;
		this.processing = true;
		this.cartService.deleteAll().subscribe((value: any) => {
			if (value.status === 200) {
				this.selectedItem = undefined;
				this.eventEmitterService.confirmUsersCartChanged({ event: 'refresh' });
				// koszyk jest pusty, automatyczne przejście do oferty
				this.router.navigate(['/items-list']);
			}
			else {
				this.messages.push(value.message);
			}
		}, error => {
			this.processing = false;
			console.log('CartListComponent.deleteItemYes() error:', error);
			this.messages.push(error);
		});
	}
	deleteAllNo(): void {
		this.showDeleteAllConfirm = false;
	}
	deleteItem(): void {
		if (this.selectedItem) {
			this.showDeleteAllConfirm = false;
			this.showDeleteItemConfirm = true;
		}
	}
	deleteItemYes(): void {
		this.showDeleteItemConfirm = false;
		this.processing = true;
		this.cartService.deleteItem(this.selectedItem.ko_id).subscribe((value: any) => {
			if (value.status === 200) {
				this.selectedItem = undefined;
				this.eventEmitterService.confirmUsersCartChanged({ event: 'refresh' });
				this.cartService.getNumberOfItems().subscribe((value: any) => {
					if (value.status === 200) {
						this.processing = false;
						let cartNumItems: number = parseInt(value.data[0].rowsCount, 10);
						if (cartNumItems === 0 ) {
							// koszyk jest pusty, automatyczne przejście do oferty
							this.router.navigate(['/items-list']);
						}
						else {
							this.getItemsList();
						}
					}
					else {
						this.processing = false;
						console.log('CartListComponent.deleteItemYes():', value);
					}
				}, error => {
					this.processing = false;
					console.log('CartListComponent.deleteItemYes() error:', error);
					this.messages.push(error);
				});
			}
			else {
				this.messages.push(value.message);
			}
		}, error => {
			this.processing = false;
			console.log('CartListComponent.deleteItemYes() error:', error);
			this.messages.push(error);
		});
	}
	deleteItemNo(): void {
		this.showDeleteItemConfirm = false;
	}
}
