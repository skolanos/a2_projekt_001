import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthenticationService {
	private userToken: string;

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
		}).map((response: Response) => {
			let value = response.json();
			if (value.status === 200) {
				this.setUserToken(value.data[0].token);
				localStorage.setItem('userToken', this.userToken);
			}

			return value;
		});
	}
	logout(): Observable<Response> {
		return this.http.post('/api/user-logout', JSON.stringify({
			nodata: 'nodata'
		}), {
			headers: new Headers({
				'Content-Type': 'application/json',
				'x-access-token': this.getUserToken()
			})
		}).map((response: Response) => {
			let value = response.json();
			if (value.status === 200) {
				this.setUserToken('');
				localStorage.removeItem('userToken');
			}

			return value;
		});
	}
	loginByToken(userToken: string): Observable<any> {
		return this.http.post('/api/user-login-by-token', '', {
			headers: new Headers({
				'Content-Type': 'application/json',
				'x-access-token': userToken
			})
		}).map((response: Response) => {
			let value = response.json();
			if (value.status === 200) {
				this.setUserToken(value.data[0].token);
				localStorage.setItem('userToken', this.userToken);
			}

			return value;
		});
	}
	setUserToken(userToken: string): void {
		this.userToken = userToken;
	}
	getUserToken(): string {
		return this.userToken;
	}
}
