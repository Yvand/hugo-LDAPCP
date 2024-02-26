---
title: "Installation"
description: "This article describes the steps required to install LDAPCPSE in your SharePoint farm."
lead: ""
date: 2021-05-20T10:45:52Z
lastmod: 2024-02-15
draft: false
images: []
menu:
  docs-se:
    parent: "se-usage"
weight: 100
toc: true
---

This article describes the steps required to install LDAPCPSE in your SharePoint farm.

{{< details "About the installation" >}}
Installing LDAPCP SE is much easier and safer than LDAPCP Classic because it uses the deployment type `ApplicationServer`, which implies that:

- Its features are installed with a specific, additional step, preventing conflicts.
- Its assemblies are deployed on truly all SharePoint servers.
{{< /details >}}

## Download the latest release

Browse to the [latest release](https://github.com/Yvand/LDAPCP/releases/latest/) and download `LDAPCPSE.wsp`.

## Install LDAPCP SE

{{< tabs "install-ldapcpse-type" >}}
{{< tab "Automated install" >}}

Run the following script on the server running the central administration, in a new PowerShell process:

```powershell {title="Automated installation script for LDAPCP SE" lineNos=true}
<#
.SYNOPSIS
    Deploys the SharePoint solution LDAPCPSE.wsp, created with the deployment mode "Application"
.DESCRIPTION
    Run this script ONLY on the server running the central administration, in a new PowerShell process.
    The script does not require any modification, except to update the path in $packagefullpath.
.LINK
    https://ldapcp.com/docs-se/usage/installation/
#>

$product = "LDAPCPSE"
$packagefullpath = "C:\YvanData\$product.wsp" # Only update the path here

# Add the solution if it's not already present in the farm
if ($null -eq (Get-SPSolution -Identity "$product.wsp" -ErrorAction SilentlyContinue)) {
    Write-Host "Adding solution $product.wsp to the farm..."
    Add-SPSolution -LiteralPath $packagefullpath
}

$count = 0
while (($count -lt 20) -and ($null -eq $solution))
{
    Write-Host "Waiting for the solution $product.wsp to be available..."
    Start-Sleep -Seconds 5
    $solution = Get-SPSolution -Identity "$product.wsp"
    $count++
}

if ($null -eq $solution) {
    Write-Error "Solution $product.wsp could not be found in the farm."
    throw ("Solution $product.wsp could not be found in the farm.")
}

Write-Host "Deploying solution $product.wsp globally..."
Install-SPSolution -Identity "$product.wsp" -GACDeployment

$solution = Get-SPSolution -Identity "$product.wsp"
$count = 0
while (($count -lt 20) -and ($false -eq $solution.Deployed))
{
    Write-Host "Waiting for the solution $product.wsp to be deployed..."
    Start-Sleep -Seconds 10
    $solution = Get-SPSolution -Identity "$product.wsp"
    $count++
}

if ($null -ne (Get-SPFeature| Where-Object{$_.SolutionId -eq $solution.SolutionId}) -or
    $null -ne (Get-SPClaimProvider -Identity "$product" -ErrorAction SilentlyContinue)) {
  Write-Warning "The claims provider and/or the features are already installed, skip Install-SPFeature"
} else {
  Write-Host "Installing the features in the solution $product.wsp..."
  Install-SPFeature -SolutionId $solution.Id -AllExistingFeatures
}
Write-Host "Finished."
```

{{< /tab >}}
{{< tab "Manual install" >}}

Do the following on the server running the central administration:

1. Add the solution to the farm:

    ```powershell
    Add-SPSolution -LiteralPath "C:\YvanData\dev\LDAPCPSE.wsp"
    ```

1. Navigate to the central administration > Security > Manage farm solutions > click on "LDAPCPSE.wsp" > Deploy solution.
1. Monitor the deployment of the solution and wait for it to be fully deployed.
1. Install the features present in the solution:

    ```powershell
    Install-SPFeature -SolutionId "ff36c8cf-e510-42fc-8ba3-18af3c316aec" -AllExistingFeatures
    ```

{{< /tab >}}
{{< /tabs >}}

## Finalize the installation

On each SharePoint server, restart the IIS and the SharePoint timer services:

```powershell
Restart-Service -Name @("W3SVC", "SPTimerV4")
```

## Enable the claims provider

To be enabled, LDAPCP SE must be associated with the SPTrustedLoginProvider created when the federation was configured.  
Execute this script on the server running the central administration:

```powershell
$trust = Get-SPTrustedIdentityTokenIssuer "YOUR_SPTRUST_NAME"
$trust.ClaimProviderName = "LDAPCPSE"
$trust.Update()
```
