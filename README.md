# Nowtravels ICT Helpdesk

Modern ICT ticketing and helpdesk management system for centralized multi-branch support operations at Nowtravels.

## Current MVP

- Responsive enterprise dashboard shell
- Ticket queue with status, priority, SLA, branch, and assignee fields
- Ticket submission form mockup
- Branch workload panel
- SLA watch panel
- ICT staff workload panel
- Microsoft 365 integration placeholders
- Prisma database schema for the planned backend
- GitHub Actions CI workflow

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Prisma
- PostgreSQL
- Microsoft Entra ID and Microsoft Graph planned for authentication and email

## Local Setup

```bash
npm install
npm run dev
```

Open:

```text
http://127.0.0.1:3000
```

## Useful Commands

```bash
npm run lint
npm run build
npx prisma validate
```

## Environment

Copy `.env.example` to `.env` when the backend/database work begins, then fill in the database and Microsoft 365 values.

## Next Development Milestones

1. Add real authentication with Microsoft Entra ID.
2. Connect PostgreSQL with Prisma.
3. Build ticket create/list/detail API routes.
4. Replace mock dashboard data with database records.
5. Add role-based access control.
6. Add Microsoft Graph email notifications.
7. Add file attachment storage.
8. Add SLA background jobs and escalation notifications.

## Planning Documents

- [Deployment recommendation](docs/DEPLOYMENT.md)
- [Automation workflows](docs/AUTOMATION_WORKFLOWS.md)
- [Security considerations](docs/SECURITY.md)
- [Microsoft 365 integration](docs/MICROSOFT_365_INTEGRATION.md)

## Current Routes

- `/` - login screen
- `/staff` - staff ticket-only environment
- `/staff/request` - staff request form
- `/admin` - ICT admin console
