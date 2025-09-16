import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { SortOption } from '../../models/company.model';
import { LocalService } from '../../services/localstorage.service';
import { CompanyService } from '../../services/company.service';

@Component({
  selector: 'app-company-sort',
  styleUrl: './company-sort.component.scss',
  template: `
    <div class="company-sort">
      <label class="company-sort__label">Сортировать по:</label>

      <select
        class="company-sort__select"
        [value]="getSelectedValue()"
        (change)="onSortChange($event)"
        aria-label="Выберите поле для сортировки"
      >
        <option value="id:asc">ID (А-Я)</option>
        <option value="id:desc">ID (Я-А)</option>
        <option value="name:asc">Названию (А-Я)</option>
        <option value="name:desc">Названию (Я-А)</option>
        <option value="type:asc">Типу (А-Я)</option>
        <option value="type:desc">Типу (Я-А)</option>
        <option value="industry:asc">Виду деятельности (А-Я)</option>
        <option value="industry:desc">Виду деятельности (Я-А)</option>
      </select>
    </div>
  `
})
export class CompanySortComponent implements OnInit {
  sorts: SortOption = {sort_by: 'id', sort_order: 'asc'}
  @Output() sortChange = new EventEmitter<SortOption>();

  constructor(private companyService: CompanyService, private localService: LocalService) {}

  async ngOnInit() {
    return await this.loadSortsFromStorage()
  }

  async loadSortsFromStorage() {
    this.sorts = await this.companyService.getSorts()
  }

  async onSortChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const [sort_by, sort_order] = select.value.split(':') as [string, 'asc' | 'desc'];
    let sortData = { sort_by, sort_order }
    this.sortChange.emit(sortData);
    this.localService.saveData('sorts', JSON.stringify(sortData))
    this.loadSortsFromStorage()
  }
  getSelectedValue() {
    return `${this.sorts.sort_by}:${this.sorts.sort_order}`;
  }
}
