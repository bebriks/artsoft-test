import { Company, YandexMark } from "../models/company.model";

export const yandexMapFormaterData = (company: Company): YandexMark => {
  const center = [company.latitude, company.longitude] as [number, number]
  const name = company.business_name
  return {name, center}
}
