---
title: "Limitations"
description: ""
lead: "LDAPCP has limitations which SharePoint administrators should be aware of before installing it."
date: 2021-06-01T11:51:04Z
lastmod: 2021-06-01T11:51:04Z
draft: false
images: []
menu: 
  docs-classic:
    parent: "classic-overview"
    identifier: "classic-limitations"
weight: 150
toc: true
---

{{< callout context="caution" title="Important" >}} LDAPCP Classic is deprecated. Migrating to LDAPCP SE is [safe and easy]({{< relref "/docs-se/guides/upgrade-from-classic" >}}). {{< /callout >}}

## When LDAPCP cannot be used

- SharePoint servers have no network access to the AD/LDAP server which contains the users.
- Cmdlet `New-SPTrustedIdentityTokenIssuer` was run with the switch `-UseDefaultConfiguration`.
- It is already associated with a trust, and you want to associate it with a new trust.
