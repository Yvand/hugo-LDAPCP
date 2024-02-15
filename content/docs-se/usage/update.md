---
title: "Update"
description: "This article describes the steps required to update LDAPCPSE in your SharePoint farm."
lead: ""
date: 2021-05-20T10:45:52Z
lastmod: 2024-02-15
draft: false
images: []
menu:
  docs-se:
    parent: "se-usage"
weight: 120
toc: true
---

This article describes the steps required to update LDAPCPSE in your SharePoint farm.

## Download the latest release

Browse to the [latest release](https://github.com/Yvand/LDAPCP/releases/latest/) and download `LDAPCPSE.wsp`.

## Update the solution

Complete the steps below on the server running the central administration:

1. On the server running the central administration, start a new SharePoint management shell and run this command:

   ```powershell
   # This will start a timer job that will deploy the update on SharePoint servers. Central administration will restart during the process
   Update-SPSolution -GACDeployment -Identity "LDAPCPSE.wsp" -LiteralPath "C:\YvanData\LDAPCPSE.wsp"
   ```

1. Visit central administration > System Settings > Manage farm solutions: Wait until solution status shows "Deployed".
   {{< callout context="caution" title="Important" icon="alert-triangle" >}} Be patient, cmdlet Update-SPSolution triggers a one-time timer job on the SharePoint servers and this may take a minute or 2. {{< /callout >}}
   > If status shows "Error", restart the SharePoint timer service on the servers where the depployment failed, start a new PowerShell process and run `Update-SPSolution` again.

## Finalize the installation

On each SharePoint server, restart the IIS and the SharePoint timer services:

```powershell
Restart-Service -Name @("W3SVC", "SPTimerV4")
```
