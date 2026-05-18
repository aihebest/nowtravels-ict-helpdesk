param(
  [string]$ResourceGroup = "rg-nowtravels-helpdesk-prod",
  [string]$Location = "uksouth",
  [string]$AppName = "nowtravels-ict-helpdesk",
  [string]$PostgresAdmin = "helpdeskadmin",
  [string]$PostgresPassword,
  [string]$GitHubRepo = "aihebest/nowtravels-ict-helpdesk"
)

$ErrorActionPreference = "Stop"

if (-not $PostgresPassword) {
  $securePassword = Read-Host "Enter PostgreSQL admin password" -AsSecureString
  $PostgresPassword = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)
  )
}

$suffix = -join ((48..57) + (97..122) | Get-Random -Count 6 | ForEach-Object {[char]$_})
$storageName = ("stnowhelpdesk" + $suffix).ToLower()
$postgresName = ("pg-nowtravels-helpdesk-" + $suffix).ToLower()
$planName = "asp-nowtravels-helpdesk-prod"
$insightsName = "appi-nowtravels-helpdesk-prod"
$containerName = "ticket-attachments"
$databaseName = "nowtravels_helpdesk"

Write-Host "Creating resource group $ResourceGroup in $Location..."
az group create `
  --name $ResourceGroup `
  --location $Location `
  --output none

Write-Host "Creating App Service plan..."
az appservice plan create `
  --resource-group $ResourceGroup `
  --name $planName `
  --location $Location `
  --sku B1 `
  --is-linux `
  --output none

Write-Host "Creating Web App..."
az webapp create `
  --resource-group $ResourceGroup `
  --plan $planName `
  --name $AppName `
  --runtime "NODE:22-lts" `
  --output none

Write-Host "Enforcing HTTPS and Always On..."
az webapp update `
  --resource-group $ResourceGroup `
  --name $AppName `
  --https-only true `
  --set siteConfig.alwaysOn=true `
  --output none

Write-Host "Creating PostgreSQL Flexible Server..."
az postgres flexible-server create `
  --resource-group $ResourceGroup `
  --name $postgresName `
  --location $Location `
  --admin-user $PostgresAdmin `
  --admin-password $PostgresPassword `
  --sku-name Standard_B1ms `
  --tier Burstable `
  --version 16 `
  --storage-size 32 `
  --public-access 0.0.0.0 `
  --yes `
  --output none

Write-Host "Creating PostgreSQL database..."
az postgres flexible-server db create `
  --resource-group $ResourceGroup `
  --server-name $postgresName `
  --database-name $databaseName `
  --output none

Write-Host "Creating Storage Account and private attachments container..."
az storage account create `
  --resource-group $ResourceGroup `
  --name $storageName `
  --location $Location `
  --sku Standard_LRS `
  --kind StorageV2 `
  --https-only true `
  --allow-blob-public-access false `
  --output none

$storageConnectionString = az storage account show-connection-string `
  --resource-group $ResourceGroup `
  --name $storageName `
  --query connectionString `
  --output tsv

az storage container create `
  --name $containerName `
  --connection-string $storageConnectionString `
  --public-access off `
  --output none

Write-Host "Creating Application Insights..."
az monitor app-insights component create `
  --app $insightsName `
  --location $Location `
  --resource-group $ResourceGroup `
  --application-type web `
  --output none

$appInsightsConnectionString = az monitor app-insights component show `
  --app $insightsName `
  --resource-group $ResourceGroup `
  --query connectionString `
  --output tsv

$databaseUrl = "postgresql://${PostgresAdmin}:${PostgresPassword}@${postgresName}.postgres.database.azure.com:5432/${databaseName}?sslmode=require"
$appUrl = "https://${AppName}.azurewebsites.net"

Write-Host "Configuring Web App settings..."
az webapp config appsettings set `
  --resource-group $ResourceGroup `
  --name $AppName `
  --settings `
    DATABASE_URL="$databaseUrl" `
    NEXT_PUBLIC_APP_NAME="Nowtravels ICT Helpdesk" `
    NEXT_PUBLIC_APP_URL="$appUrl" `
    AZURE_STORAGE_CONNECTION_STRING="$storageConnectionString" `
    AZURE_STORAGE_CONTAINER="$containerName" `
    APPINSIGHTS_CONNECTION_STRING="$appInsightsConnectionString" `
  --output none

Write-Host ""
Write-Host "Azure resources created."
Write-Host "Resource group: $ResourceGroup"
Write-Host "Web app: $appUrl"
Write-Host "PostgreSQL server: $postgresName"
Write-Host "Storage account: $storageName"
Write-Host ""
Write-Host "GitHub repository settings to add:"
Write-Host "Variable AZURE_WEBAPP_NAME=$AppName"
Write-Host "Variable NEXT_PUBLIC_APP_URL=$appUrl"
Write-Host "Secret DATABASE_URL=<hidden PostgreSQL connection string>"
Write-Host "Secret AZURE_STORAGE_CONNECTION_STRING=<hidden storage connection string>"
Write-Host "Secret APPINSIGHTS_CONNECTION_STRING=<hidden Application Insights connection string>"
Write-Host "Secret AZURE_WEBAPP_PUBLISH_PROFILE=<download from Azure App Service Deployment Center>"
Write-Host ""
Write-Host "If GitHub CLI is installed and authenticated, you can set non-publish-profile values with:"
Write-Host "gh variable set AZURE_WEBAPP_NAME --repo $GitHubRepo --body `"$AppName`""
Write-Host "gh variable set NEXT_PUBLIC_APP_URL --repo $GitHubRepo --body `"$appUrl`""
Write-Host "gh secret set DATABASE_URL --repo $GitHubRepo --body `"$databaseUrl`""
Write-Host "gh secret set AZURE_STORAGE_CONNECTION_STRING --repo $GitHubRepo --body `"$storageConnectionString`""
Write-Host "gh secret set APPINSIGHTS_CONNECTION_STRING --repo $GitHubRepo --body `"$appInsightsConnectionString`""
