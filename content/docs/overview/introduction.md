---
title: "Introduction"
description: ""
lead: ""
date: 2021-05-26T09:09:00Z
lastmod: 2021-05-26T09:09:00Z
draft: false
images: []
menu: 
  docs:
    parent: "overview"
weight: 100
toc: true
---

## Use case

LDAPCP is useful when SharePoint 2019 / 2016 / 2013 is [federated with ADFS](https://docs.microsoft.com/sharepoint/security-for-sharepoint-server/implement-saml-based-authentication-in-sharepoint-server) (or any STS that uses an IDP which supports LDAP).  
It runs inside SharePoint and connects to Active Directory and LDAP servers to return users and groups to SharePoint in various scenarios, such as the people picker.

![people-picker-LDAPCP-Yvan](/images/people-picker-LDAPCP-Yvan.png)

## Features

- Query multiple Active Directory and LDAP servers in parallel.
- Easy to configure through dedicated pages in central administration, or using PowerShell.
- Return group membership of federated users (augmentation).
- Populate the metadata (e.g. email, display name) of entities.
- No dependency on any SharePoint service application.

## Customization

LDAPCP is highly customizable to adapt to your requirements:

- Configure the details of the LDAP connection (security options, root container, etc...).
- Customize the display of the results in the people picker.
- Customize the claim types and their mapping with the LDAP objects.
- Enable/disable augmentation.
- Developers can deeply [customize LDAPCP]({{< ref "for-developers" >}}) to meet specific needs.
