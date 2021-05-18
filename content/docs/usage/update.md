---
title: "Update"
description: "How to update LDAPCP"
lead: "Update LDAPCP in the SharePoint farm"
date: 2021-05-17T10:37:57Z
lastmod: 2021-05-17T10:37:57Z
draft: false
images: []
menu: 
  docs:
    parent: "usage"
weight: 850
toc: true
---

{{< alert icon="💡" text="Always start a new PowerShell process to ensure using up to date persisted objects and avoid nasty errors.<br>Bear in mind that additional steps are required on SharePoint servers which do not run the service 'Microsoft SharePoint Foundation Web Application'." >}}

## Update the solution

Start a SharePoint management shell on the server running the central administration:

- Run Update-SPSolution on the server running central administration:

```powershell
# This will start a timer job that will deploy the update on SharePoint servers. Central administration will restart during the process
Update-SPSolution -GACDeployment -Identity "LDAPCP.wsp" -LiteralPath "F:\Data\Dev\LDAPCP.wsp"
```

- Visit central administration > System Settings > Manage farm solutions: Wait until solution status shows "Deployed"
> If status shows "Error", restart the SharePoint timer service on servers where depployment failed, start a new PowerShell process and run Update-SPSolution again.

## Finish the installation

`Update-SPSolution` updates the bits only on the servers running the service "Microsoft SharePoint Foundation Web Application", but LDAPCP must be updated on all SharePoint servers.  
To complete the update, follow the steps described in the section ["Finish the installation" in the installation page]({{< relref "install.md#finish-the-installation" >}}).

## Breaking changes

Version 10 is a major update that has breaking changes. Updating to v10 (or newer) will reset claim type configuration list, and all customization made to that list will be lost.
