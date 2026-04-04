import sourceData from './locations_source.json';
import successResponse from './GET_200_success.json';

/**
 * LocationListMock
 *
 * Provides a Postman-like experience for managing lists of locations.
 */
export const LocationListMock = {
  /**
   * Retrieves a fixed paginated response (Batch 1).
   */
  getSuccessResponse: () => successResponse,

  /**
   * Retrieves the full list of 50 locations.
   */
  getSourceData: () => sourceData,

  /**
   * Simulated dynamic pagination.
   */
  paginate: (pageIndex: number = 1, pageSize: number = 10) => {
    const start = (pageIndex - 1) * pageSize;
    const end = start + pageSize;
    const items = sourceData.slice(start, end);
    
    return {
      success: true,
      code: 200,
      message: "OK",
      data: {
        total_page: Math.ceil(sourceData.length / pageSize),
        total_record: sourceData.length,
        page_index: pageIndex,
        page_size: pageSize,
        items
      }
    };
  }
};

export default LocationListMock;
