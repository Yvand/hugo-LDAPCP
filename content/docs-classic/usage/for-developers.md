---
title: "For developers"
description: ""
lead: "Possibilities of customization for developers"
date: 2021-05-17T20:17:20Z
lastmod: 2021-05-17T20:17:20Z
draft: false
images: []
weight: 240
toc: true
aliases:
  - /For-Developers.html
---

{{< callout context="caution" title="Important" >}} LDAPCP Classic is deprecated. Migrating to LDAPCP SE is [safe and easy]({{< relref "/docs-se/guides/upgrade-from-classic" >}}). {{< /callout >}}

## When LDAPCP may need to be customized

Project has evolved a lot since it started, and now most of the customizations can be made out of the box.  
However, there are still some scenarios where a developer may want to customize LDAPCP:

- Use LDAPCP with multiple SPTrustedIdentityTokenIssuer.
- Have full control on the entities (permissions) created by LDAPCP.

## How to proceed

For that, the class LDAPCP can be inherited to create a class that will be a new, unique claims provider in SharePoint.  
[Each release](https://github.com/Yvand/LDAPCP/releases) comes with a Visual Studio sample project "LDAPCP.Developers.zip". It contains several sample classes that demonstrate various customizations capabilities.

## Things to know

- Each class inheriting LDAPCP is a new claims provider, uniquely defined by the name of its class.
- Sample project has 1 feature event receiver, and it can manage only 1 claims provider.
- Both LDAPCP.wsp and the custom version need ldapcp.dll. Be aware that updating / removing one package will affect the ldapcp.dll used by the other.
- To avoid deployment issues, always deactivate the farm feature (which manages the claims provider) before retracting the solution.

If something goes wrong during solution deployment, [check this page]({{< relref "/docs-classic/help/fix-setup-issues" >}}) to resolve problems.  
