import { Component } from '@angular/core';
import { Router }    from '@angular/router';

import { AuthenticationService } from '../services/authentication.service';

@Component({
	moduleId: module.id,
	selector: 'login-form',
	templateUrl: 'login.component.html'
})
export class LoginComponent {
	login: string;
	password: string;

	constructor(
		private authenticationService: AuthenticationService,
		private router: Router
	) {
		this.login = '';
		this.password = '';
	}
	doLogin(): void {
		console.log('LoginComponent.doLogin(): ', this.login, this.password);
		this.authenticationService.login(this.login, this.password).subscribe(data => {
			console.log('LoginComponent.doLogin():', data);
			if (this.authenticationService.getUserToken() !== '') {
				this.router.navigate(['/main']);
			}
			else {
				console.error('LoginComponent.doLogin() error:', data.message);
			}
		}, error => {
			console.error('LoginComponent.doLogin() error:', error);
		});
	}
}
