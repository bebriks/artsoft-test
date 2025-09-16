import { Component, OnInit } from '@angular/core';
import { Company, SortOption, FilterOptions, CompaniesResponse } from '../../models/company.model';
import { CompanyService } from '../../services/company.service';
import { CompanyFilterComponent } from "../company-filter/company-filter.component";
import { CompanySortComponent } from "../company-sort/company-sort.component";
import { CompanyItemComponent } from "../company-item/company-item.component";
import { CommonModule } from '@angular/common';
import { LocalService } from '../../services/localstorage.service';
import { PaginationComponent } from '../pagination/pagination.component';

@Component({
  selector: 'app-company-list',
  styleUrl: './company-list.component.scss',
  template: `
    <section class="company-list">
      <header class="company-list__header">
        <h2 class="company-list__title">Список компаний</h2>
      </header>

      <div class="company-list__controls">
        <app-company-filter
          class="company-list__filter"
          (filterChange)="onFilterChange($event)">
        </app-company-filter>

        <app-company-sort
          class="company-list__sort"
          (sortChange)="onSortChange($event)">
        </app-company-sort>
      </div>

      @if (loading) {
        <div class="company-list__loading">
          Загрузка...
        </div>
      }

      <div class="company-list__content">
        @for (company of allCompanies; track company.id) {
          <app-company-item
            [company]="company"
            class="company-list__item">
          </app-company-item>
        } @empty {
          <p class="company-list__empty">
            Компании не найдены
          </p>
        }
      </div>
    </section>
    @if (allCompaniesData) {
      <app-pagination
        [page]="allCompaniesData!.page"
        [has_next]="allCompaniesData!.has_next"
        [has_prev]="allCompaniesData!.has_prev"
        [total_pages]="allCompaniesData!.total_pages"
        (pageChange)="onPageChange({ page: $event })"
      ></app-pagination>
    }
  `,
  imports: [CompanyFilterComponent, CompanySortComponent, CompanyItemComponent, CommonModule, PaginationComponent]
})
export class CompanyListComponent implements OnInit {
  allCompaniesData: CompaniesResponse | null = null;
  allCompanies: Company[] = [];
  filteredCompanies: Company[] = [];
  filteredAndSortedCompanies: Company[] = [];
  loading = true;

  private currentPage: { page: number } = { page: 1 }
  private currentSort: SortOption = { sort_by: 'id', sort_order: 'asc' };
  private currentFilter: FilterOptions = { q: '', company_type: '', industry: '' };

  constructor(private companyService: CompanyService, private localService: LocalService) {}

  async ngOnInit() {
    await this.loadCompanies();
  }

  async loadCompanies() {
    try {
      this.loading = true;
      this.currentFilter = await this.companyService.getFilters();
      this.currentSort = await this.companyService.getSorts();
      this.applyFiltersAndSort();
    } catch (error) {
      console.error('Error loading companies:', error);
      this.allCompanies = [];
    } finally {
      this.loading = false;
    }
  }

  onSortChange(sortOption: SortOption) {
    this.currentSort = sortOption;
    this.currentPage = { page: 1 };
    this.applyFiltersAndSort();
  }

  onFilterChange(filterOptions: FilterOptions) {
    this.currentFilter = filterOptions;
    console.log(this.currentFilter)
    this.currentPage = { page: 1 };
    this.applyFiltersAndSort();
  }

  onPageChange(page: { page: number }) {
    this.currentPage = page;
    this.applyFiltersAndSort();
  }

  async applyFiltersAndSort() {
    const params = {...this.currentFilter, ...this.currentSort, ...this.currentPage }
    this.allCompaniesData = await this.companyService.getCompanies(params);
    this.allCompanies = this.allCompaniesData!.data
  }
}
