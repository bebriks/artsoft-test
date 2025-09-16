import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../../services/company.service';
import { LocalService } from '../../services/localstorage.service';
import { Company, YandexMark } from '../../models/company.model';
import { CompanyListComponent } from '../company-list/company-list.component';
import { CompanyItemComponent } from '../company-item/company-item.component';
import { yandexMapFormaterData } from '../../utils/utils';

declare var ymaps: any;

@Component({
  selector: 'app-company-yandex-map',
  styleUrl: './company-yandex-map.component.scss',
  imports: [CompanyItemComponent],
  template: `
    <section class="company-map">
      <header class="company-map__header">
        <h2 class="company-map__title">Карта компаний</h2>
      </header>

      <div class="company-map__container">
        <div class="company-map__placeholder">
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
          <div id="map" style="width: 790px; height: 696px;"></div>
        </div>
      </div>
    </section>
  `
})
export class CompanyYandexMapComponent implements OnInit {
  allCompanies: Company[] = []
  group: { style: string, items: YandexMark[] } = { style: 'islands#blackIcon', items: [] }
  map: any = null;

  constructor(private companyService: CompanyService, private localService: LocalService) {}

  async ngOnInit() {
    if (typeof ymaps !== 'undefined') {
      await ymaps.ready(() => this.initMap());
    } else {
      console.error('Yandex Maps API is not loaded');
    }
    this.allCompanies = await this.companyService.getCompanies().then(value => value!.data);
    this.group.items = this.allCompanies.map((el) => yandexMapFormaterData(el))
    this.addCompanyMarkers()
  }

  initMap() {
    this.map = new ymaps.Map('map', {
      center: [55.76, 37.64],
      zoom: 10,
    });
  }

  addCompanyMarkers() {
    this.map.geoObjects.removeAll();

    this.group.items.forEach((mark: YandexMark) => {
      const placemark = new ymaps.Placemark(
        mark.center,
        { balloonContent: mark.name },
        { preset: this.group.style }
      );
      this.map.geoObjects.add(placemark);
    });

    if (this.group.items.length > 0) {
      this.map.setBounds(this.map.geoObjects.getBounds(), {
        checkZoomRange: true,
        zoomMargin: 50
      });
    }
  }
}
