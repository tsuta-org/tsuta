# API Compatibility (Mastodon-inspired)

This document outlines Tsuta's API compatibility with Mastodon API.

## Implemented Endpoints

### Apps
- `POST /api/v1/apps` - Register an application

### Instance
- `GET /api/v1/instance` - Instance information
- `GET /api/v2/instance` - Instance information (v2)
- `GET /.well-known/nodeinfo` - NodeInfo discovery
- `GET /nodeinfo/2.0` - NodeInfo

### Accounts
- `POST /api/v1/accounts` / `POST /api/v1/accounts/register` - Register account
- `POST /api/v1/accounts/login` - Login
- `GET /api/v1/accounts/verify_credentials` - Verify credentials (auth required)
- `POST /api/v1/accounts/:id/follow` - Follow (auth required)
- `POST /api/v1/accounts/:id/unfollow` - Unfollow (auth required)

### Statuses
- `GET /api/v1/statuses` - List statuses
- `POST /api/v1/statuses` - Post status (auth required)
- `GET /api/v1/statuses/:id` - Get status
- `POST /api/v1/statuses/:id/favourite` - Favourite (auth required)
- `POST /api/v1/statuses/:id/unfavourite` - Unfavourite (auth required)

### Timelines
- `GET /api/v1/timelines/public` - Public timeline
- `GET /api/v1/timelines/local` - Local timeline
- `GET /api/v1/timelines/home` - Home timeline (auth required)

### ActivityPub
- `GET /.well-known/webfinger` - WebFinger discovery
- `GET /users/:username` - Actor (Person)
- `POST /users/:username/inbox` - Inbox
- `GET /users/:username/outbox` - Outbox

## Planned
- OAuth token endpoints
- Notifications
- Lists
- Filters
- Reports
- Media uploads
- More ActivityPub federation features

## Notes
- This is a partial implementation inspired by Mastodon API
- Not all endpoints are fully compatible yet
- Response formats may differ slightly
