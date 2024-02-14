---
title: "Configure"
description: ""
lead: "Configure LDAPCP to fit your needs"
date: 2021-05-17T14:06:29Z
lastmod: 2021-05-17T14:06:29Z
draft: false
images: []
menu: 
  docs-classic:
    parent: "classic-usage"
    identifier: "classic-configure"
weight: 810
toc: true
aliases:
  - /Configure-LDAPCP.html
---

## Configure with administration pages

LDAPCP comes with 2 administration pages added in central administration > Security:

- Global configuration: Add / remove LDAP servers and configure various settings.
- Claim types configuration: Define the claim types, and their mapping with LDAP objects.

## Configure with PowerShell

Starting with v10, LDAPCP can be configured with PowerShell:

### Show the current configuration

This returns the overall configuration:

```powershell
Add-Type -AssemblyName "ldapcp, Version=1.0.0.0, Culture=neutral, PublicKeyToken=80be731bc1a1a740"
$config = [ldapcp.LDAPCPConfig]::GetConfiguration("LDAPCPConfig")
# To view current configuration
$config
$config.ClaimTypes
```

### Enable augmentation

This script enables the augmentation:

```powershell
Add-Type -AssemblyName "ldapcp, Version=1.0.0.0, Culture=neutral, PublicKeyToken=80be731bc1a1a740"
$config = [ldapcp.LDAPCPConfig]::GetConfiguration("LDAPCPConfig")
# both properties need to be set for augmentation to work
$config.EnableAugmentation = $true
$config.MainGroupClaimType = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
# it also needs to be enabled on at least one connection
foreach ($connection in $config.LDAPConnectionsProp) {
  $connection.EnableAugmentation = $true
}
$config.Update()
```

### Set a LDAP filter

This script excludes groups which start with "Domain", such as "Domain Admins", "Domain Computers", "Domain Controllers", etc...:

```powershell
Add-Type -AssemblyName "ldapcp, Version=1.0.0.0, Culture=neutral, PublicKeyToken=80be731bc1a1a740"
$config = [ldapcp.LDAPCPConfig]::GetConfiguration("LDAPCPConfig")
$config.ClaimTypes | Where-Object EntityType -like "Group" | ForEach-Object {
    $_.AdditionalLDAPFilter = "(&(objectCategory=group)(!cn=domain*))"
}
$config.Update()
```

### Add a claim type to LDAPCP

If the SPTrustedLoginProvider has a custom claim type that is missing in LDAPCP, it can be added through PowerShell:

```powershell
Add-Type -AssemblyName "ldapcp, Version=1.0.0.0, Culture=neutral, PublicKeyToken=80be731bc1a1a740"
$config = [ldapcp.LDAPCPConfig]::GetConfiguration("LDAPCPConfig")
# Add a new entry to the claim types configuration list
$newCTConfig = New-Object ldapcp.ClaimTypeConfig
$newCTConfig.ClaimType = "ClaimTypeValue"
$newCTConfig.EntityType = [ldapcp.DirectoryObjectType]::User
$newCTConfig.LDAPClass = "LDAPClassVALUE"
$newCTConfig.LDAPAttribute = "LDAPAttributeVALUE"
$config.ClaimTypes.Add($newCTConfig)
$config.Update()
```

### Remove a claim type from LDAPCP

```powershell
Add-Type -AssemblyName "ldapcp, Version=1.0.0.0, Culture=neutral, PublicKeyToken=80be731bc1a1a740"
$config = [ldapcp.LDAPCPConfig]::GetConfiguration("LDAPCPConfig")
# Remove a claim type from the claim types configuration list
$config.ClaimTypes.Remove("ClaimTypeValue")
$config.Update()
```

## Persistence of the configuration

LDAPCP configuration is stored as a persisted object in the SharePoint configuration database, and it can be returned with this SQL command:

```sql
SELECT Id, Name, cast (properties as xml) AS XMLProps FROM Objects WHERE Name = 'LdapcpConfig'
```
