---
title: "Update"
description: "How to update LDAPCP"
lead: "Update LDAPCP in the SharePoint farm"
date: 2021-05-17T10:37:57Z
lastmod: 2021-08-06T11:15:29Z
draft: false
images: []
menu: 
  docs:
    parent: "usage"
weight: 850
toc: true
aliases:
  - /Update-LDAPCP.html
---

## Update the solution

{{< callout context="caution" title="Important" icon="alert-triangle" >}} Always start a new PowerShell process to ensure using up to date persisted objects and avoid nasty errors.<br>Bear in mind that additional steps are required on SharePoint servers which do not run the service 'Microsoft SharePoint Foundation Web Application'. {{< /callout >}}

On the server running the central administration:

1. Start a SharePoint management shell and run `Update-SPSolution`:

  ```powershell
  # This will start a timer job that will deploy the update on SharePoint servers. Central administration will restart during the process
  Update-SPSolution -GACDeployment -Identity "LDAPCP.wsp" -LiteralPath "F:\Data\Dev\LDAPCP.wsp"
  ```

2. Visit central administration > System Settings > Manage farm solutions: Wait until solution status shows "Deployed".
  {{< callout context="caution" title="Important" icon="alert-triangle" >}} Be patient, cmdlet Update-SPSolution triggers a one-time timer job on the SharePoint servers and this may take a minute or 2. {{< /callout >}}
  > If status shows "Error", restart the SharePoint timer service on servers where depployment failed, start a new PowerShell process and run Update-SPSolution again.

## Finalize the update

`Update-SPSolution` updates the bits only on the servers running the service "Microsoft SharePoint Foundation Web Application", but LDAPCP must be updated on all SharePoint servers.  
To complete the update, follow the steps described in the section ["Finalize the installation" in the install page]({{< relref "install.md#finalize-the-installation" >}}).

## Breaking changes

Version 10 is a major update that has breaking changes. Updating to v10 (or newer) will reset claim type configuration list, and all customization made to that list will be lost.
