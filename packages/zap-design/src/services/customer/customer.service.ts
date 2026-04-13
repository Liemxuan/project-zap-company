import { apiService, RequestOptions } from '../common/api.service';
import { API_ENDPOINTS } from '../../const/api';
import { 
  CustomerListRequest, 
  CustomerResponse,
  CustomerDetailResponse
} from './customer.model';

/**
 * Service to handle Customer related API calls
 */
export const customerService = {
  /**
   * Get list of customers with pagination and filters
   */
  getCustomersList: async (
    params: CustomerListRequest,
    options: RequestOptions = {}
  ): Promise<CustomerResponse> => {
    return apiService.post<CustomerResponse>(
      API_ENDPOINTS.CUSTOMER.LIST,
      params,
      options
    );
  },

  /**
   * Get specific customer detail by ID
   */
  getCustomerDetail: async (
    id: string,
    options: RequestOptions = {}
  ): Promise<CustomerDetailResponse> => {
    return apiService.get<CustomerDetailResponse>(
      `${API_ENDPOINTS.CUSTOMER.DETAIL}/${id}`,
      options
    );
  },
};
