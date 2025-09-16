export type Company = {
  id: number
  logo: string
  suffix: string
  business_name: string
  industry: string
  type: string
  catch_phrase: string
  phone_number: string
  full_address: string
  latitude: number
  longitude: number
  uid: string
}

export type CompanyParams = {
  page?: number
  per_page?: number
  count?: number | null
  limit?: number | null
  q?: string | (string | null)
  industry?: string | (string | null)
  company_type?: string | (string | null)
  sort_by?: string
  sort_order?: string
}

export type CompaniesResponse ={
  data: Company[]
  page:  number
  per_page: number
  total_pages: number
  offset: number
  limit: number
  total: number
  has_prev: boolean
  has_next: boolean
}

export type SortOption = {
  sort_by: string
  sort_order: 'asc' | 'desc'
}

export type FilterOptions = {
  q: string
  company_type: string
  industry: string
}

export type Type = "Government"| "Holding"| "Non-profit"| "Private"| "Public" | "Startup"

export type Industry =
  "E-commerce" |
  "Education" |
  "Energy" |
  "FinTech" |
  "Gaming" |
  "Healthcare" |
  "Logistics" |
  "Manufacturing" |
  "Real Estate" |
  "Retail" |
  "Telecom" |
  "Travel"

export type YandexMark = {
  name: string
  center: [number, number]
}
