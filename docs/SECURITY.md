# Security Considerations

## Authentication

Production authentication should use Microsoft Entra ID with OpenID Connect.

Access model:

- Staff Requester: submit tickets and view only own tickets
- Branch Manager: view branch tickets
- ICT Agent: view assigned tickets and ICT queue
- ICT Supervisor: assign and escalate tickets
- ICT Admin: manage users, branches, SLA, categories, and reports
- Auditor: read-only audit and reporting access

## Authorization

Every backend route must enforce role-based access control.

Do not rely on hidden frontend buttons for security. The API must verify the user role and data scope.

Examples:

- Staff can only read tickets where `requesterId` matches their user ID.
- Branch managers can only read tickets in their assigned branch.
- ICT agents can only update tickets they are allowed to manage.
- Only ICT supervisors/admins can assign tickets.
- Only ICT admins can manage SLA policies and roles.

## Data Protection

- Force HTTPS in production.
- Store secrets in Azure Key Vault or Azure App Service settings.
- Do not commit `.env` files.
- Encrypt database at rest.
- Keep file attachments private.
- Use temporary signed URLs for attachment downloads.
- Scan uploads for malware before making files available.
- Limit upload file size and allowed extensions.

## Audit Logging

Audit these events:

- Login and logout
- Ticket creation
- Ticket assignment
- Status change
- Priority change
- Comment creation
- Attachment upload/download
- User role change
- SLA configuration change
- Admin setting change

Audit logs should be append-only from the application perspective.

## Microsoft Graph Permissions

Apply least privilege:

- Use delegated permissions for signed-in user actions where practical.
- Use application permissions only for service tasks such as sending from a shared mailbox.
- Restrict `Mail.Send` with an Exchange application access policy when using application permissions.
- Do not grant broad permissions unless there is a clear operational need.

## Operational Security

- Require MFA through Microsoft Entra Conditional Access.
- Use separate production and staging app registrations if needed.
- Rotate client secrets.
- Prefer certificates or managed identity for long-term production hardening.
- Enable Application Insights logging and Azure alerts.
- Back up the database automatically.
- Test restore procedures quarterly.
