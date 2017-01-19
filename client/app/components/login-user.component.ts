import { Component } from '@angular/core';
import { Router }    from '@angular/router';

import { AuthenticationService } from '../services/authentication.service';

@Component({
	moduleId: module.id,
	selector: 'login-user-component',
	templateUrl: 'login-user.component.html'
})
export class LoginUserComponent {
	login: string;
	password: string;
	processing: boolean;

	constructor(
		private authenticationService: AuthenticationService,
		private router: Router
	) {
		this.processing = false;
		this.login = '';
		this.password = '';
	}
	doLogin(): void {
		console.log('LoginUserComponent.doLogin() start: ', this.login, this.password);
		this.processing = true;
		this.authenticationService.login(this.login, this.password).subscribe(data => {
			this.processing = false;
			console.log('LoginUserComponent.doLogin() subscribe:', data);
			if (this.authenticationService.getUserToken() !== '') {
				this.router.navigate(['/items-list']);
			}
			else {
				console.error('LoginUserComponent.doLogin() subscribe ale brak tokena:', data);
			}
		}, error => {
			this.processing = false;
			console.error('LoginUserComponent.doLogin() error:', error);
		});
	}
}
