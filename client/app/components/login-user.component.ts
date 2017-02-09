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
	dontRememberPassword(): void {
		alert('TODO: wysłanie e-maila ze zresetowanym hasłem'); // TODO:
	}
	doLogin(): void {
		if (this.checkForm()) {
			this.processing = true;
			this.authenticationService.login(this.login, this.password).subscribe((value: any) => {
				this.processing = false;
				if (value.status === 200) {
					this.authenticationService.setUserToken(value.data[0].token);
					this.router.navigate(['/items-list']);
				}
				else {
					this.messages.push(value.message);
				}
			}, (error: any) => {
				this.processing = false;
				this.messages.push(error);
			});
		}
	}
	doLogout(): void {
		this.processing = true;
		this.authenticationService.logout().subscribe((value: any) => {
			this.processing = false;
			if (value.status === 200) {
				this.authenticationService.setUserToken('');
				this.password = '';
				this.router.navigate(['/register']);
			}
			else {
				this.messages.push(value.message);
			}
		}, (error: any) => {
			this.processing = false;
			this.messages.push(error);
		});
	}
}
