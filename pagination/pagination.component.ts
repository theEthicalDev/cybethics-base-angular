import {Component, EventEmitter, Input, Output} from '@angular/core';
import {PageableFilter} from './pageable-filter';
import {Page} from './page';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  standalone: false,
})
export class PaginationComponent {

  options: number[] = [10, 25, 50, 100];

  private pageSeparator = '...';

  @Output() pageChanged: EventEmitter<PageableFilter> = new EventEmitter();

  @Input()
  set pageResults(page: Page<any> | null | undefined) {
    this.showPagination = false;
    if (!page) return;
    this.currentPage = page.number + 1;
    this.itemsPerPage = page.size;
    this.totalItems = page.totalElements;
    this.pages = this.getPages(page);
    if (this.totalItems > this.getSmallestOption()) {
      this.showPagination = true;
    }
  }

  /**
   * Example: 1 2 ... 5 6 7 ... 99 100 (totalPages = 100, number = 6)
   * Example: 1 2 ... 16 17 18 ... 19 20 (totalPages = 20, number = 18)
   * Example: 1 2 ... 598 599 600 ... 760 761 (totalPages = 761, number = 599)
   * Example: 1 2 ... 9 10 11 ... 19 20 (totalPages = 20, number = 3)
   * Example: 1 2 ... 9 10 11 ... 19 20 (totalPages = 20, number = 19)
   * Example: 1 2 ... 9 10 11 ... 19 20 (totalPages = 20, number = 20)
   * Example (no dots): 1 2 3 4 5 6 7 8 9 10 (totalPages = 10, number = 6)
   * Example (no dots): 1 2 3 4 5 6 7 8 9 10 (totalPages = 10, number = 10)
   */
  private getPages(page: Page<any>) {
    if (page.totalPages <= 10) {
      return Array.from({length: page.totalPages}, (v, k) => k + 1);
    }
    const startPages = [1, 2];
    const endPages = [page.totalPages - 1, page.totalPages];
    const middlePage = page.number > 2 && page.number < page.totalPages - 2 ? page.number + 1 : Math.ceil(page.totalPages / 2);
    let middlePages: number[];
    if (page.number === 2) {
      middlePages = [3, 4, 5];
    }
    else if (page.number === page.totalPages - 3) {
      middlePages = [page.totalPages - 4, page.totalPages - 3, page.totalPages - 2];
    }
    else {
      middlePages = [middlePage - 1, middlePage, middlePage + 1];
    }
    return [...startPages, this.pageSeparator, ...middlePages, this.pageSeparator, ...endPages];
  }

  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  pages: any[];
  showPagination = false;

  changeCurrentPage(page: any): void {
    if (page instanceof String && page === this.pageSeparator) {
      return;
    }
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.pageChanged.emit({pageNumber: this.currentPage, pageSize: this.itemsPerPage});
    }
  }

  changePageSize(pageSizeString: string): void {
    const pageSize = parseInt(pageSizeString, 10);
    if (pageSize !== this.itemsPerPage) {
      this.currentPage = 1;
      this.itemsPerPage = pageSize;
      this.pageChanged.emit({pageNumber: this.currentPage, pageSize: this.itemsPerPage});
    }
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  private getSmallestOption(): number {
    return Math.min(...this.options);
  }

}
