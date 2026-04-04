import successResponse from './GET_200_success.json';
import error404 from './GET_404_not_found.json';
import sourceData from '../list/locations_source.json';

/**
 * LocationDetailMock
 *
 * Provides a Postman-like experience when interacting with mock data.
 * Can be used within React components or MSW handlers.
 */
export const LocationDetailMock = {
  /**
   * Retrieves the successful response payload.
   * @param id The location ID to mock.
   */
  get: (id: string = 'loc_001') => {
    if (id === 'notfound') return error404;
    
    // Search in source list for high-fidelity mock
    const foundItem = sourceData.find(item => item.id === id);
    if (foundItem) {
      return {
        success: true,
        code: 200,
        message: "OK",
        data: {
          ...successResponse.data,
          ...foundItem,
          id
        }
      };
    }

    return {
      ...successResponse,
      id,
      timestamp: new Date().toISOString()
    };
  },

  /**
   * Directly exports the raw JSON templates.
   */
  templates: {
    success: successResponse,
    notFound: error404
  }
};

export default LocationDetailMock;
