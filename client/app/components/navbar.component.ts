import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router }    from '@angular/router';
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
export class NavbarComponent implements OnInit, OnDestroy {
	private subscriptionCartItems: Subscription;
	private subscriptionOrders: Subscription;
	private cartNumItems: number;
	private ordersNumItems: number;
	private activeOrdersNumItems: number;

	constructor(
		private eventEmitterService: EventEmitterService,
		private authenticationService: AuthenticationService,
		private cartService: CartService,
		private ordersService: OrdersService,
		private router: Router
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
	ngOnInit() {
		let userToken: string = localStorage.getItem('userToken');
		if (userToken && userToken !== '') {
			this.authenticationService.loginByToken(userToken).subscribe((value: any) => {
				if (value.status === 200) {
					this.eventEmitterService.confirmUsersCartChanged({ event: 'refresh' });
					this.eventEmitterService.confirmUsersOrdersChanged({ event: 'refresh' });
					this.router.navigate(['/items-list']);
				}
				else {
					console.log('NavbarComponent.ngOnInit():', value);
				}
			}, error => {
				console.log('NavbarComponent.ngOnInit() error:', error);
			});
		}
	}
	ngOnDestroy() {
		this.subscriptionCartItems.unsubscribe();
		this.subscriptionOrders.unsubscribe();
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
