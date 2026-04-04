# [POSTMAN] GET Location Detail

This endpoint retrieves the comprehensive state of a single location, including branding, business hours, and operational settings.

- **Method:** `GET`
- **Path:** `/api/locations/:id`
- **Auth:** `Bearer {{access_token}}`

## Request Headers
| Header | Value | Description |
| :--- | :--- | :--- |
| `Accept` | `application/json` | Required Content Type |
| `x-zap-merchant-id` | `{{merchant_id}}` | Required for multi-tenancy context |

## Query Parameters
| Param | Type | Description |
| :--- | :--- | :--- |
| `expand` | `string` | Optional. Comma-separated list of nodes to expand (e.g., `branding,operations`). |
| `lang` | `string` | Optional. Language for localized fields (defaults to `vi`). |

## Examples

### 200 OK (Success)
Refers to: [GET_200_success.json](./GET_200_success.json)

### 404 Not Found
Refers to: [GET_404_not_found.json](./GET_404_not_found.json)

---
*Note: This mock is used as the creative source of truth for the Liem-L8 Location Refactor.*
