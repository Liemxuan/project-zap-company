/**
 * API Endpoint Constants for ZAP Design Engine
 * Centralized registry for external service integration
 */

export const API_ENDPOINTS = {
  // CRM Gateway Services
  LOCATION: {
    LIST: '/api/proxy/crm-gateway/locations/list',
    DETAIL: '/api/proxy/crm-gateway/locations',
  },
  
  CATEGORY: {
    LIST: '/api/proxy/crm-gateway/categories/list',
    DETAIL: '/api/proxy/crm-gateway/categories',
  },

  BRAND: {
    LIST: '/api/proxy/crm-gateway/brands/list',
    DETAIL: '/api/proxy/crm-gateway/brands',
  },

  DINING_OPTION: {
    LIST: '/api/proxy/crm-gateway/dining-options/list',
    DETAIL: '/api/proxy/crm-gateway/dining-options',
  },

  MODIFIER_GROUP: {
    LIST: '/api/proxy/crm-gateway/modifier-groups/list',
    DETAIL: '/api/proxy/crm-gateway/modifier-groups',
  },

  PRODUCT: {
    LIST: '/api/proxy/crm-gateway/products/list',
    DETAIL: '/api/proxy/crm-gateway/products',
  },

  UNIT: {
    LIST: '/api/proxy/crm-gateway/units/list',
    DETAIL: '/api/proxy/crm-gateway/units',
  },

  GROUP_PRODUCT: {
    LIST: '/api/proxy/crm-gateway/group-products/list',
    DETAIL: '/api/proxy/crm-gateway/group-products',
  }
} as const;

export type ApiEndpoints = typeof API_ENDPOINTS;
