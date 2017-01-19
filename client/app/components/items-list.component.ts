import { Component } from '@angular/core';
import { OnInit }    from '@angular/core';

import { AuthenticationService } from '../services/authentication.service';
import { ItemsService }          from '../services/items.service';

@Component({
	moduleId: module.id,
	selector: 'items-list-component',
	templateUrl: 'items-list.component.html',
})
export class ItemsListComponent  implements OnInit {
	processing: boolean;
	messages: string[];
	dataOffset: number;
	dataLimit: number;
	items: any[];

	constructor(
		private authenticationService: AuthenticationService,
		private itemsService: ItemsService
	) {
		this.processing = false;
		this.dataOffset = 0;
		this.dataLimit = 10;
		this.items = [];
		this.messages = [];
	}
	ngOnInit(): void {
		this.getItemsList();
	}
	getItemsList(): void {
		console.log('ItemsListComponent.getItemsList()');
		this.processing = true;
		this.itemsService.getList(this.dataOffset, this.dataLimit).subscribe(data => {
			var i: number = 0;

			console.log('ItemsListComponent.getItemsList() subscribe:', data);
			this.processing = false;
			this.items = [];
			for (i = 0; i < data.data.length; i += 1) {
				this.items.push({
					id:         data.data[i].id,
					name:       data.data[i].nazwa,
					link:       data.data[i].link,
					categoryId: data.data[i].kat_id,
					category:   data.data[i].kat_nazwa
				});
			}
		}, error => {
			this.processing = false;
			console.log('ItemsListComponent.getItemsList() error:', error);
		});
	}
}
