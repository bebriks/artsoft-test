import { Routes } from '@angular/router';
import { CompanyListComponent } from '../components/company-list/company-list.component';
import { CompanyDetailComponent } from '../components/company-detail/company-detail.component';
import { CompanyYandexMapComponent } from '../components/company-yandex-map/company-yandex-map.component';

export const routes: Routes = [
  { path: '', component: CompanyListComponent },
  { path: 'list', component: CompanyListComponent },
  { path: 'detail/:id', component: CompanyDetailComponent },
  { path: 'map', component: CompanyYandexMapComponent }
];
