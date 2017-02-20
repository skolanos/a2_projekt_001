import { Component, OnInit } from '@angular/core';

import { CartService } from '../services/cart.service';

@Component({
	moduleId: module.id,
	selector: 'cart-list-component',
	templateUrl: 'cart-list.component.html'
})
export class CartListComponent implements OnInit {
	private processing: boolean;
	private messages: string[];
	private items: any[];
	private selectedItem: any;

	constructor(private cartService: CartService) {
		this.processing = false;
		this.messages = [];
		this.items = [];
		this.selectedItem = undefined;
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
	}
}
