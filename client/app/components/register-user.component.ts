import { Component } from '@angular/core';
import { Router }    from '@angular/router';

import { AuthenticationService } from '../services/authentication.service';

@Component({
	moduleId: module.id,
	selector: 'register-user-component',
	templateUrl: 'register-user.component.html'
})
export class RegisterUserComponent {
	firstName: string;
	surname: string;
	email: string;
	password: string;
	processiong: boolean;
	messages: string[];

	constructor(
		private authenticationService: AuthenticationService,
		private router: Router
	) {
		this.processiong = false;
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
		console.log('RegisterUserComponent.doRegister() start:');
		if (this.checkForm()) {
			this.processiong = true;
			this.authenticationService.register(this.firstName, this.surname, this.email, this.password).subscribe(data => {
				this.processiong = false;
				console.log('RegisterUserComponent.doRegister() subscribe:', data);
				if (data.status === 200) {
					this.authenticationService.login(this.email, this.password).subscribe(data => {
						console.log('RegisterUserComponent.doRegister().login():', data);
						if (this.authenticationService.getUserToken() !== '') {
							this.router.navigate(['/items-list']);
						}
						else {
							console.error('RegisterUserComponent.doRegister().login() subscribe ale brak tokena:', data);
						}
					}, error => {
						console.error('RegisterUserComponent.doRegister().login() error:', error);
					});
				}
				else {
					this.messages.push(data.message);
				}
			}, error => {
				this.processiong = false;
				console.error('RegisterUserComponent.doRegister() error:', error);
				this.messages.push(error);
			});
		}
	}
}
