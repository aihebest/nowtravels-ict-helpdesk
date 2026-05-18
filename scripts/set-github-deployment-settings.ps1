param(
  [Parameter(Mandatory = $true)]
  [string]$Repository,

  [Parameter(Mandatory = $true)]
  [string]$AzureWebAppName,

  [Parameter(Mandatory = $true)]
  [string]$AppUrl,

  [Parameter(Mandatory = $true)]
  [string]$DatabaseUrl,

  [Parameter(Mandatory = $true)]
  [string]$AzureStorageConnectionString,

  [Parameter(Mandatory = $true)]
  [string]$AppInsightsConnectionString
)

$ErrorActionPreference = "Stop"

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
  throw "GitHub CLI is not installed. Install it with: winget install GitHub.cli"
}

gh auth status

gh variable set AZURE_WEBAPP_NAME --repo $Repository --body $AzureWebAppName
gh variable set NEXT_PUBLIC_APP_URL --repo $Repository --body $AppUrl

gh secret set DATABASE_URL --repo $Repository --body $DatabaseUrl
gh secret set AZURE_STORAGE_CONNECTION_STRING --repo $Repository --body $AzureStorageConnectionString
gh secret set APPINSIGHTS_CONNECTION_STRING --repo $Repository --body $AppInsightsConnectionString

Write-Host "GitHub variables and secrets were set."
Write-Host "Add AZURE_WEBAPP_PUBLISH_PROFILE manually or with:"
Write-Host "gh secret set AZURE_WEBAPP_PUBLISH_PROFILE --repo $Repository < publish-profile.xml"
