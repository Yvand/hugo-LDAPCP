---
title: "Fix Setup Issues"
description: ""
lead: "Sometimes, the install/uninstall/update of LDAPCP fails. This article will guide through the steps to clean this."
date: 2021-05-17T13:24:40Z
lastmod: 2021-05-17T13:24:40Z
draft: false
images: []
menu: 
  docs:
    parent: "help"
weight: 960
toc: true
aliases:
  - /Fix-setup-issues.html
---

This procedure will:

- Clean artifacts that were not correctly removed by SharePoint.
- Fully and properly uninstall the solution.

After it is commpleted, LDAPCP can be safely re-installed as if it was done for the 1st time.

## Remove LDAPCP claims provider

{{< alert icon="💡" text="Always start a new PowerShell process to ensure using up to date persisted objects and avoid nasty errors.<br>Execute all the operations below on the server running the central administration." >}}

This commands removes the SPClaimProvider object from the SharePoint farm:

```powershell
Get-SPClaimProvider| ?{$_.DisplayName -like "LDAPCP"}| Remove-SPClaimProvider
```

## Manually create the missing features

This step will recreate the missing folders of features that were physically removed from the filesystem, but not removed from SharePoint configuration database.

1. Identify LDAPCP features still installed

```powershell
# Return all LDAPCP features that are still installed on the farm
Get-SPFeature| ?{$_.DisplayName -like 'LDAPCP*'}| fl DisplayName, Scope, Id, RootDirectory
```

Usually, only LDAPCP farm feature is listed:

```text
DisplayName   : LDAPCP
Scope         : Farm
Id            : b37e0696-f48c-47ab-aa30-834d78033ba8
RootDirectory : C:\Program Files\Common Files\Microsoft Shared\Web Server Extensions\16\Template\Features\LDAPCP
```

2. Recreate missing feature folder if needed.

For each feature listed above, check if its "RootDirectory" actually exists in the file system of the current server.  
If it does not exist:

* Create the "RootDirectory". Based on output above, it would be "LDAPCP" in folder "16\Template\Features"
* Use [7-zip](http://www.7-zip.org/) to open LDAPCP.wsp and extract the feature.xml of the corresponding feature
* Copy the feature.xml into the "RootDirectory"

3. Deactivate and remove the features

```powershell
# Deactivate LDAPCP features (it may thrown an error if feature is already deactivated)
Get-SPFeature| ?{$_.DisplayName -like 'LDAPCP*'}| Disable-SPFeature -Confirm:$false
# Uninstall LDAPCP features
Get-SPFeature| ?{$_.DisplayName -like 'LDAPCP*'}| Uninstall-SPFeature -Confirm:$false
```

4. Once all features are uninstalled, delete the "RootDirectory" folder(s) that was created earlier.

## Delete the LDAPCP persisted object

LDAPCP stores its configuration is its own persisted object. This stsadm command will delete it if it was not already deleted:

```
stsadm -o deleteconfigurationobject -id 5D306A02-A262-48AC-8C44-BDB927620227
```

## Remove the LDAPCP solution

```powershell
Remove-SPSolution "LDAPCP.wsp" -Confirm:$false
```

Close PowerShell.  
LDAPCP is now properly and completely uninstalled. If desired, you may [re-install it]({{< relref "install" >}}).
