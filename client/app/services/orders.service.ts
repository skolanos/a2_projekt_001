import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { AuthenticationService } from './authentication.service';

@Injectable()
export class OrdersService {
	constructor(
		private http: Http,
		private authenticationService: AuthenticationService
	) {}
	getNumberOfOrders(): Observable<any> {
		return this.http.post('/api/orders-number-of-orders', '', {
			headers: new Headers({
				'Content-Type': 'application/json',
				'x-accss-token': this.authenticationService.getUserToken()
			})
		}).map((response: Response) => response.json());
	}
	getNumberOfActiveOrders(): Observable<any> {
		return this.http.post('/api/orders-number-of-active-orders', '', {
			headers: new Headers({
				'Content-Type': 'application/json',
				'x-accss-token': this.authenticationService.getUserToken()
			})
		}).map((response: Response) => response.json());
	}
}
