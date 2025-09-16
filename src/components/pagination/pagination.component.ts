import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompaniesResponse } from '../../models/company.model';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  styleUrl: './pagination.component.scss',
  template: `
    <div class="pagination">
      <button
        class="pagination__btn pagination__btn--prev"
        [disabled]="has_prev === false || page === 1"
        (click)="goToPage(page - 1)"
        aria-label="Предыдущая страница"
      >
        ←
      </button>

      <span class="pagination__info">
        {{ page }} / {{ total_pages }}
      </span>

      <button
        class="pagination__btn pagination__btn--next"
        [disabled]="has_next === false"
        (click)="goToPage(page + 1)"
        aria-label="Следующая страница"
      >
        →
      </button>
    </div>
  `
})

export class PaginationComponent {
  @Input() page: number = 1;
  @Input() total_pages: number = 0;
  @Input() has_next: boolean = true;
  @Input() has_prev: boolean = false;

  @Output() pageChange = new EventEmitter<number>();

  goToPage(page: number) {
    this.page = page
    this.pageChange.emit(this.page)
  }
}
