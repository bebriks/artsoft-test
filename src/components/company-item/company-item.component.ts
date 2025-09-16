import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Company } from '../../models/company.model';

@Component({
  selector: 'app-company-item',
  styleUrl: './company-item.component.scss',
  template: `
    <article class="company-item" (click)="navigateToDetail()">
      <img
        class="company-item__logo"
        [src]="company.logo"
        [alt]="company.business_name"
      >

      <div class="company-item__content">
        <h3 class="company-item__title">
          {{ company.suffix }} "{{ company.business_name }}"
        </h3>

        <p class="company-item__industry">
          {{ company.industry }}
        </p>

        <p class="company-item__type">
          {{ company.type }}
        </p>
      </div>
    </article>
  `
})
export class CompanyItemComponent {
  @Input() company!: Company;

  constructor(private router: Router) {}

  navigateToDetail() {
    this.router.navigate(['/detail', this.company.id]);
  }
}
