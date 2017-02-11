import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { EventEmitterService } from '../services/event-emitter.service';
import { AuthenticationService } from '../services/authentication.service';

@Component({
	moduleId: module.id,
	selector: 'navbar-component',
	templateUrl: 'navbar.component.html'
})
export class NavbarComponent implements OnDestroy {
	private subscription: Subscription;

	constructor(
		private eventEmitterService: EventEmitterService,
		private authenticationService: AuthenticationService
	) {
		this.subscription = this.eventEmitterService.usersCartChangedStream.subscribe((value: any) => {
			console.log('Otrzymano zdarzenie, należy pobrać informację o ilości towarów w koszyku i włączyć link', value);
		});
	}
	ngOnDestroy() {
		this.subscription.unsubscribe();
	}
}
