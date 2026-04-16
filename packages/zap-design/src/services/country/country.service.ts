import { API_ENDPOINTS } from '../../const/api';
import { apiService, RequestOptions } from '../common/api.service';
import { CountryListRequest, CountryResponse, CountryDetailResponse } from './country.model';

/**
 * Country API Service (Standalone)
 * Handles communications with the CRM Gateway for country-related operations.
 */
export const countryService = {
    /**
     * Fetch country list from the CRM Gateway
     */
    async getCountriesList(
        payload: CountryListRequest, 
        options: RequestOptions = {}
    ): Promise<CountryResponse> {
        return apiService.post<CountryResponse>(
            API_ENDPOINTS.COUNTRY.LIST, 
            payload, 
            options
        );
    },

    /**
     * Fetch a single country detail from the CRM Gateway
     */
    async getCountryDetail(
        id: string, 
        options: RequestOptions = {}
    ): Promise<CountryDetailResponse> {
        return apiService.get<CountryDetailResponse>(
            `${API_ENDPOINTS.COUNTRY.DETAIL}/${id}`, 
            options
        );
    }
};
