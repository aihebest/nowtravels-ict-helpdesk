# Microsoft 365 Integration

## Integration Goals

The Nowtravels ICT Helpdesk should use Microsoft 365 for:

- Staff sign-in
- User profile sync
- Role mapping
- Email notifications
- High priority Teams alerts
- Future mailbox-driven ticket creation

## Microsoft Entra ID Authentication

Use Microsoft Entra ID with OpenID Connect and OAuth 2.0.

Recommended production flow:

1. Register the application in Microsoft Entra ID.
2. Add redirect URLs:
   - Local: `http://localhost:3000/api/auth/callback/microsoft-entra-id`
   - Production: `https://<app-domain>/api/auth/callback/microsoft-entra-id`
3. Configure client ID, tenant ID, and client secret.
4. Store secrets in Azure App Service settings or Key Vault.
5. Validate user session on all protected pages and API routes.

## Role Mapping

Recommended Microsoft 365 security groups:

- `Nowtravels-Helpdesk-Staff`
- `Nowtravels-Helpdesk-Branch-Managers`
- `Nowtravels-Helpdesk-ICT-Agents`
- `Nowtravels-Helpdesk-ICT-Supervisors`
- `Nowtravels-Helpdesk-ICT-Admins`
- `Nowtravels-Helpdesk-Auditors`

Map these groups to internal application roles.

## User Profile Sync

Use Microsoft Graph to sync:

- Full name
- Email
- Job title
- Department
- Office location
- Manager
- Mobile phone where available

Store the Microsoft Entra user ID as `entraId` in the `users` table.

## Email Notifications

Use Microsoft Graph to send email from a shared mailbox such as:

`ictsupport@nowtravels.com`

Recommended notification messages:

- Ticket created
- Ticket assigned
- ICT response added
- Status changed
- Ticket resolved
- SLA warning
- SLA breach

## Teams Alerts

For high priority tickets, send a notification to an ICT Teams channel.

Recommended alerts:

- High priority ticket created
- SLA breach warning
- Ticket escalated to ICT supervisor
- Major incident detected

## Future Mailbox Ticket Creation

Later, Nowtravels can allow staff to email `ictsupport@nowtravels.com`.

Workflow:

1. Monitor the shared mailbox using Microsoft Graph change notifications.
2. Create ticket from incoming email.
3. Attach email files to the ticket.
4. Reply to sender with ticket number.
5. Add future email replies as ticket comments.

## Required Configuration

Environment variables:

- `MICROSOFT_ENTRA_TENANT_ID`
- `MICROSOFT_ENTRA_CLIENT_ID`
- `MICROSOFT_ENTRA_CLIENT_SECRET`
- `MICROSOFT_GRAPH_SENDER`
- `AUTH_SECRET`

Minimum first-stage Graph needs:

- Sign in and read user profile
- Read group membership for role mapping
- Send email notifications

Keep Graph permissions narrow and review admin consent before production.

## Reference Links

- Microsoft identity platform OAuth 2.0 and OpenID Connect: https://learn.microsoft.com/en-us/entra/identity-platform/v2-protocols
- Microsoft Graph permissions reference: https://learn.microsoft.com/en-us/graph/permissions-reference
- Microsoft Graph change notifications: https://learn.microsoft.com/en-us/graph/api/resources/change-notifications-api-overview
- Microsoft Graph webhook delivery: https://learn.microsoft.com/en-us/graph/change-notifications-delivery-webhooks
