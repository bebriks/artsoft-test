import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Company } from '../../models/company.model';
import { CompanyService } from '../../services/company.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-company-detail',
  imports: [CommonModule],
  styleUrl: './company-detail.component.scss',
  template: `
    @if (loading) {
      <div class="company-detail__loading">
        Загрузка...
      </div>
    }
    @if (company && !loading) {
      <article class="company-detail">
        <header class="company-detail__header">
          <img
            class="company-detail__logo"
            [src]="company!.logo"
            [alt]="company!.business_name"
            width="120"
            height="120"
          >

          <div class="company-detail__info">
            <h1 class="company-detail__title">
              {{ company!.suffix }} {{ company!.business_name }}
            </h1>

            <p class="company-detail__industry">
              {{ company!.industry }}
            </p>

            <p class="company-detail__slogan">
              {{ company!.catch_phrase }}
            </p>
          </div>
        </header>

        <section class="company-detail__content">
          <h2 class="company-detail__subtitle">Контактная информация</h2>

          <dl class="company-detail__details">
            <div class="company-detail__detail-item">
              <dt class="company-detail__detail-term">Тип:</dt>
              <dd class="company-detail__detail-definition">{{ company!.type }}</dd>
            </div>

            <div class="company-detail__detail-item">
              <dt class="company-detail__detail-term">Телефон:</dt>
              <dd class="company-detail__detail-definition">
                <a [href]="'tel:' + company!.phone_number" class="company-detail__link">
                  {{ company!.phone_number }}
                </a>
              </dd>
            </div>

            <div class="company-detail__detail-item">
              <dt class="company-detail__detail-term">Адрес:</dt>
              <dd class="company-detail__detail-definition">{{ company!.full_address }}</dd>
            </div>
          </dl>
        </section>

        <footer class="company-detail__footer">
          <a
            routerLink="/list"
            class="company-detail__back-link"
            aria-label="Вернуться к списку компаний"
            (click)="navigateToList()"
          >
            ← Назад к списку
          </a>
        </footer>
      </article>
    }
    @if (!company && !loading) {
      <div class="company-detail__error">
        Компания не найдена
      </div>
    }
  `
})
export class CompanyDetailComponent implements OnInit {
  company: Company | null = null;
  loading = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private companyService: CompanyService
  ) { }

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      await this.loadCompany(parseInt(id));
    }
  }

  async loadCompany(id: number) {
    try {
      this.loading = true;
      this.company = await this.companyService.getCompanyById(id);
    } catch (error) {
      console.error('Error loading company:', error);
      this.company = null;
    } finally {
      this.loading = false;
    }
  }

  navigateToList() {
    return this.router.navigate(['/list'])
  }
}
