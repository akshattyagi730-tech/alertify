# Frontend API Migration Guide

## Overview

The frontend has been refactored to use REST API calls instead of Base44. All Base44 calls now route through the new backend API.

## Changes Made

### 1. New API Client (`api/apiClient.js`)
- Created REST API client using `fetch`
- Supports Firebase authentication via Authorization header
- Maintains Base44-compatible interface for seamless migration
- Uses environment variable `VITE_API_BASE_URL` (default: `http://localhost:5000`)

### 2. Base44 Client Wrapper (`api/base44Client.js`)
- Now acts as a compatibility wrapper
- Imports and re-exports `apiClient` as `base44`
- No changes needed in components - they continue to work

### 3. API Endpoint Mapping

| Base44 Call | Backend Endpoint | Method |
|------------|------------------|--------|
| `base44.auth.me()` | `/auth/me` | GET |
| `base44.auth.updateMe(data)` | `/api/users/me` | PUT |
| `base44.entities.TrustedContact.list()` | `/api/contacts` | GET |
| `base44.entities.TrustedContact.create(data)` | `/api/contacts` | POST |
| `base44.entities.TrustedContact.update(id, data)` | `/api/contacts/:id` | PUT |
| `base44.entities.TrustedContact.delete(id)` | `/api/contacts/:id` | DELETE |
| `base44.entities.Journey.list(sort, limit)` | `/api/journeys?sort=...&limit=...` | GET |
| `base44.entities.Journey.create(data)` | `/api/journeys` | POST |
| `base44.entities.Journey.update(id, data)` | `/api/journeys/:id` | PUT |
| `base44.entities.SOSAlert.create(data)` | `/api/alerts` | POST |
| `base44.entities.SOSAlert.update(id, data)` | `/api/alerts/:id` | PUT |
| `base44.entities.SOSAlert.filter(query)` | `/api/alerts?status=...` | GET |
| `base44.entities.LocationUpdate.create(data)` | `/api/location-updates` | POST |
| `base44.functions.StartSOS(data)` | `/api/sos/start` | POST |
| `base44.functions.StopSOS(data)` | `/api/sos/stop` | POST |
| `base44.functions.SendSOSSMS(data)` | `/api/sos/sms` | POST |
| `base44.integrations.Core.SendEmail(data)` | `/api/email/send` | POST |

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:5000
```

For production:
```env
VITE_API_BASE_URL=https://your-backend-domain.com
```

## Authentication

The API client automatically includes Firebase ID tokens from:
1. `localStorage.getItem('firebase_token')`
2. `sessionStorage.getItem('firebase_token')`
3. `localStorage.getItem('auth_token')`
4. `sessionStorage.getItem('auth_token')`

Tokens are sent in the `Authorization` header as:
```
Authorization: Bearer <firebase-id-token>
```

## Error Handling

- List operations return empty arrays `[]` on error (graceful degradation)
- Create/Update operations throw errors (to be handled by UI)
- All errors are logged to console for debugging

## Backward Compatibility

- All existing components continue to work without changes
- `base44` import still works - it's now a wrapper around `apiClient`
- UI flows remain unchanged
- Success/error handling remains the same

## Next Steps

1. **Backend Routes**: Implement the backend API routes listed above
2. **Authentication**: Ensure Firebase tokens are stored in localStorage/sessionStorage
3. **Testing**: Test all API calls with the backend running
4. **Production**: Update `VITE_API_BASE_URL` for production deployment

## Files Modified

- ✅ `api/apiClient.js` - New REST API client
- ✅ `api/base44Client.js` - Compatibility wrapper
- ✅ `.env.example` - Added `VITE_API_BASE_URL`

## Files NOT Modified

- ✅ All component files remain unchanged
- ✅ All page files remain unchanged
- ✅ UI design unchanged
- ✅ Component structure unchanged
