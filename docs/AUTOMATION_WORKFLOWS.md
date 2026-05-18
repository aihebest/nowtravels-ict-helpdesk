# Automation Workflows

## Ticket Creation

When a staff member submits a request:

1. Generate ticket number: `NW-ICT-YYYY-000001`.
2. Save ticket with status `OPEN`.
3. Calculate first response and resolution SLA timestamps.
4. Send confirmation email to requester.
5. Notify ICT queue or assigned support team.
6. Write audit log event.

## Assignment

Recommended auto-assignment rules:

- Printer issues route to desktop support.
- Network and VPN issues route to infrastructure support.
- Microsoft 365 issues route to Microsoft 365 admin support.
- High priority issues notify ICT supervisor.
- Branch-specific issues can route to the ICT staff responsible for that branch.

## SLA Monitoring

Run a background job every 5 to 10 minutes:

1. Find open tickets nearing first response SLA.
2. Find open tickets nearing resolution SLA.
3. Send warning notification to assigned ICT staff.
4. Escalate breached high priority tickets to ICT supervisor.
5. Record warning and escalation events in audit logs.

## Status Notifications

Send notifications when:

- Ticket is created.
- Ticket is assigned.
- Ticket status changes.
- ICT adds a public response.
- Ticket is resolved.
- Ticket is closed.
- SLA is at risk or breached.

## Auto Closure

Resolved tickets should auto-close after a configured period, usually 3 to 5 business days, if the requester does not reopen or reject the resolution.

## Weekly Reporting

Generate weekly ICT summary:

- Tickets opened
- Tickets resolved
- SLA compliance
- Average response time
- Average resolution time
- Tickets by branch
- Tickets by category
- Top recurring issues
- Agent workload

## Microsoft 365 Automation Options

- Send email through Microsoft Graph.
- Post high priority alerts to Microsoft Teams.
- Sync staff profiles from Microsoft Entra ID.
- Map Microsoft 365 security groups to system roles.
- Use Graph change notifications later if mailbox-driven ticket creation is added.
