---
title: "Upgrade from LDAPCP Classic"
description: ""
lead: ""
date: 2021-05-26T09:09:00Z
lastmod: 2021-08-06T11:15:29Z
draft: false
images: []
menu: 
  docs-se:
    parent: "se-guides"
weight: 100
toc: true
seo:
  title: "" # custom title (optional)
  description: "" # custom description (recommended)
  canonical: "" # custom canonical URL (optional)
  noindex: false # false (default) or true
---

## Overview

`LDAPCP Classic` and `LDAPCP Second Edition` are 2 independent SharePoint solutions / claims providers. It is perfectly safe to run both on the same SharePoint farm: Installing/updating/removing one has no effect on the other.  

{{< callout note >}} [See the announcement](https://github.com/Yvand/LDAPCP/discussions/201) to know more about the reasons for this new claims provider. {{< /callout >}}

{{< callout context="caution" title="Important" icon="alert-triangle" >}} `LDAPCP SE` and `LDAPCP Classic` each have their own configuration, and `LDAPCP SE` cannot import the configuration from `LDAPCP Classic`. {{< /callout >}}

## Differences between solutions

`LDAPCP SE` has higher requirements:

| Minimum version required for | LDAPCP SE | LDAPC Classic |
|--|--|--|
| .NET Framework | .NET 4.8 | .NET 4.6.2 |
| SharePoint version | 2016 | 2013 |

The table below highlights the notable differences in SharePoint:

|  | LDAPCP SE | LDAPC Classic |
|--|--|--|
| Claims provider name | LDAPCPSE | LDAPCP |
| Product/Area in the logs | LDAPCPSE | LDAPCP |
| SharePoint [solution type](https://learn.microsoft.com/en-us/previous-versions/office/developer/sharepoint-2010/ms412929(v=office.14)) | `ApplicationServer` | `WebFrontEnd` |

## Switch between claims providers

On a farm where both claims providers are istalled, it is very quick to switch from one to the other:

- To enable `LDAPCP SE`:

```powershell
$trust = Get-SPTrustedIdentityTokenIssuer "SPTRUST NAME"
$trust.ClaimProviderName = "LDAPCPSE"
$trust.Update()
```

- To enable `LDAPCP Classic`:

```powershell
$trust = Get-SPTrustedIdentityTokenIssuer "SPTRUST NAME"
$trust.ClaimProviderName = "LDAPCP"
$trust.Update()
```

## Remove LDAPCP Classic

Once you are satisfied that `LDAPCP SE` runs well, you can safely [uninstall `LDAPCP Classic`]({{< relref "/docs-classic/usage/remove" >}}). This won't have any impact on `LDAPCP SE`.
