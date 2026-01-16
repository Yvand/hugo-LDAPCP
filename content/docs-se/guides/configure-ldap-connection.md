---
title: "Configure the LDAP connection"
description: ""
lead: ""
date: 2026-01-13
lastmod: 2026-01-13
draft: false
images: []
weight: 300
toc: true
---

By default, LDAPCP connects to the Active Directory the SharePoint servers belong to, as the application pool / process identity.

## Add a LDAPS connection

To encrypt the LDAP traffic between SharePoint and the LDAP server, you can configure the connection to use LDAPS (LDAP over SSL).

{{< callout context="caution" title="Important" icon="outline/alert-triangle" >}} Before you proceed, ensure that LDAPS is configured on the LDAP server ([documentation for Active Directory](https://learn.microsoft.com/en-us/troubleshoot/windows-server/active-directory/enable-ldap-over-ssl-3rd-certification-authority)). Otherwise, you can add a LDAP connection. {{< /callout >}}

{{< tabs "ldaps-add-connection" >}}
{{< tab "Central administration" >}}

To add the connection to LDAPCP using the Central Administration:

- Navigate to the SharePoint Central Administration > Security > LDAPCP SE Global configuration.
- In the section **Register a new LDAP connection**, fill the fields as below:
   - In the **LDAP path**, type the connection using this format: `LDAP://contoso.local:636/DC=contoso,DC=local`.
   - Fill the username and password.
   - In **Select the authentication type to use**, make sure to select **Encryption**. Other options can also be selected if needed.
- Click on **Add LDAP connection** to add the connection.

{{< /tab >}}
{{< tab "PowerShell" >}}

To add the connection to LDAPCP using PowerShell:

```powershell
Add-Type -AssemblyName "Yvand.LDAPCPSE, Version=1.0.0.0, Culture=neutral, PublicKeyToken=80be731bc1a1a740"
$config = [Yvand.LdapClaimsProvider.LDAPCPSE]::GetConfiguration()
$settings = $config.Settings

# Create a LDAPS Connection
$ldapConnection = New-Object "Yvand.LdapClaimsProvider.Configuration.DirectoryConnection"
$ldapConnection.LdapPath = "LDAP://contoso.local:636/DC=contoso,DC=local"
$ldapConnection.Username = "contoso\serviceAccount"
$ldapConnection.Password = "<PASSWORD>"
$ldapConnection.AuthenticationType = [System.DirectoryServices.AuthenticationTypes] "Encryption" # Other options can also be added if needed

$settings.LdapConnections.Add($ldapConnection)
$config.ApplySettings($settings, $true)
```

{{< /tab >}}
{{< /tabs >}}

## Add a LDAP connection

{{< tabs "ldap-add-connection" >}}
{{< tab "Central administration" >}}

To add the connection to LDAPCP using the Central Administration:

- Navigate to the SharePoint Central Administration > Security > LDAPCP SE Global configuration.
- In the section **Register a new LDAP connection**, fill the fields as below:
   - In the **LDAP path**, type the connection using this format: `LDAP://contoso.local/DC=contoso,DC=local`.
   - Fill the username and password.
   - In **Select the authentication type to use**, select the options as needed.
- Click on **Add LDAP connection** to add the connection.

{{< /tab >}}
{{< tab "PowerShell" >}}

To add the connection to LDAPCP using PowerShell:

```powershell
Add-Type -AssemblyName "Yvand.LDAPCPSE, Version=1.0.0.0, Culture=neutral, PublicKeyToken=80be731bc1a1a740"
$config = [Yvand.LdapClaimsProvider.LDAPCPSE]::GetConfiguration()
$settings = $config.Settings

# Create a LDAP Connection
$ldapConnection = New-Object "Yvand.LdapClaimsProvider.Configuration.DirectoryConnection"
$ldapConnection.LdapPath = "LDAP://contoso.local/DC=contoso,DC=local"
$ldapConnection.Username = "contoso\serviceAccount"
$ldapConnection.Password = "<PASSWORD>"

$settings.LdapConnections.Add($ldapConnection)
$config.ApplySettings($settings, $true)
```

{{< /tab >}}
{{< /tabs >}}
