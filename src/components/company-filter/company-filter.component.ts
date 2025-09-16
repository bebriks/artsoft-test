import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FilterOptions, Industry, Type } from '../../models/company.model';
import { CompanyService } from '../../services/company.service';
import { CommonModule } from '@angular/common';
import { LocalService } from '../../services/localstorage.service';

@Component({
  selector: 'app-company-filter',
  imports: [CommonModule, ReactiveFormsModule],
  styleUrl: './company-filter.component.scss',
  template: `
    <form [formGroup]="filterForm" class="company-filter">
      <div class="company-filter__group">
        <label class="company-filter__label">Поиск по названию:</label>
        <input
          class="company-filter__input"
          type="text"
          formControlName="q"
          placeholder="Введите название..."
          aria-label="Поиск по названию компании"
        >
      </div>

      <div class="company-filter__group">
        <label class="company-filter__label">Тип компании:</label>
        <select
          class="company-filter__select"
          formControlName="company_type"
          aria-label="Выберите тип компании"
        >
          <option value="">Все типы</option>
          @for (type of uniqueTypes; track $index) {
            <option [value]="type">{{ type }}</option>
          }
        </select>
      </div>

      <div class="company-filter__group">
        <label class="company-filter__label">Вид деятельности:</label>
        <select
          class="company-filter__select"
          formControlName="industry"
          aria-label="Выберите вид деятельности"
        >
          <option value="">Все виды</option>
          @for (industry of uniqueIndustries; track $index) {
            <option [value]="industry">{{ industry }}</option>
          }
        </select>
      </div>
    </form>
  `
})
export class CompanyFilterComponent implements OnInit {
  @Output() filterChange = new EventEmitter<FilterOptions>();

  filterForm: FormGroup;
  uniqueTypes: Type[] | null = [];
  uniqueIndustries: Industry[] | null = [];

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private localService: LocalService
  ) {
    this.filterForm = this.fb.group({
      q: [''],
      company_type: [''],
      industry: [''],
    });
  }

  async ngOnInit() {
    try {
      this.loadFiltersFromStorage();

      [this.uniqueTypes, this.uniqueIndustries] = await Promise.all([
        this.companyService.getUniqueTypes(),
        this.companyService.getUniqueIndustries()
      ]);
    } catch (error) {
      console.error('Ошибка при загрузке данных фильтра:', error);
    }

    this.filterForm.valueChanges.subscribe(values => {
      this.filterChange.emit(values);
      this.saveFiltersToStorage(values);
    });
  }

  private loadFiltersFromStorage(): void {
    const savedFilters = this.localService.getData('filters');
    if (savedFilters) {
      try {
        const filters = JSON.parse(savedFilters);
        this.filterForm.patchValue(filters);
      } catch (error) {
        console.error('Ошибка при парсинге фильтров из localStorage:', error);
        this.localService.removeData('filters');
      }
    }
  }

  private saveFiltersToStorage(filters: FilterOptions): void {
    try {
      this.localService.saveData('filters', JSON.stringify(filters));
    } catch (error) {
      console.error('Ошибка при сохранении фильтров в localStorage:', error);
    }
  }

  resetFilters(): void {
    this.filterForm.reset({
      q: '',
      company_type: '',
      industry: ''
    });
    this.localService.removeData('filters');
  }
}
