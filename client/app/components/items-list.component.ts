import { Component, OnInit } from '@angular/core';

import { Item } from '../types/item.type';

import { ItemsService } from '../services/items.service';

interface PageSizeItem {
	value: number;
	caption: string;
}
interface PageItem {
	offset: number;
	pageNo: number;
	caption: string;
}

@Component({
	moduleId: module.id,
	selector: 'items-list-component',
	templateUrl: 'items-list.component.html',
})
export class ItemsListComponent implements OnInit {
	private processing: boolean;
	private messages: string[];
	private rowsCount: number;
	private currentPage: number;
	private lastPage: number;
	private dataOffset: number;
	private dataLimit: number;
	private pageSize: string;
	private pageSizeItems: PageSizeItem[];
	private pagesItems: PageItem[];
	private items: Item[];
	private categories: any[];
	private selectedItem: Item;
	private filterItemName: string;
	private filterCategory: string;

	constructor(private itemsService: ItemsService) {
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
		this.lastPage = 0;
		this.dataOffset = 0;
		this.dataLimit = 10;
		this.pageSize = this.dataLimit.toString();
		this.items = [];
		this.categories = [];
		this.selectedItem = undefined;
		this.messages = [];
		this.filterItemName = '';
		this.filterCategory = '';
	}
	ngOnInit(): void {
		this.getCategoriesList();
		this.getItemsList();
	}
	private mapDataRows(rows: any[]): void {
		// przepisanie danych do tablicy obiektów na których dziala komponent
		// (mają inną strukturę niż obiekty z serwera)
		if (rows.length > 0) {
			this.items = rows.map((element: any) => {
				return {
					id: element.id,
					name: element.nazwa,
					link: element.link,
					categoryId: element.kat_id,
					category: element.kat_nazwa
				};
			});
		}
		else {
			this.items = [];
		}
	}
	private calculatePagesItems(): void {
		let maxElementsCount: number;
		let halfElementsCount: number;
		let firstPage: number;
		let i: number;

		// maksymalna liczba elementów w nawigatorze
		maxElementsCount = 10;
		halfElementsCount = Math.ceil(maxElementsCount / 2);

		this.pagesItems = [];
		// strony na lewo od oktualnej strony
		for (i = this.currentPage - halfElementsCount; i < this.currentPage; i += 1) {
			if (i >= 0) {
				this.pagesItems.push({
					offset: i * this.dataLimit,
					pageNo: i,
					caption: String(i + 1)
				});
			}
		}
		// aktualna strona
		i = this.currentPage;
		this.pagesItems.push({
			offset: i * this.dataLimit,
			pageNo: i,
			caption: String(i + 1)
		});
		// strony na prawo od aktualnej strony (jeżeli jest taka możliwość
		// to dopełnienie do 10-ciu elementów)
		for (i = this.currentPage + 1; i < this.currentPage + maxElementsCount; i += 1) {
			if ((i < this.lastPage) && (this.pagesItems.length < maxElementsCount)) {
				this.pagesItems.push({
					offset: i * this.dataLimit,
					pageNo: i,
					caption: String(i + 1)
				});
			}
		}

		// jeżeli jesteśmy pod koniec dostępnych paczek to może się zdarzyć,
		//  że nie udalo się dopełnić do 10 z prawej strony więc staramy się
		// dopełnić z lewej
		if (this.pagesItems.length < maxElementsCount) {
			firstPage = this.pagesItems[0].pageNo;
			if (firstPage > 0) {
				for (i = firstPage - 1; i > firstPage - maxElementsCount; i -= 1) {
					if ((i >= 0) && (this.pagesItems.length < maxElementsCount)) {
						this.pagesItems.unshift({
							offset: i * this.dataLimit,
							pageNo: i,
							caption: String(i + 1)
						});
					}
				}
			}
		}
	}
	getCategoriesList(): void {
		this.processing = true;
		this.itemsService.getCategoriesList().subscribe((value: any) => {
			this.processing = false;
			if (value.status === 200) {
				this.categories = value.data;
			}
			else {
				this.messages.push(value.message);
			}
		}, error => {
			this.processing = false;
			console.log('ItemsListComponent.getItemsList() error:', error);
			this.messages.push(error);
		});
	}
	getItemsList(): void {
		this.processing = true;
		this.itemsService.getItemsList(this.dataOffset, this.dataLimit, {
			itemName: this.filterItemName,
			categoryId: this.filterCategory
		}).subscribe((value: any) => {
			this.processing = false;
			if (value.status === 200) {
				this.rowsCount = Number(value.data.rowsCount);
				this.lastPage = Math.ceil(this.rowsCount / this.dataLimit);
				this.mapDataRows(value.data.rows);
				this.calculatePagesItems();
			}
			else {
				this.messages.push(value.message);
			}
		}, error => {
			this.processing = false;
			console.log('ItemsListComponent.getItemsList() error:', error);
			this.messages.push(error);
		});
	}
	pageSizeChange(): void {
		this.dataOffset = 0;
		this.currentPage = 0;
		this.dataLimit = parseInt(this.pageSize, 10);

		this.getItemsList();
	}
	getPrevPage(): void {
		if ((this.dataOffset - this.dataLimit) >= 0) {
			this.dataOffset -= this.dataLimit;
			this.currentPage -= 1;

			this.getItemsList();
		}
	}
	getNextPage(): void {
		if ((this.dataOffset + this.dataLimit) < this.rowsCount) {
			this.dataOffset += this.dataLimit;
			this.currentPage += 1;

			this.getItemsList();
		}
	}
	getPageData(pageItem: any): void {
		this.dataOffset = pageItem.offset;
		this.currentPage = pageItem.pageNo;

		this.getItemsList();
	}
	selectItemClick(item: Item): void {
		this.selectedItem = item;
	}
	filtrItemNameChange(): void {
		this.dataOffset = 0;
		this.currentPage = 0;
		this.getItemsList();
	}
	filterCategoryChange(): void {
		this.dataOffset = 0;
		this.currentPage = 0;
		this.getItemsList();
	}
}
