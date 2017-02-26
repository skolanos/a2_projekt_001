import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { AuthenticationService } from './authentication.service';

@Injectable()
export class CartService {
	constructor(
		private http: Http,
		private authenticationService: AuthenticationService
	) {}
	getNumberOfItems(): Observable<any> {
		return this.http.post('/api/cart-number-of-items', '', {
			headers: new Headers({
				'Content-Type': 'application/json',
				'x-accss-token': this.authenticationService.getUserToken()
			})
		}).map((response: Response) => response.json());
	}
	getItemsList(): Observable<any> {
		return this.http.post('/api/cart-items-list', JSON.stringify({
		}), {
			headers: new Headers({
				'Content-Type': 'application/json',
				'x-accss-token': this.authenticationService.getUserToken()
			})
		}).map((response: Response) => response.json());
	}
	deleteItem(cartId: number): Observable<any> {
		return this.http.post('/api/cart-delete-item', JSON.stringify({
			cartId: cartId
		}), {
			headers: new Headers({
				'Content-Type': 'application/json',
				'x-accss-token': this.authenticationService.getUserToken()
			})
		}).map((response: Response) => response.json());
	}
	deleteAll(): Observable<any> {
		return this.http.post('/api/cart-delete-all-items', '', {
			headers: new Headers({
				'Content-Type': 'application/json',
				'x-accss-token': this.authenticationService.getUserToken()
			})
		}).map((response: Response) => response.json());
	}
}
