---
title: "Introduction"
description: ""
lead: ""
date: 2021-05-26T09:09:00Z
lastmod: 2021-08-06T11:15:29Z
draft: false
images: []
weight: 100
toc: true
---

{{< callout context="caution" title="Important" >}} LDAPCP Classic is deprecated. Migrating to LDAPCP SE is [safe and easy]({{< relref "/docs-se/guides/upgrade-from-classic" >}}). {{< /callout >}}

## Use case

LDAPCP is useful when SharePoint is federated with ADFS (or a similar STS) using [WS-Federation](https://docs.microsoft.com/sharepoint/security-for-sharepoint-server/implement-saml-based-authentication-in-sharepoint-server) or [OpenID Connect](https://docs.microsoft.com/en-us/sharepoint/security-for-sharepoint-server/oidc-1-0-authentication).  
It runs inside SharePoint and queries your Active Directory and LDAP servers to find users and groups:

![Image](images/people-picker-LDAPCP-Yvan.png "")

It can be easily tested by deploying [this ARM template](https://azure.microsoft.com/en-us/resources/templates/sharepoint-adfs/) in Azure: It creates a full SharePoint farm, configures federation with ADFS and installs LDAPCP.

## Compatibility

LDAPCP is fully compatible with all the supported versions of SharePoint Server: SharePoint Subscription, SharePoint 2019, SharePoint 2016 and SharePoint 2013.

## Features

- Fix the search in the people picker.
- Get group membership (augmentation).
- Query multiple Active Directory and LDAP servers in parallel.
- Populate the metadata (e.g. email, display name) of the entities.
- Easy to configure through PowerShell or administration pages.
- No dependency on any SharePoint service application.

## Customization

LDAPCP is highly customizable to adapt to your requirements:

- Configure the details of the LDAP connection (security options, root container, etc...).
- Customize the display of the results in the people picker.
- Customize the claim types and their mapping with the LDAP objects.
- Enable/disable augmentation.
- Developers can deeply [customize LDAPCP]( ref "for-developers" ) to meet specific needs.
