---
title: "For developers"
description: ""
lead: "Possibilities of customization for developers"
date: 2021-05-17T20:17:20Z
lastmod: 2021-05-17T20:17:20Z
draft: false
images: []
menu: 
  docs:
    parent: "usage"
weight: 870
toc: true
---

## When LDAPCP may need to be customized

Project has evolved a lot since it started, and now most of the customizations can be made out of the box.  
However, there are still some scenarios where a developer may want to customize LDAPCP:

- Use LDAPCP with multiple SPTrustedIdentityTokenIssuer.
- Have full control on the entities (permissions) created by LDAPCP.

## How to proceed

For that, the class LDAPCP can be inherited to create a class that will be a new, unique claims provider in SharePoint.  
[Each release](https://github.com/Yvand/LDAPCP/releases) comes with a Visual Studio sample project "LDAPCP.Developers.zip". It contains several sample classes that demonstrates various customizations capabilities.
Each class inheriting LDAPCP is a unique claims provider, and only 1 can be installed at a time by the feature event receiver.

Common mistakes to avoid:

- Both LDAPCP.wsp and the custom version need ldapcp.dll. Be aware that updating / removing one package will affect the ldapcp.dll used by the other.
- **Always deactivate the farm feature adding the claims provider before retracting the solution**. [Check this page]({{< ref "/docs/usage/remove" >}}) for more information.

If something goes wrong during solution deployment, [check this page]({{< ref "/docs/help/fix-setup-issues" >}}) to resolve problems.  
