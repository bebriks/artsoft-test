import { Injectable } from '@angular/core';
import { Company, SortOption, CompanyParams, Type, Industry, CompaniesResponse, FilterOptions } from '../models/company.model';
import axios from 'axios';
import { LocalService } from './localstorage.service';

axios.defaults.baseURL = 'https://faker-api.milki.space';

@Injectable({
  providedIn: 'root'
})

export class CompanyService {

  constructor(private localService: LocalService) { }

  async getCompanies(params?: CompanyParams): Promise<CompaniesResponse | null> {
    try {
      const response = await axios.get<CompaniesResponse>('/companies', {
        params: {
          page: 1,
          per_page: 50,
          ...params
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching companies:', error);
      return {
        data: [],
        page:  0,
        per_page: 0,
        total_pages: 0,
        offset: 0,
        limit: 0,
        total: 0,
        has_prev: false,
        has_next: false,
      }
    }
  }

  async getCompanyById(id: number): Promise<Company | null> {
    try {
      const response = await axios.get<Company>(`/companies/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching company by id:', error);
      return null;
    }
  }

  async getFilters(): Promise<FilterOptions> {
    const savedFilters = this.localService.getData('filters');
    if (savedFilters) {
      try {
        const filters = await JSON.parse(savedFilters);
        return filters;
      } catch (error) {
        console.error('Ошибка при парсинге фильтров из localStorage:', error);
        this.localService.saveData('filters', JSON.stringify({q: '', company_type: '', industry: ''}));
      }
    }
    return ({q: '', company_type: '', industry: ''})
  }

  async getSorts(): Promise<SortOption> {
    const savedSorts = this.localService.getData('sorts');
    if (savedSorts) {
      try {
        const sorts = await JSON.parse(savedSorts);
        return sorts;
      } catch (error) {
        console.error('Ошибка при парсинге фильтров из localStorage:', error);
        this.localService.saveData('sorts', JSON.stringify({sort_by: 'id', sort_order: 'asc'}));
      }
    }
    return {sort_by: 'id', sort_order: 'asc'}
  }

  async getUniqueTypes(): Promise<Type[] | null> {
    try {
      const response = await axios.get<Type[]>(`/types`);
      return response.data;
    } catch (error) {
      console.error('Error fetching company by id:', error);
      return null;
    }
  }

  async getUniqueIndustries(): Promise<Industry[] | null> {
    try {
      const response = await axios.get<Industry[]>(`/industries`);
      return response.data;
    } catch (error) {
      console.error('Error fetching company by id:', error);
      return null;
    }
  }
}
