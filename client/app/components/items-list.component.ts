import { Component } from '@angular/core';
import { OnInit } from '@angular/core';

import { AuthenticationService } from '../services/authentication.service';
import { ItemsService } from '../services/items.service';

@Component({
	moduleId: module.id,
	selector: 'items-list-component',
	templateUrl: 'items-list.component.html',
})
export class ItemsListComponent implements OnInit {
	processing: boolean;
	messages: string[];
	rowsCount: number;
	currentPage: number;
	dataOffset: number;
	pageSize: number;
	pageSizeItems: any[];
	pagesItems: any[];
	items: any[];

	constructor(
		private authenticationService: AuthenticationService,
		private itemsService: ItemsService
	) {
		this.processing = false;
		this.pageSizeItems = [
			{ value: 10, caption: '10' },
			{ value: 25, caption: '25' },
			{ value: 50, caption: '50' },
			{ value: 100, caption: '100' }
		];
		this.pagesItems = [];
		this.rowsCount = 0;
		this.currentPage = 0;
		this.dataOffset = 0;
		this.pageSize = 10;
		this.items = [];
		this.messages = [];
	}
	ngOnInit(): void {
		this.getItemsList();
	}
	private mapDataRows(rows: any[]): void {
		var i: number = 0;

		// przepisanie danych do tablicy obiektów na których dziala komponent (mają inną strukturę niż obiekty z serwera)
		this.items = [];
		for (i = 0; i < rows.length; i += 1) {
			this.items.push({
				id: rows[i].id,
				name: rows[i].nazwa,
				link: rows[i].link,
				categoryId: rows[i].kat_id,
				category: rows[i].kat_nazwa
			});
		}
	}
	private calculatePagesItems(): void {
		var i: number,
		lastPageNo: number,
		maxElementsCount: number,
		firstPage: number;

		// maksymalna liczba elementów w nawigatorze
		maxElementsCount = 10;
		// numer ostatniej strony
		lastPageNo = Math.ceil(this.rowsCount / this.pageSize);

		this.pagesItems = [];
		// strony na lewo od oktualnej strony
		for (i = this.currentPage - 5; i < this.currentPage; i += 1) {
			if (i >= 0) {
				this.pagesItems.push({
					offset: i * this.pageSize,
					pageNo: i,
					caption: i + 1
				});
			}
		}
		// aktualna strona
		i = this.currentPage;
		this.pagesItems.push({
			offset: i * this.pageSize,
			pageNo: i,
			caption: '#' + (i + 1) + '#'
		});
		// strony na prawo od aktualnej strony (jeżeli jest taka możliwość to dopelnienie do 10-ciu elementów)
		for (i = this.currentPage + 1; i < this.currentPage + maxElementsCount; i += 1) {
			if ((i < lastPageNo) && (this.pagesItems.length < maxElementsCount)) {
				this.pagesItems.push({
					offset: i * this.pageSize,
					pageNo: i,
					caption: i + 1
				});
			}
		}

		// jeżeli jesteśmy pod koniec dostępnych paczek to może się zdarzyć że nie udalo się dopelnić do 10 z prawej strony więc staramy się dopelnić z lewej
		if (this.pagesItems.length < maxElementsCount) {
			firstPage = this.pagesItems[0].pageNo;
			if (firstPage > 0) {
				for (i = firstPage - 1; i > firstPage - maxElementsCount; i -= 1) {
					if ((i >= 0) && (this.pagesItems.length < maxElementsCount)) {
						this.pagesItems.unshift({
							offset: i * this.pageSize,
							pageNo: i,
							caption: i + 1
						});
					}
				}
			}
		}
	}
	getItemsList(): void {
		console.log('ItemsListComponent.getItemsList()');
		this.processing = true;
		this.itemsService.getList(this.dataOffset, this.pageSize).subscribe(data => {
			//console.log('ItemsListComponent.getItemsList() subscribe:', data);
			this.processing = false;
			this.rowsCount = data.data.rowsCount;
			this.mapDataRows(data.data.rows);
			this.calculatePagesItems();
		}, error => {
			this.processing = false;
			//console.log('ItemsListComponent.getItemsList() error:', error);
		});
	}
	pageSizeChange(): void {
		this.currentPage = 0;

		this.getItemsList();
	}
	getPrevPage(): void {
		if ((this.dataOffset - this.pageSize) >= 0) {
			this.dataOffset -= this.pageSize;
			this.currentPage -= 1;

			this.getItemsList();
		}
	}
	getNextPage(): void {
		if ((this.dataOffset + this.pageSize) < this.rowsCount) {
			this.dataOffset += this.pageSize;
			this.currentPage += 1;

			this.getItemsList();
		}
	}
	getPageData(pageItem: any): void {
		this.dataOffset = pageItem.offset;
		this.currentPage = pageItem.pageNo;

		this.getItemsList();
	}
}
