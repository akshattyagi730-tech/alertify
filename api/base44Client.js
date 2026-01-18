/**
 * Base44 Client - Backward Compatibility Wrapper
 * 
 * This file now acts as a compatibility layer that uses the new REST API client.
 * All Base44 calls are redirected to the backend API.
 * 
 * @deprecated Use apiClient directly for new code
 */

import apiClient from './apiClient.js';

// Export as base44 for backward compatibility
export const base44 = apiClient;
export default apiClient;
