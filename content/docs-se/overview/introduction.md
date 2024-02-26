---
title: "Introduction"
description: ""
lead: ""
date: 2021-05-26T09:09:00Z
lastmod: 2021-08-06T11:15:29Z
draft: false
images: []
menu: 
  docs-se:
    parent: "se-overview"
    identifier: "introduction"
weight: 100
toc: true
seo:
  title: "" # custom title (optional)
  description: "" # custom description (recommended)
  canonical: "" # custom canonical URL (optional)
  noindex: false # false (default) or true
---

{{< callout note >}} LDAPCP Second Edition is a complete rewrite of LDAPCP (Classic), to replace it and bring major improvements in terms of reliability, administration and features. [See the announcement](https://github.com/Yvand/LDAPCP/discussions/201) to know more about the reasons for this new claims provider. {{< /callout >}}

## Use case

LDAPCP is useful when SharePoint is federated with ADFS (or a similar STS) using [WS-Federation](https://docs.microsoft.com/sharepoint/security-for-sharepoint-server/implement-saml-based-authentication-in-sharepoint-server) or [OpenID Connect](https://docs.microsoft.com/en-us/sharepoint/security-for-sharepoint-server/oidc-1-0-authentication).  
It runs inside SharePoint and queries your Active Directory and LDAP servers to find users and groups:

![Image](images/people-picker-LDAPCP-Yvan.png "")

It can be easily tested by deploying [this ARM template](https://azure.microsoft.com/en-us/resources/templates/sharepoint-adfs/) in Azure: It creates a full SharePoint farm, configures federation with ADFS and installs LDAPCP.

## Prerequisites

- SharePoint Subscription Edition, SharePoint 2019 or SharePoint 2016.
- [.NET Framework 4.8](https://dotnet.microsoft.com/en-us/download/dotnet-framework/net48) or newer on all SharePoint servers.

## Features

- Searches users and groups based on the people picker's input.
- Gets group membership of trusted users (augmentation).
- Queries multiple AD / LDAP servers in parallel.
- Populates the metadata (e.g. email, display name) of the entities.
- Easy to configure through PowerShell or administration pages.
- No dependency on any SharePoint service application.

## Improvements over LDAPCP Classic

- The SharePoint solution is now of type `ApplicationServer`, which both simplifies and improves the reliability of the install/update/remove operations.
- Administration pages were redesigned to be more intuitive while offering more customization.
- Supports using the SID attribute.
- Gets the nested groups when doing augmentation using LDAP queries.
- A ton of optimizations.
