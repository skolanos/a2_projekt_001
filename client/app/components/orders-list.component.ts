import { Component, OnInit } from '@angular/core';

import { OrdersService } from '../services/orders.service';

@Component({
	moduleId: module.id,
	selector: 'orders-list-component',
	templateUrl: 'orders-list.component.html'
})
export class OrdersListComponent implements OnInit {
	private processing: boolean;
	private messages: string[];
	private orders: any[];
	private selectedOrder: any;

	constructor(private ordersService: OrdersService) {
		this.processing = false;
		this.messages = [];
		this.orders = [];
		this.selectedOrder = undefined;
	}
	ngOnInit(): void {
		this.getItemsList();
	}
	getItemsList(): void {
		this.processing = true;
		this.ordersService.getItemsList().subscribe((value: any) => {
			this.processing = false;
			if (value.status === 200) {
				this.orders = value.data;
			}
			else {
				this.messages.push(value.message);
			}
		}, error => {
			this.processing = false;
			console.log('OrdersListComponent.getItemsList() error:', error);
			this.messages.push(error);
		});
	}
	selectOrderClick(order: any): void {
		this.selectedOrder = order;
	}
}
