import { Component} from '@angular/core';

import { AuthenticationService } from '../services/authentication.service';

@Component({
	moduleId: module.id,
	selector: 'navbar-component',
	templateUrl: 'navbar.component.html'
})
export class NavbarComponent {
	constructor(private authenticationService: AuthenticationService) {
	}
}
