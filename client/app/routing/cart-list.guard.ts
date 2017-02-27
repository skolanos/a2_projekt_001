import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { CartService } from '../services/cart.service';

@Injectable()
export class CartListGuard implements CanActivate {
	constructor(private cartService: CartService) {
	}
	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
		return this.cartService.getCount() > 0;
	}
}
