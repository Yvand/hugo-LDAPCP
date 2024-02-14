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

`LDAPCP Classic` and `LDAPCP Second Edition` are 2 independent SharePoint solutions, and 2 different claims providers, so it is perfectly safe to have both on the same SharePoint farm, which makes the upgrade very easy.  
The main point of attention is `LDAPCP SE` cannot import the configuration from `LDAPCP Classic`, so it needs to be recreated.

## Technical differences

| Minimum requirement / product | LDAPCP SE | LDAPC Classic |
|--|--|--|
| .NET Framework | .NET 4.8 | .NET 4.5 |
| SharePoint version | 2016 | 2013 |
| SharePoint solution type | ApplicationServer | web-front-end |
