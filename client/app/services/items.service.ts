import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { AuthenticationService } from './authentication.service';

@Injectable()
export class ItemsService {
	constructor(
		private http: Http,
		private authenticationService: AuthenticationService
	) {}
	getCategoriesList(): Observable<any> {
		return this.http.post('/api/categories-list', '', {
			headers: new Headers({
				'Content-Type': 'application/json',
				'x-accss-token': this.authenticationService.getUserToken()
			})
		}).map((response: Response) => response.json());
	}
	getItemsList(dataOffset: number, dataLimit: number, filter: any): Observable<any> {
		return this.http.post('/api/items-list', JSON.stringify({
			dataOffset: dataOffset,
			dataLimit: dataLimit,
			filter: {
				itemName: filter.itemName,
				categoryId: filter.categoryId
			}
		}), {
			headers: new Headers({
				'Content-Type': 'application/json',
				'x-accss-token': this.authenticationService.getUserToken()
			})
		}).map((response: Response) => response.json());
	}
	getItemPrices(itemId: number): Observable<any> {
		return this.http.post('/api/item-prices', JSON.stringify({
			itemId: itemId
		}), {
			headers: new Headers({
				'Content-Type': 'application/json',
				'x-accss-token': this.authenticationService.getUserToken()
			})
		}).map((response: Response) => response.json());
	}
	addItemToCart(amount: number, priceId: number, value: number): Observable<any> {
		return this.http.post('/api/item-add-to-cart', JSON.stringify({
			amount: amount,
			priceId: priceId,
			value: value
		}), {
			headers: new Headers({
				'Content-Type': 'application/json',
				'x-accss-token': this.authenticationService.getUserToken()
			})
		}).map((response: Response) => response.json());
	}
	getCartNumberOfItems(): Observable<any> {
		return this.http.post('/api/cart-number-of-items', '', {
			headers: new Headers({
				'Content-Type': 'application/json',
				'x-accss-token': this.authenticationService.getUserToken()
			})
		}).map((response: Response) => response.json());
	}
}
