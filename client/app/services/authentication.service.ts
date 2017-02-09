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
		this.userToken = '';
	}
	register(firstName: string, surname: string, email: string, password: string): Observable<Response> {
		return this.http.post('/api/user-register', JSON.stringify({
			firstName: firstName,
			surname: surname,
			email: email,
			password: password
		}), {
			headers: new Headers({ 'Content-Type': 'application/json' })
		}).map((response: Response) => response.json());
	}
	login(email: string, password: string): Observable<Response> {
		return this.http.post('/api/user-login', JSON.stringify({
			email: email,
			password: password
		}), {
			headers: new Headers({ 'Content-Type': 'application/json' })
		}).map((response: Response) => response.json());
	}
	logout(): Observable<Response> {
		return this.http.post('/api/user-logout', JSON.stringify({
			nodata: 'nodata'
		}), {
			headers: new Headers({
				'Content-Type': 'application/json',
				'x-accss-token': this.getUserToken()
			})
		}).map((response: Response) => response.json());
	}
	setUserToken(userToken: string): void {
		this.userToken = userToken;
	}
	getUserToken(): string {
		return this.userToken;
	}
}
