import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { EventEmitterService } from '../services/event-emitter.service';
import { AuthenticationService } from '../services/authentication.service';
import { CartService } from '../services/cart.service';

@Component({
	moduleId: module.id,
	selector: 'navbar-component',
	templateUrl: 'navbar.component.html'
})
export class NavbarComponent implements OnDestroy {
	private subscription: Subscription;
	private cartNumItems: number;

	constructor(
		private eventEmitterService: EventEmitterService,
		private authenticationService: AuthenticationService,
		private cartService: CartService
	) {
		this.cartNumItems = 0;

		this.subscription = this.eventEmitterService.usersCartChangedStream.subscribe((value: any) => {
			this.getCartNumberOfItems();
		});
	}
	ngOnDestroy() {
		this.subscription.unsubscribe();
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
}
