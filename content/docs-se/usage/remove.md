---
title: "Remove"
description: "This article describes the steps required to remove LDAPCPSE from your SharePoint farm."
lead: ""
date: 2021-05-20T10:45:52Z
lastmod: 2024-02-15
draft: false
images: []
weight: 230
toc: true
---

This article describes the steps required to remove LDAPCPSE from your SharePoint farm.

{{< callout context="caution" title="Important" icon="alert-triangle" >}} Do not merely retract the solution! The features must be manually deactivated and uninstalled before the solution is retracted. {{< /callout >}}
{{< callout context="caution" title="Important" icon="alert-triangle" >}} Do all the operations below on the server running the central administration, and in a new PowerShell process. {{< /callout >}}

## Reset property ClaimProviderName in the SPTrustedIdentityTokenIssuer

Unfortunately, the only supported way to clear the property ClaimProviderName is to remove and recreate the SPTrustedIdentityTokenIssuer object.  
Alternatively, this property can be reset using .NET reflection, but this is not supported and you do this at your own risks:

```powershell
# Set private member m_ClaimProviderName to null. Note that using .NET reflection on SharePoint objects is not supported and you do this at your own risks
$trust = Get-SPTrustedIdentityTokenIssuer "<SPTRUST_NAME>"
$trust.GetType().GetField("m_ClaimProviderName", "NonPublic, Instance").SetValue($trust, $null)
$trust.Update()
```

## Uninstall LDAPCP SE

{{< tabs "uninstall-entracp-type" >}}
{{< tab "Automated uninstall" >}}

Run the following script on the server running the central administration, to completely uninstall LDAPCP SE from the SharePoint farm:

```powershell
<#
.SYNOPSIS
    Uninstalls "LDAPCPSE.wsp" in a simple, automated way
.DESCRIPTION
    Run this script ONLY on the server running the central administration, in a new PowerShell process.
    The script does not require any modification.
.LINK
    https://ldapcp.com/docs-se/usage/remove/
#>

$product = "LDAPCPSE"
$featureNamePrefix = "Yvand"
Write-Host "Disables the features present in $product.wsp solution"
Disable-SPFeature -Identity "$featureNamePrefix.$product" -Confirm:$false # This will remove the claims provider from the farm
Disable-SPFeature -Identity "$featureNamePrefix.$product.Administration" -Url $([Microsoft.SharePoint.Administration.SPAdministrationWebApplication]::Local.Url) -Confirm:$false

Write-Host "Uninstalls the features present in $product.wsp solution"
Uninstall-SPFeature -Identity "$featureNamePrefix.$product" -Confirm:$false
Uninstall-SPFeature -Identity "$featureNamePrefix.$product.Administration" -Confirm:$false

# Sanity check: The solution should not be retracted until its features are properly removed, because it cannot be done afterward
if ($null -eq (Get-SPFeature | ?{$_.DisplayName -like "$featureNamePrefix.$product*"}) -and
    $null -eq (Get-SPClaimProvider -Identity "$product" -ErrorAction SilentlyContinue)) {
    
    Write-Host "Retracts the $product.wsp solution"
    Uninstall-SPSolution -Identity "$product.wsp" -Confirm:$false
    
    $count = 0
    $maxAttempts = 10
    do
    {
        Write-Host "Waiting for the solution $product.wsp to be retracted..."
        Start-Sleep -Seconds 10
        $solution = Get-SPSolution -Identity "$product.wsp"
        $count++
    }
    while ($count -lt $maxAttempts -and $false -ne $solution.Deployed -and $false -ne $solution.JobExists)
    
    if ($false -eq $solution.Deployed -and $false -eq $solution.JobExists) {
        Write-Host "Removes the $product.wsp solution"
        Remove-SPSolution -Identity "$product.wsp" -Confirm:$false
    }
}
```

{{< /tab >}}
{{< tab "Manual uninstall" >}}

This script does the minimum work required in PowerShell, before you can safely retract the solution from the central administration.  

1. Run the following script on the server running the central administration:

    ```powershell
    # Disables the features present in LDAPCPSE.wsp solution
    Disable-SPFeature -Identity "Yvand.LDAPCPSE" # This will remove the claims provider from the farm
    Disable-SPFeature -Identity "Yvand.LDAPCPSE.Administration" -Url $([Microsoft.SharePoint.Administration.SPAdministrationWebApplication]::Local.Url)

    # Uninstalls the features present in LDAPCPSE.wsp solution
    Uninstall-SPFeature -Identity "Yvand.LDAPCPSE"
    Uninstall-SPFeature -Identity "Yvand.LDAPCPSE.Administration"

    # Sanity check
    if ($null -eq (Get-SPFeature | ?{$_.DisplayName -like "Yvand.LDAPCPSE*"}) -and
        $null -eq (Get-SPClaimProvider -Identity "LDAPCPSE" -ErrorAction SilentlyContinue)) {
        Write-Host "You can now safely retract LDAPCPSE.wsp"
    } else {
        Write-Warning "You should not retract LDAPCPSE.wsp until all its features and its claims provider are properly removed. You won't be able to do it after you retracted the solution, unless you redeploy the solution"
    }
    ```

1. Browse to the central administration > System Settings > Manage farm solutions > LDAPCPSE.wsp > Retract Solution
1. Once the solution is retracted, click again on LDAPCPSE.wsp > Remove Solution

{{< /tab >}}
{{< /tabs >}}
