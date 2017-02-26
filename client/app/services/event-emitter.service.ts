import { Injectable }  from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class EventEmitterService {
	private usersCartChangedSource: Subject<any>;
	public usersCartChangedStream: Observable<any>;
	private usersOrdersChangedSource: Subject<any>;
	public usersOrdersChangedStream: Observable<any>;

	constructor() {
		this.usersCartChangedSource = new Subject<any>();
		this.usersCartChangedStream = this.usersCartChangedSource.asObservable();

		this.usersOrdersChangedSource = new Subject<any>();
		this.usersOrdersChangedStream = this.usersOrdersChangedSource.asObservable();
	}
	confirmUsersCartChanged(value: any) {
		this.usersCartChangedSource.next(value);
	}
	confirmUsersOrdersChanged(value: any) {
		this.usersOrdersChangedSource.next(value);
	}
}
