import { Injectable } from '@angular/core';
import { Http }       from '@angular/http';
import { Headers }    from '@angular/http';
import { Response }   from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { AuthenticationService } from './authentication.service';

@Injectable()
export class ItemsService {
	constructor(
		private http: Http,
		private authenticationService: AuthenticationService) {
	}
	getList(dataOffset: number, dataLimit: number): Observable<any> {
		return this.http.post('/api/items-list', JSON.stringify({
			dataOffset: dataOffset,
			dataLimit: dataLimit
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
}
