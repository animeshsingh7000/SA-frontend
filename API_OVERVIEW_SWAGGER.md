# API Overview & Swagger Reference

This document provides a high-level overview of the API endpoints, authentication, and usage patterns for the Stay Attache platform, based on the current frontend codebase. Use this as a reference for Swagger/OpenAPI documentation and future API work.

---

## Authentication
- **Type:** JWT Bearer Token
- **Header:** `Authorization: Bearer <token>`
- **Obtained via:** `/api/v1/user/login`
- **Required for:** Most endpoints (except public info and authentication)

---

## Main API Resources & Endpoints

### Authentication (Anonymous/All)
- `POST /api/v1/user/register` — Register a new user
- `POST /api/v1/user/login` — Login and receive JWT
- `PATCH /api/v1/user/logout` — Logout
- `POST /api/v1/user/forgot-password` — Request password reset
- `POST /api/v1/user/reset-password` — Reset password
- `POST /api/v1/user/change-password` — Change password

### Public Info/Configuration (Anonymous/All)
- `GET /api/v1/faq/list` — Get FAQs
- `GET /api/v1/user/attache-user-list` — Get team/user list
- `GET /api/v1/news/list` — Get news
- `POST /api/v1/contact-us/add` — Contact form
- `GET /api/v1/configuration/amenities` — List amenities
- `GET /api/v1/configuration/unit-amenities` — List unit amenities
- `GET /api/v1/configuration/property-amenities` — List property amenities
- `GET /api/v1/configuration/shared-amenities` — List shared amenities
- `GET /api/v1/configuration/shared-amenities-v2` — List shared amenities (v2)
- `GET /api/v1/configuration/states-code` — List state codes

### Property APIs (Renter/Owner/All)
- `GET /api/v1/property/list` — List properties
- `POST /api/v1/property/add` — Add property
- `PUT /api/v1/property/update` — Update property
- `GET /api/v1/property/{id}` — Get property by ID
- `GET /api/v1/property/list/owner` — List owner properties
- `GET /api/v1/listing/list/rental` — List rental properties
- `GET /api/v1/favorites/properties` — List favorite properties
- `GET /api/v1/property-comparison/list` — Compare properties

### Attache Property APIs (Renter/All)
- `GET /api/v1/featurette/list` — List featurettes
- `GET /api/v1/listing/feature-list` — List features
- `GET /api/v1/listing/list` — Browse properties
- `GET /api/v1/listing/{id}` — Property detail
- `GET /api/v1/listing/map-list` — Map view of properties

### Owner APIs
- `GET /api/v1/owner/dashboard-counts` — Owner dashboard
- `POST /api/v1/owner/inquiry` — Submit inquiry
- `GET /api/v1/owner/leases` — List leases
- `GET /api/v1/owner/leases/{id}` — Lease detail
- `GET /api/v1/owner/block-dates` — List block dates
- `POST /api/v1/owner/block-dates/add` — Add block date
- `PATCH /api/v1/owner/block-dates/{id}/update` — Update block date

### Admin Property APIs
- `GET /api/v1/admin/properties/all` — List all properties
- `GET /api/v1/admin/properties/active` — List active properties
- `GET /api/v1/admin/properties/on-lease` — List on-lease properties
- `GET /api/v1/admin/properties/available` — List available properties
- `POST /api/v1/admin/properties/create` — Create property
- `PATCH /api/v1/admin/properties/{id}/update` — Update property
- `GET /api/v1/admin/properties/{id}/details` — Property details
- `PATCH /api/v1/admin/properties/{id}/upload-image` — Upload property image
- `DELETE /api/v1/admin/properties/{id}/image/{imageId}` — Delete property image
- `GET /api/v1/admin/properties/{id}/images-list` — List property images
- `PATCH /api/v1/admin/properties/{id}/update-image-order` — Update image order

### Admin Operations APIs
- `GET /api/v1/admin/lease/template` — Lease templates
- `POST /api/v1/admin/building/create` — Create building
- `GET /api/v1/admin/building` — List buildings
- `GET /api/v1/admin/recurring` — Recurring rates
- `GET /api/v1/admin/rcs/list` — Recurring schedule list
- `GET /api/v1/admin/dcs/list` — Departure schedule list
- `GET /api/v1/admin/lease/template/{id}` — Lease template detail
- `GET /api/v1/admin/recurring/{id}` — Recurring rate detail
- `PUT /api/v1/admin/recurring/{id}` — Update recurring rate

### Admin Owner Inquiry APIs
- `GET /api/v1/owner/inquiries` — List owner inquiries
- `POST /api/v1/owner/inquiry-status-update` — Update inquiry status
- `PUT /api/v1/property/admin-update` — Admin update property
- `POST /api/v1/dynamic-pricing/property-price` — Calculate price
- `GET /api/v1/dynamic-pricing/list` — List dynamic pricing
- `PATCH /api/v1/dynamic-pricing/update` — Update dynamic pricing
- `GET /api/v1/featurette/list` — List featurettes
- `POST /api/v1/featurette/add` — Add featurette
- `DELETE /api/v1/featurette/{id}/delete` — Delete featurette
- `GET /api/v1/featurette/{id}/details` — Featurette details
- `PATCH /api/v1/featurette/{id}/update` — Update featurette
- `GET /api/v1/listing/feature-list` — List features
- `PATCH /api/v1/listing/feature-list/{id}` — Update feature
- `DELETE /api/v1/listing/feature-list/{id}/delete` — Delete feature
- `GET /api/v1/owner/inquiry/{id}` — Inquiry detail
- `PATCH /api/v1/owner/inquiry/{id}/update` — Update inquiry

---

## Usage Patterns
- All requests (except public/auth) require JWT Bearer token in the `Authorization` header.
- Most endpoints accept and return JSON.
- Error responses typically include a message and status code.

---

## Notes
- This document is auto-generated from the codebase and may need further detail for request/response schemas and examples.
- Use this as a reference for Swagger/OpenAPI documentation and API integration. 