import { Component } from '@angular/core';

import { AuthenticationService } from '../services/authentication.service';

@Component({
	moduleId: module.id,
	selector: 'register-user-form',
	templateUrl: 'register-user.component.html'
})
export class RegisterUserComponent {
	firstName: string;
	surname: string;
	email: string;
	password: string;
	messages: string[];

	constructor(private authenticationService: AuthenticationService) {
		this.firstName = '';
		this.surname = '';
		this.email = '';
		this.password = '';
		this.messages = [];
	}
	checkForm(): boolean {
		var res: boolean = true;

		this.messages = [];
		if (this.firstName === '') {
			res = false;
			this.messages.push('Proszę wprowadzić wartość do pola "Imię".');
		}
		if (this.surname === '') {
			res = false;
			this.messages.push('Proszę wprowadzić wartość do pola "Nazwisko".');
		}
		if (this.email === '') {
			res = false;
			this.messages.push('Proszę wprowadzić wartość do pola "E-mail".');
		}
		if (this.password === '') {
			res = false;
			this.messages.push('Proszę wprowadzić wartość do pola "Hasło".');
		}

		return res;
	}
	doRegister(): void {
		if (this.checkForm()) {
			this.authenticationService.register(this.firstName, this.surname, this.email, this.password).subscribe(data => {
				console.log('LoginComponent.register():', data);
				if (data.status === 200) {
					this.authenticationService.login(this.email, this.password).subscribe(data => {
						console.log('LoginComponent.login():', data);
					}, error => {
						console.error('LoginComponent.login() error:', error);
					});
				}
				else {
					this.messages.push(data.message);
				}
			}, error => {
				console.error('LoginComponent.register() error:', error);
				this.messages.push(error);
			});
		}
	}
}
