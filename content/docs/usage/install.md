---
title: "Install"
description: "Install LDAPCP"
lead: "Install LDAPCP in your SharePoint farm"
date: 2021-05-17T13:21:55Z
lastmod: 2021-05-17T13:21:55Z
draft: false
images: []
menu: 
  docs:
    parent: "usage"
weight: 800
toc: true
---

## Important

SharePoint (especially 2019) has unaddressed reliability issues when deploying farm solutions on farms with multiple servers.  
The more servers the farm has, the bigger the risk that deployment fails. To mitigate this, cmdlet `Install-SPSolution` can be run with `-Local` on each server, but it requires more operations.  
This page will guide you through the steps to install LDAPCP in a safe and reliable way.

## Deploy the solution

{{< alert icon="💡" text="Always start a new PowerShell process to ensure using up to date persisted objects and avoid nasty errors." >}}

Execute the following steps on the server running the central administration:

- Download [the latest version](https://github.com/Yvand/LDAPCP/releases/latest) of LDAPCP.wsp.
- Install and deploy the solution, using either the __simple__ or the __safe__ method:
  - __Simple__ method: Recommended for single-server farms only:

  ```powershell
  # Run this script on the server running central administration, in a new PowerShell process
  Add-SPSolution -LiteralPath "C:\Data\LDAPCP.wsp"
  # Wait for some time (until solution is actually added)
  # Then run Install-SPSolution (without -Local) to deploy solution globally (on all servers that run service "Microsoft SharePoint Foundation Web Application"):
  Install-SPSolution -Identity "LDAPCP.wsp" -GACDeployment
  ```
  
  - __Safe__ method: Recommended for production environments with multiple servers:

  ```powershell
  <#
  .SYNOPSIS
      Deploy "LDAPCP.wsp" in a reliable way, to address reliability issues that may occur when deploying solutions in SharePoint (especially 2019) (and especially if there are many servers):
  .DESCRIPTION
      Run this script on ALL SharePoint servers which run the service "Microsoft SharePoint Foundation Web Application", sequentially (not in parallel), starting with the one running central administration (even if it does not run the service):
  .LINK
      https://www.ldapcp.com/docs/usage/install/
  #>

  # To use this script, you only need to edit the $fullpath variable below
  $claimsprovider = "LDAPCP"
  $fullpath = "C:\Data\$claimsprovider.wsp"
  $packageName = "$claimsprovider.wsp"

  # Perform checks to detect and prevent potential problems
  # Test 1: Install-SPSolution will fail if claims provider is already installed on the current server
  if ($null -ne (Get-SPClaimProvider -Identity $claimsprovider -ErrorAction SilentlyContinue)) {
      Write-Error "Cannot continue because current server already has claims provider $claimsprovider, which will cause an error when running Install-SPSolution."
      throw ("Cannot continue because current server already has claims provider $claimsprovider, which will cause an error when running Install-SPSolution.")
      Get-SPClaimProvider| ?{$_.DisplayName -like $claimsprovider}| Remove-SPClaimProvider
  }

  # Test 2: Install-SPSolution will fail if any feature in the WSP solution is already installed on the current server
  if ($null -ne (Get-SPFeature| ?{$_.DisplayName -like "$claimsprovider*"})) {
      Write-Error "Cannot continue because current server already has features of $claimsprovider, Visit https://www.ldapcp.com/docs/help/fix-setup-issues/ to fix this."
      throw ("Cannot continue because current server already has features of $claimsprovider, Visit https://www.ldapcp.com/docs/help/fix-setup-issues/ to fix this.")
  }

  # Add the solution if it's not already present (only the 1st server will do it)
  if ($null -eq (Get-SPSolution -Identity $packageName -ErrorAction SilentlyContinue)) {
      Write-Host "Adding solution $packageName to the farm..."
      Add-SPSolution -LiteralPath $fullpath
  }

  $count = 0
  while (($count -lt 20) -and ($null -eq $solution))
  {
      Write-Host "Waiting for the solution $packageName to be available..."
      Start-Sleep -Seconds 5
      $solution = Get-SPSolution -Identity $packageName
      $count++
  }

  if ($null -eq $solution) {
      Write-Error "Solution $packageName could not be found."
      throw ("Solution $packageName could not be found.")
  }

  # Always wait at least 5 seconds to avoid that Install-SPSolution does not actually trigger deployment
  Start-Sleep -Seconds 5
  Write-Host "Deploying solution $packageName to the farm..."
  # If -local is omitted, solution files will be deployed in all servers that run service "Microsoft SharePoint Foundation Web Application", but it may fail due to reliability issues in SharePoint
  Install-SPSolution -Identity $packageName -GACDeployment -Local
  ```

- Visit central administration > System Settings > Manage farm solutions: Confirm the solution is "Globally deployed".

{{< alert icon="💡" text="If you ran `Install-SPSolution` with `-Local`, but not on every SharePoint server running the service \"Microsoft SharePoint Foundation Web Application\", the solution will NOT be \"Globally deployed\" and SharePoint will NOT activate LDAPCP features." >}}

## Finish the installation

Regardless of how `Install-SPSolution` was executed, for all the other SharePoint servers which **do NOT run the service "Microsoft SharePoint Foundation Web Application"**, you must manually add LDAPCP DLLs to their GAC.  
For each of those servers:

- Use [7-zip](https://www.7-zip.org/) to extract ldapcp.dll from LDAPCP.wsp
- Run the script below to add ldapcp.dll to the GAC:

  ```powershell
  [System.Reflection.Assembly]::Load("System.EnterpriseServices, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a") | Out-Null
  $publish = New-Object System.EnterpriseServices.Internal.Publish

  try
  {
      # Method Publish.GacRemove() removes the assembly from the GAC if it exists (for update scenarios)
      $existingAssembly = [System.Reflection.Assembly]::Load("ldapcp, Version=1.0.0.0, Culture=neutral, PublicKeyToken=80be731bc1a1a740").Location
      $publish.GacRemove($existingAssembly)
      Write-Host "Assembly $existingAssembly successfully removed."
  } catch {}

  # Adds assembly to the GAC
  $publish.GacInstall("C:\LDAPCP-wsp-unzipped\ldapcp.dll")
  Write-Host "Assembly was successfully added to the GAC."
  ```

- Restart the IIS service and the SharePoint timer service (SPTimerV4) on all SharePoint servers.

## Enable the claims provider

To enable LDAPCP, it must be associated with the SPTrustedLoginProvider which stores the configuration with the trusted STS:

```powershell
$trust = Get-SPTrustedIdentityTokenIssuer "SPTRUST NAME"
$trust.ClaimProviderName = "LDAPCP"
$trust.Update()
```

You can now [configure LDAPCP]({{< ref "configuration" >}}).
