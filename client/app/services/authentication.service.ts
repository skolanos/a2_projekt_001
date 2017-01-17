import { Injectable } from '@angular/core';
import { Http }       from '@angular/http';
import { Headers }    from '@angular/http';
import { Response }   from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthenticationService {
	userToken: string;

	constructor(private http: Http) {
		console.log('AuthenticationService.constructor()');
		this.userToken = '';
	}
	register(firstName: string, surname: string, email: string, password: string) {
		console.log('AuthenticationService.register()');

		return this.http.post('/api/user-register', JSON.stringify({
			firstName: firstName,
			surname: surname,
			email: email,
			password: password
		}), {
			headers: new Headers({ 'Content-Type': 'application/json' })
		}).map((response: Response) => response.json());
	}
	login(email: string, password: string): Observable<any> {
		console.log('AuthenticationService.login()');

		var observable: Observable<any>  = this.http.post('/api/user-login', JSON.stringify({
			email: email,
			password: password
		}), {
			headers: new Headers({ 'Content-Type': 'application/json' })
		}).map((response: Response) => response.json());

		observable.subscribe(data => {
			if (data.status === 200) {
				this.userToken = data.data[0].token;
			}
		}, error => {});

		return observable;
	}
	getUserToken(): string {
		return this.userToken;
	}
}
