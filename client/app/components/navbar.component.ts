import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { EventEmitterService } from '../services/event-emitter.service';
import { AuthenticationService } from '../services/authentication.service';
import { CartService } from '../services/cart.service';
import { OrdersService } from '../services/orders.service';

@Component({
	moduleId: module.id,
	selector: 'navbar-component',
	templateUrl: 'navbar.component.html'
})
export class NavbarComponent implements OnDestroy {
	private subscriptionCartItems: Subscription;
	private subscriptionOrders: Subscription;
	private cartNumItems: number;
	private ordersNumItems: number;
	private activeOrdersNumItems: number;

	constructor(
		private eventEmitterService: EventEmitterService,
		private authenticationService: AuthenticationService,
		private cartService: CartService,
		private ordersService: OrdersService
	) {
		this.cartNumItems = 0;
		this.ordersNumItems = 0;
		this.activeOrdersNumItems = 0;

		this.subscriptionCartItems = this.eventEmitterService.usersCartChangedStream.subscribe((value: any) => {
			this.getCartNumberOfItems();
		});
		this.subscriptionOrders = this.eventEmitterService.usersOrdersChangedStream.subscribe((value: any) => {
			this.getOrdersNumber();
		});
	}
	ngOnDestroy() {
		this.subscriptionCartItems.unsubscribe();
	}
	getCartNumberOfItems(): void {
		this.cartService.getNumberOfItems().subscribe((value: any) => {
			if (value.status === 200) {
				this.cartNumItems = parseInt(value.data[0].rowsCount, 10);
			}
			else {
				console.log('NavbarComponent.getCartNumberOfItems():', value);
			}
		}, error => {
			console.log('NavbarComponent.getCartNumberOfItems() error:', error);
		});
	}
	getOrdersNumber(): void {
		this.ordersService.getNumberOfOrders().subscribe((value: any) => {
			if (value.status === 200) {
				this.ordersNumItems = parseInt(value.data[0].rowsCount, 10);
			}
			else {
				console.log('NavbarComponent.getOrdersNumber():', value);
			}
		}, error => {
			console.log('NavbarComponent.getOrdersNumber() error:', error);
		});
		this.ordersService.getNumberOfActiveOrders().subscribe((value: any) => {
			if (value.status === 200) {
				this.activeOrdersNumItems = parseInt(value.data[0].rowsCount, 10);
			}
			else {
				console.log('NavbarComponent.getOrdersNumber():', value);
			}
		}, error => {
			console.log('NavbarComponent.getOrdersNumber() error:', error);
		});
	}
}
