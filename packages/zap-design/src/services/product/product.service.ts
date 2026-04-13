import { API_ENDPOINTS } from '../../const/api';
import { apiService, RequestOptions } from '../common/api.service';
import { 
  ProductListRequest, 
  ProductResponse,
  ProductDetailResponse
} from './product.model';

export const productService = {
  async getProductsList(
    payload: ProductListRequest, 
    options: RequestOptions = {}
  ): Promise<ProductResponse> {
    return apiService.post<ProductResponse>(
      API_ENDPOINTS.PRODUCT.LIST, 
      payload, 
      options
    );
  },

  async getProductDetail(
    id: string, 
    options: RequestOptions = {}
  ): Promise<ProductDetailResponse> {
    return apiService.get<ProductDetailResponse>(
      `${API_ENDPOINTS.PRODUCT.DETAIL}/${id}`, 
      options
    );
  }
};
