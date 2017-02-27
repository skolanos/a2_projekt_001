import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { OrdersService } from '../services/orders.service';

@Injectable()
export class OrdersListGuard implements CanActivate {
	constructor(private ordersService: OrdersService) {
	}
	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
		return this.ordersService.getCount() > 0;
	}
}
