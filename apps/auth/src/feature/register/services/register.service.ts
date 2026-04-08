import { mockRegisterApi } from '@/mocks/register.mock';
import { RegisterInput, RegisterResponse } from '../models/register.model';
import { ApiResponse } from '@/core/api/api.types';

export const registerService = {
  /**
   * Mock registration endpoint
   */
  async register(input: RegisterInput): Promise<ApiResponse<RegisterResponse>> {
    return await mockRegisterApi(input);
  },
};
