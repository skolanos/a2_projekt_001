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
	processing: boolean;
	messages: string[];

	constructor(
		private authenticationService: AuthenticationService,
		private router: Router
	) {
		this.processing = false;
		this.firstName = '';
		this.surname = '';
		this.email = '';
		this.password = '';
		this.messages = [];
	}
	checkForm(): boolean {
		let res: boolean = true;

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
			this.processing = true;
			this.authenticationService.register(this.firstName, this.surname, this.email, this.password).subscribe((data: any) => {
				this.processing = false;
				if (data.status === 200) {
					this.authenticationService.login(this.email, this.password).subscribe((data: any) => {
						if (data.status === 200) {
							//this.authenticationService.setUserToken(data.data[0].token);
							this.router.navigate(['/items-list']);
						}
						else {
							this.messages.push(data.message);
						}
					}, error => {
						console.log('RegisterUserComponent.doRegister().login() error:', error);
						this.messages.push(error);
					});
				}
				else {
					this.messages.push(data.message);
				}
			}, error => {
				this.processing = false;
				console.log('RegisterUserComponent.doRegister() error:', error);
				this.messages.push(error);
			});
		}
	}
}
