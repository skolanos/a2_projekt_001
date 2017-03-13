import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { AuthenticationService } from './authentication.service';

@Injectable()
export class OrdersService {
	private numberOfItems: number;

	constructor(
		private http: Http,
		private authenticationService: AuthenticationService
	) {
		this.numberOfItems = 0;
	}
	getCount(): number {
		return this.numberOfItems;
	}
	getNumberOfOrders(): Observable<any> {
		return this.http.post('/api/orders-number-of-orders', '', {
			headers: new Headers({
				'Content-Type': 'application/json',
				'x-access-token': this.authenticationService.getUserToken()
			})
		}).map((response: Response) => {
			let value = response.json();
			if (value.status === 200) {
				this.numberOfItems = parseInt(value.data[0].rowsCount, 10);
			}

			return value;
		});
	}
	getNumberOfActiveOrders(): Observable<any> {
		return this.http.post('/api/orders-number-of-active-orders', '', {
			headers: new Headers({
				'Content-Type': 'application/json',
				'x-access-token': this.authenticationService.getUserToken()
			})
		}).map((response: Response) => response.json());
	}
	getItemsList(): Observable<any> {
		return this.http.post('/api/orders-list', '', {
			headers: new Headers({
				'Content-Type': 'application/json',
				'x-access-token': this.authenticationService.getUserToken()
			})
		}).map((response: Response) => response.json());
	}
}
