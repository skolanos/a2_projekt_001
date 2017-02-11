import { Injectable }  from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class EventEmitterService {
	private usersCartChangedSource: Subject<any>;
	public usersCartChangedStream: Observable<any>;

	constructor() {
		this.usersCartChangedSource = new Subject<any>();
		this.usersCartChangedStream = this.usersCartChangedSource.asObservable();
	}
	confirmUsersCartChanged(value: any) {
		this.usersCartChangedSource.next(value);
	}
}
