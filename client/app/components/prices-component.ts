import { Component } from '@angular/core';
import { Input }     from '@angular/core';

import { Item } from '../types/item.type';

@Component({
	moduleId: module.id,
	selector: 'prices-component',
	templateUrl: 'prices-component.html'
})
export class PricesComponent {
	@Input()
	item: Item;

	constructor() {}
}
