// ================= MCP Chatbot API Tools Registry Checklist =================
// | Path                              | Description                  | Roles                        | Auth  | Required Params      | Optional Params      | Notes                  |
// |------------------------------------|------------------------------|------------------------------|-------|----------------------|----------------------|------------------------|
// | /faq/list                         | Get FAQs                     | guest, owner, renter, admin  | false |                      |                      |                        |
// | /user/attache-user-list           | Get team/user list           | guest, owner, renter, admin  | false |                      |                      |                        |
// | /news/list                        | Get news                     | guest, owner, renter, admin  | false |                      |                      |                        |
// | /configuration/amenities          | List amenities               | guest, owner, renter, admin  | false |                      |                      |                        |
// | /configuration/unit-amenities     | List unit amenities          | guest, owner, renter, admin  | false |                      |                      |                        |
// | /configuration/property-amenities | List property amenities      | guest, owner, renter, admin  | false |                      |                      |                        |
// | /configuration/shared-amenities   | List shared amenities        | guest, owner, renter, admin  | false |                      |                      |                        |
// | /configuration/shared-amenities-v2| List shared amenities (v2)   | guest, owner, renter, admin  | false |                      |                      |                        |
// | /configuration/states-code        | List state codes             | guest, owner, renter, admin  | false |                      |                      |                        |
// | /property/list                    | List all properties          | owner, renter, admin, guest  | true  |                      | page, limit, filter  | Ambiguity: params      |
// | /property/{id}                    | Get property by ID           | owner, renter, admin, guest  | true  | id                   |                      |                        |
// | /property/list/owner              | List owner properties        | owner, admin                 | true  |                      |                      |                        |
// | /listing/list/rental              | List rental properties       | renter, admin                | true  |                      |                      |                        |
// | /favorites/properties             | List favorite properties     | owner, renter, admin         | true  |                      |                      |                        |
// | /property-comparison/list         | Compare properties           | owner, renter, admin         | true  |                      |                      |                        |
// | /featurette/list                  | List featurettes             | guest, owner, renter, admin  | false |                      |                      |                        |
// | /listing/feature-list             | List features                | guest, owner, renter, admin  | false |                      |                      |                        |
// | /listing/list                     | Browse properties            | guest, owner, renter, admin  | false |                      |                      |                        |
// | /listing/{id}                     | Property detail              | guest, owner, renter, admin  | false | id                   |                      |                        |
// | /listing/map-list                 | Map view of properties       | guest, owner, renter, admin  | false |                      |                      |                        |
// | /owner/dashboard-counts           | Owner dashboard              | owner                        | true  |                      |                      |                        |
// | /owner/leases                     | List leases                  | owner                        | true  |                      |                      |                        |
// | /owner/block-dates                | List block dates             | owner                        | true  |                      |                      |                        |
// | /admin/properties/all             | List all properties (admin)  | admin                        | true  |                      |                      |                        |
// | /admin/properties/active          | List active properties       | admin                        | true  |                      |                      |                        |
// | /admin/properties/on-lease        | List on-lease properties     | admin                        | true  |                      |                      |                        |
// | /admin/properties/available       | List available properties    | admin                        | true  |                      |                      |                        |
// | /admin/properties/{id}/details    | Property details (admin)     | admin                        | true  | id                   |                      |                        |
// | /admin/properties/{id}/images-list| List property images (admin) | admin                        | true  | id                   |                      |                        |
// | /listing/mapped-list              | Get mapped property list     | renter, admin                | true  |                      |                      |                        |
// | /listing/mapped-list-owner        | Get mapped list for owner    | owner, admin                 | true  |                      |                      |                        |
// | /rental/leases                    | List rental leases           | renter, admin                | true  |                      |                      |                        |
// | /property-notes/list              | List property notes          | owner, renter, admin         | true  | propertyId           |                      |                        |
// | /dynamic-pricing/list             | List dynamic pricing         | admin                        | true  |                      |                      |                        |
// | /featurette/list/admin            | List admin featurettes       | admin                        | true  |                      |                      |                        |
// | /admin/lease/template             | Lease templates              | admin                        | true  |                      |                      |                        |
// | /admin/building                   | List buildings               | admin                        | true  |                      |                      |                        |
// | /admin/recurring                  | Recurring rates              | admin                        | true  |                      |                      |                        |
// | /admin/rcs/list                   | Recurring schedule list      | admin                        | true  |                      |                      |                        |
// | /admin/dcs/list                   | Departure schedule list      | admin                        | true  |                      |                      |                        |
// | /admin/lease/template/{id}        | Lease template detail        | admin                        | true  | id                   |                      |                        |
// | /admin/recurring/{id}             | Recurring rate detail        | admin                        | true  | id                   |                      |                        |
// | /owner/leases/{id}                | Lease detail                 | owner                        | true  | id                   |                      |                        |
// | /featurette/{id}/details          | Featurette details           | admin                        | true  | id                   |                      | Ambiguity: roles?      |
// | /owner/inquiries                  | List owner inquiries         | owner                        | true  |                      |                      |                        |
// | /owner/inquiry/{id}               | Inquiry detail               | owner                        | true  | id                   |                      |                        |
// | /rental/invoice                   | Get rental invoice detail    | renter, admin                | true  | invoiceId            |                      |                        |
// | /admin/region/list                | List regions                 | admin                        | true  |                      |                      |                        |
// | /admin/region                     | Get region detail            | admin                        | true  | regionId             |                      |                        |
// | /common                           | Get common data              | guest, owner, renter, admin  | false |                      |                      |                        |
// | /admin/building/list              | List buildings               | admin                        | true  |                      |                      |                        |
// | /admin/blogs                      | Get blogs                    | admin                        | true  |                      |                      |                        |
// | /admin/blogs/list                 | List blogs                   | admin                        | true  |                      |                      |                        |
// | /admin/promoted-properties        | Get promoted properties      | admin                        | true  |                      |                      |                        |
// ===========================================================================

