# Deployment Recommendation

## Recommended Hosting Model

Use Microsoft Azure because Nowtravels already depends on Microsoft 365 and will benefit from Entra ID, Graph, Key Vault, Application Insights, and Azure storage services.

Recommended production architecture:

- Azure App Service for the Next.js application
- Azure Database for PostgreSQL for ticket data
- Azure Blob Storage for ticket attachments
- Azure Key Vault for secrets
- Application Insights for monitoring
- GitHub Actions for CI/CD
- Microsoft Entra ID for staff authentication

## Environments

Create three environments:

- Development: local developer machine
- Staging: Azure App Service staging slot or separate staging app
- Production: Azure App Service production app

Use GitHub branches this way:

- `main`: production-ready code
- feature branches: development work
- pull requests: lint/build validation before merge

## GitHub Secrets and Variables

Add these GitHub repository secrets:

- `DATABASE_URL`
- `AZURE_WEBAPP_PUBLISH_PROFILE`
- `MICROSOFT_ENTRA_CLIENT_SECRET`
- `AUTH_SECRET`
- `AZURE_STORAGE_CONNECTION_STRING`
- `APPINSIGHTS_CONNECTION_STRING`

Add these GitHub repository variables:

- `AZURE_WEBAPP_NAME`
- `NEXT_PUBLIC_APP_URL`

The deploy workflow is manual for now. After Azure is configured and the first deployment succeeds, it can be changed to deploy automatically on pushes to `main`.

## Azure App Service Settings

Configure these application settings in Azure App Service:

- `DATABASE_URL`
- `NEXT_PUBLIC_APP_NAME`
- `NEXT_PUBLIC_APP_URL`
- `MICROSOFT_ENTRA_TENANT_ID`
- `MICROSOFT_ENTRA_CLIENT_ID`
- `MICROSOFT_ENTRA_CLIENT_SECRET`
- `MICROSOFT_GRAPH_SENDER`
- `AUTH_SECRET`
- `AZURE_STORAGE_CONNECTION_STRING`
- `AZURE_STORAGE_CONTAINER`
- `APPINSIGHTS_CONNECTION_STRING`

Recommended runtime:

- Node.js 22 LTS
- Linux App Service Plan
- Always On enabled
- HTTPS Only enabled

## Production Deployment Steps

1. Create Azure resource group.
2. Create Azure App Service Plan.
3. Create Azure App Service.
4. Create Azure Database for PostgreSQL.
5. Create Azure Storage Account and private blob container.
6. Create Azure Key Vault.
7. Create Application Insights.
8. Configure environment variables in App Service.
9. Add GitHub secrets and variables.
10. Run the manual `Deploy to Azure App Service` GitHub Actions workflow.
11. Confirm `/`, `/staff`, `/staff/request`, and `/admin` load.

## Provisioning Script

This repo includes a PowerShell provisioning script:

```powershell
.\scripts\provision-azure.ps1 `
  -ResourceGroup "rg-nowtravels-helpdesk-prod" `
  -Location "uksouth" `
  -AppName "nowtravels-ict-helpdesk"
```

Before running it:

```powershell
az login
az account set --subscription "<subscription-id-or-name>"
```

The script creates:

- Resource group
- Linux App Service Plan
- Azure App Service
- Azure Database for PostgreSQL Flexible Server
- PostgreSQL database
- Azure Storage Account
- Private Blob container for attachments
- Application Insights
- Core Azure App Service settings

The script prints the GitHub variables and secrets needed by the deployment workflow.

## GitHub Settings

After Azure resources are created, configure these repository variables:

- `AZURE_WEBAPP_NAME`
- `NEXT_PUBLIC_APP_URL`

Configure these repository secrets:

- `DATABASE_URL`
- `AZURE_WEBAPP_PUBLISH_PROFILE`
- `AZURE_STORAGE_CONNECTION_STRING`
- `APPINSIGHTS_CONNECTION_STRING`

Optional helper script:

```powershell
winget install GitHub.cli
gh auth login
.\scripts\set-github-deployment-settings.ps1 `
  -Repository "aihebest/nowtravels-ict-helpdesk" `
  -AzureWebAppName "<app-name>" `
  -AppUrl "<app-url>" `
  -DatabaseUrl "<database-url>" `
  -AzureStorageConnectionString "<storage-connection-string>" `
  -AppInsightsConnectionString "<appinsights-connection-string>"
```

The Azure publish profile can be downloaded from the App Service portal or Deployment Center, then added as `AZURE_WEBAPP_PUBLISH_PROFILE`.

## Future Improvements

- Add staging deployment slot.
- Add database migrations to CI/CD.
- Add smoke tests after deployment.
- Add uptime monitoring and alert rules.
- Use managed identity instead of connection strings where possible.
