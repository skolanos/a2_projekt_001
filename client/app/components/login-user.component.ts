import { Component } from '@angular/core';
import { Router }    from '@angular/router';

import { AuthenticationService } from '../services/authentication.service';

@Component({
	moduleId: module.id,
	selector: 'login-user-component',
	templateUrl: 'login-user.component.html',
	styleUrls: ['login-user.component.css']
})
export class LoginUserComponent {
	login: string;
	password: string;
	processing: boolean;
	messages: string[];

	constructor(
		private authenticationService: AuthenticationService,
		private router: Router
	) {
		this.processing = false;
		this.login = '';
		this.password = '';
		this.messages = [];
	}
	checkForm(): boolean {
		var res: boolean = true;

		this.messages = [];
		if (this.login === '') {
			res = false;
			this.messages.push('Proszę wprowadzić wartość do pola "Adres e-mail".');
		}
		if (this.password === '') {
			res = false;
			this.messages.push('Proszę wprowadzić wartość do pola "Hasło".');
		}

		return res;
	}
	doLogin(): void {
		if (this.checkForm()) {
			this.processing = true;
			this.authenticationService.login(this.login, this.password).subscribe(data => {
				this.processing = false;
				if (data.status === 200) {
					this.authenticationService.setUserToken(data.data[0].token);
					this.router.navigate(['/items-list']);
				}
				else {
					this.messages.push(data.message);
				}
			}, error => {
				this.processing = false;
				this.messages.push(error);
			});
		}
	}
}