// Auto-generated tool registry for MCP Chatbot (GET-only)
// Each entry: { path, method, roles, needsAuth, description, requiredParams, optionalParams }
// Ambiguities are commented for review.

export interface ApiTool {
  path: string;
  method: 'GET';
  roles: Array<'owner' | 'renter' | 'admin' | 'guest'>;
  needsAuth: boolean;
  description: string;
  requiredParams: string[];
  optionalParams: string[];
}

export const apiTools: ApiTool[] = [
  // Public endpoints
  {
    path: '/faq/list',
    method: 'GET',
    roles: ['guest', 'owner', 'renter', 'admin'],
    needsAuth: false,
    description: 'Get FAQs',
    requiredParams: [],
    optionalParams: [],
  },
  {
    path: '/user/attache-user-list',
    method: 'GET',
    roles: ['guest', 'owner', 'renter', 'admin'],
    needsAuth: false,
    description: 'Get team/user list',
    requiredParams: [],
    optionalParams: [],
  },
  {
    path: '/news/list',
    method: 'GET',
    roles: ['guest', 'owner', 'renter', 'admin'],
    needsAuth: false,
    description: 'Get news',
    requiredParams: [],
    optionalParams: [],
  },
  // Configuration endpoints
  {
    path: '/configuration/amenities',
    method: 'GET',
    roles: ['guest', 'owner', 'renter', 'admin'],
    needsAuth: false,
    description: 'List amenities',
    requiredParams: [],
    optionalParams: [],
  },
  {
    path: '/configuration/unit-amenities',
    method: 'GET',
    roles: ['guest', 'owner', 'renter', 'admin'],
    needsAuth: false,
    description: 'List unit amenities',
    requiredParams: [],
    optionalParams: [],
  },
  {
    path: '/configuration/property-amenities',
    method: 'GET',
    roles: ['guest', 'owner', 'renter', 'admin'],
    needsAuth: false,
    description: 'List property amenities',
    requiredParams: [],
    optionalParams: [],
  },
  {
    path: '/configuration/shared-amenities',
    method: 'GET',
    roles: ['guest', 'owner', 'renter', 'admin'],
    needsAuth: false,
    description: 'List shared amenities',
    requiredParams: [],
    optionalParams: [],
  },
  {
    path: '/configuration/shared-amenities-v2',
    method: 'GET',
    roles: ['guest', 'owner', 'renter', 'admin'],
    needsAuth: false,
    description: 'List shared amenities (v2)',
    requiredParams: [],
    optionalParams: [],
  },
  {
    path: '/configuration/states-code',
    method: 'GET',
    roles: ['guest', 'owner', 'renter', 'admin'],
    needsAuth: false,
    description: 'List state codes',
    requiredParams: [],
    optionalParams: [],
  },
  // Property endpoints
  {
    path: '/property/list',
    method: 'GET',
    roles: ['owner', 'renter', 'admin', 'guest'],
    needsAuth: true,
    description: 'List all properties',
    requiredParams: [],
    optionalParams: ['page', 'count', 'filterType', '...allFilters'], // allFilters is a spread of filter params from UI
    // Note: allFilters may include search, sort, and other filter fields as used in the UI
  },
  {
    path: '/property/{id}',
    method: 'GET',
    roles: ['owner', 'renter', 'admin', 'guest'],
    needsAuth: true,
    description: 'Get property by ID',
    requiredParams: ['id'],
    optionalParams: [],
  },
  {
    path: '/property/list/owner',
    method: 'GET',
    roles: ['owner', 'admin'],
    needsAuth: true,
    description: 'List owner properties',
    requiredParams: [],
    optionalParams: [],
  },
  {
    path: '/listing/list/rental',
    method: 'GET',
    roles: ['renter', 'admin'],
    needsAuth: true,
    description: 'List rental properties',
    requiredParams: [],
    optionalParams: [],
  },
  {
    path: '/favorites/properties',
    method: 'GET',
    roles: ['owner', 'renter', 'admin'],
    needsAuth: true,
    description: 'List favorite properties',
    requiredParams: [],
    optionalParams: [],
  },
  {
    path: '/property-comparison/list',
    method: 'GET',
    roles: ['owner', 'renter', 'admin'],
    needsAuth: true,
    description: 'Compare properties',
    requiredParams: [],
    optionalParams: [],
  },
  // Attache Property endpoints
  {
    path: '/featurette/list',
    method: 'GET',
    roles: ['guest', 'owner', 'renter', 'admin'],
    needsAuth: false,
    description: 'List featurettes',
    requiredParams: [],
    optionalParams: [],
  },
  {
    path: '/listing/feature-list',
    method: 'GET',
    roles: ['guest', 'owner', 'renter', 'admin'],
    needsAuth: false,
    description: 'List features',
    requiredParams: [],
    optionalParams: [],
  },
  {
    path: '/listing/list',
    method: 'GET',
    roles: ['guest', 'owner', 'renter', 'admin'],
    needsAuth: false,
    description: 'Browse properties',
    requiredParams: [],
    optionalParams: [],
  },
  {
    path: '/listing/{id}',
    method: 'GET',
    roles: ['guest', 'owner', 'renter', 'admin'],
    needsAuth: false,
    description: 'Property detail',
    requiredParams: ['id'],
    optionalParams: [],
  },
  {
    path: '/listing/map-list',
    method: 'GET',
    roles: ['guest', 'owner', 'renter', 'admin'],
    needsAuth: false,
    description: 'Map view of properties',
    requiredParams: [],
    optionalParams: [],
  },
  // Owner endpoints
  {
    path: '/owner/dashboard-counts',
    method: 'GET',
    roles: ['owner'],
    needsAuth: true,
    description: 'Owner dashboard',
    requiredParams: [],
    optionalParams: [],
  },
  {
    path: '/owner/leases',
    method: 'GET',
    roles: ['owner'],
    needsAuth: true,
    description: 'List leases',
    requiredParams: [],
    optionalParams: [],
  },
  {
    path: '/owner/block-dates',
    method: 'GET',
    roles: ['owner'],
    needsAuth: true,
    description: 'List block dates',
    requiredParams: [],
    optionalParams: [],
  },
  // Admin endpoints
  {
    path: '/admin/properties/all',
    method: 'GET',
    roles: ['admin'],
    needsAuth: true,
    description: 'List all properties (admin)',
    requiredParams: [],
    optionalParams: [],
  },
  {
    path: '/admin/properties/active',
    method: 'GET',
    roles: ['admin'],
    needsAuth: true,
    description: 'List active properties (admin)',
    requiredParams: [],
    optionalParams: [],
  },
  {
    path: '/admin/properties/on-lease',
    method: 'GET',
    roles: ['admin'],
    needsAuth: true,
    description: 'List on-lease properties (admin)',
    requiredParams: [],
    optionalParams: [],
  },
  {
    path: '/admin/properties/available',
    method: 'GET',
    roles: ['admin'],
    needsAuth: true,
    description: 'List available properties (admin)',
    requiredParams: [],
    optionalParams: [],
  },
  {
    path: '/admin/properties/{id}/details',
    method: 'GET',
    roles: ['admin'],
    needsAuth: true,
    description: 'Property details (admin)',
    requiredParams: ['id'],
    optionalParams: [],
  },
  {
    path: '/admin/properties/{id}/images-list',
    method: 'GET',
    roles: ['admin'],
    needsAuth: true,
    description: 'List property images (admin)',
    requiredParams: ['id'],
    optionalParams: [],
  },
  // Rental endpoints
  {
    path: '/listing/mapped-list',
    method: 'GET',
    roles: ['renter', 'admin'],
    needsAuth: true,
    description: 'Get mapped property list',
    requiredParams: [],
    optionalParams: [],
  },
  {
    path: '/listing/mapped-list-owner',
    method: 'GET',
    roles: ['owner', 'admin'],
    needsAuth: true,
    description: 'Get mapped property list for owner',
    requiredParams: [],
    optionalParams: [],
  },
  {
    path: '/rental/leases',
    method: 'GET',
    roles: ['renter', 'admin'],
    needsAuth: true,
    description: 'List rental leases',
    requiredParams: [],
    optionalParams: [],
  },
  // Notes endpoints
  {
    path: '/property-notes/list',
    method: 'GET',
    roles: ['owner', 'renter', 'admin'],
    needsAuth: true,
    description: 'List property notes',
    requiredParams: ['propertyId'],
    optionalParams: [],
  },
  // Dynamic pricing endpoints
  {
    path: '/dynamic-pricing/list',
    method: 'GET',
    roles: ['admin'],
    needsAuth: true,
    description: 'List dynamic pricing',
    requiredParams: [],
    optionalParams: [],
  },
  // Featurette endpoints
  {
    path: '/featurette/list/admin',
    method: 'GET',
    roles: ['admin'],
    needsAuth: true,
    description: 'List admin featurettes',
    requiredParams: [],
    optionalParams: [],
  },
  // --- Additional GET endpoints from OpenAPI audit ---
  {
    path: '/admin/lease/template',
    method: 'GET',
    roles: ['admin'],
    needsAuth: true,
    description: 'Lease templates',
    requiredParams: [],
    optionalParams: [],
  },
  {
    path: '/admin/building',
    method: 'GET',
    roles: ['admin'],
    needsAuth: true,
    description: 'List buildings',
    requiredParams: [],
    optionalParams: [],
  },
  {
    path: '/admin/recurring',
    method: 'GET',
    roles: ['admin'],
    needsAuth: true,
    description: 'Recurring rates',
    requiredParams: [],
    optionalParams: [],
  },
  {
    path: '/admin/rcs/list',
    method: 'GET',
    roles: ['admin'],
    needsAuth: true,
    description: 'Recurring schedule list',
    requiredParams: [],
    optionalParams: [],
  },
  {
    path: '/admin/dcs/list',
    method: 'GET',
    roles: ['admin'],
    needsAuth: true,
    description: 'Departure schedule list',
    requiredParams: [],
    optionalParams: [],
  },
  {
    path: '/admin/lease/template/{id}',
    method: 'GET',
    roles: ['admin'],
    needsAuth: true,
    description: 'Lease template detail',
    requiredParams: ['id'],
    optionalParams: [],
  },
  {
    path: '/admin/recurring/{id}',
    method: 'GET',
    roles: ['admin'],
    needsAuth: true,
    description: 'Recurring rate detail',
    requiredParams: ['id'],
    optionalParams: [],
  },
  {
    path: '/owner/leases/{id}',
    method: 'GET',
    roles: ['owner'],
    needsAuth: true,
    description: 'Lease detail',
    requiredParams: ['id'],
    optionalParams: [],
  },
  {
    path: '/owner/inquiries',
    method: 'GET',
    roles: ['owner'],
    needsAuth: true,
    description: 'List owner inquiries',
    requiredParams: [],
    optionalParams: [],
  },
  {
    path: '/owner/inquiry/{id}',
    method: 'GET',
    roles: ['owner'],
    needsAuth: true,
    description: 'Inquiry detail',
    requiredParams: ['id'],
    optionalParams: [],
  },
  {
    path: '/rental/invoice',
    method: 'GET',
    roles: ['renter', 'admin'],
    needsAuth: true,
    description: 'Get rental invoice detail',
    requiredParams: ['invoiceId'],
    optionalParams: [],
  },
  {
    path: '/admin/region/list',
    method: 'GET',
    roles: ['admin'],
    needsAuth: true,
    description: 'List regions',
    requiredParams: [],
    optionalParams: [],
  },
  {
    path: '/admin/region',
    method: 'GET',
    roles: ['admin'],
    needsAuth: true,
    description: 'Get region detail',
    requiredParams: ['regionId'],
    optionalParams: [],
  },
  {
    path: '/common',
    method: 'GET',
    roles: ['guest', 'owner', 'renter', 'admin'],
    needsAuth: false,
    description: 'Get common data',
    requiredParams: [],
    optionalParams: [],
  },
  {
    path: '/admin/building/list',
    method: 'GET',
    roles: ['admin'],
    needsAuth: true,
    description: 'List buildings',
    requiredParams: [],
    optionalParams: [],
  },
  {
    path: '/admin/blogs',
    method: 'GET',
    roles: ['admin'],
    needsAuth: true,
    description: 'Get blogs',
    requiredParams: [],
    optionalParams: [],
  },
  {
    path: '/admin/blogs/list',
    method: 'GET',
    roles: ['admin'],
    needsAuth: true,
    description: 'List blogs',
    requiredParams: [],
    optionalParams: [],
  },
  {
    path: '/admin/promoted-properties',
    method: 'GET',
    roles: ['admin'],
    needsAuth: true,
    description: 'Get promoted properties',
    requiredParams: [],
    optionalParams: [],
  },
  // ... (Add any other GET endpoints from OpenAPI, following this structure)
  // Ambiguity: For endpoints with unclear roles or params, add a comment for review.
]; 