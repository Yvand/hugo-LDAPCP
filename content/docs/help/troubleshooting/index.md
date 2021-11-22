---
title: "Troubleshooting"
description: ""
lead: "This article groups tips & tricks to help you troubleshoot LDAPCP if it's not working as expected."
date: 2021-05-17T13:24:28Z
lastmod: 2021-05-17T13:24:28Z
draft: false
images: []
menu: 
  docs:
    parent: "help"
weight: 950
toc: true
aliases:
  - /Troubleshoot-LDAPCP.html
---

## Check the SharePoint logs

LDAPCP records all its activity in SharePoint logs, including the performance, queries and number of results returned for each LDAP server.

Get LDAPCP logging level:

```powershell
Get-SPLogLevel| ?{$_.Area -like "LDAPCP"}
```

Set LDAPCP logging level:

```powershell
"LDAPCP:*"| Set-SPLogLevel -TraceSeverity Verbose
```

Merge LDAPCP logs from all servers from the past 10 minutes:

```powershell
Merge-SPLogFile -Path "C:\Data\LDAPCP_logging.log" -Overwrite -Area "LDAPCP" -StartTime (Get-Date).AddMinutes(-10)
```

## Replay LDAP queries

If people picker doesn't return expected results, it ca be helpful to replay the LDAP queries executed by LDAPCP (which are recorded in the logs) outside of SharePoint:

```powershell
$filter = "(&(objectClass=user)(|(sAMAccountName=yvand*)(cn=yvand*)))"
$ldapServer = "contoso.local"
$ldapBase = "DC=contoso,DC=local"
$ldapUser = "contoso\spfarm"
$ldapPassword = Read-Host "Enter the password (will appear in clear text)"
$ldapAuth = [System.DirectoryServices.AuthenticationTypes] "Secure, Signing"

$directoryEntry = New-Object System.DirectoryServices.DirectoryEntry("LDAP://$ldapServer/$ldapBase" , $ldapUser, $ldapPassword, $ldapAuth)
$objSearcher = New-Object System.DirectoryServices.DirectorySearcher ($directoryEntry, $filter)
# Uncomment line below to restrict properties returned by LDAP server
#$objSearcher.PropertiesToLoad.AddRange(@("cn"))

$results = $objSearcher.FindAll() 
Write-Host "Found $($results.Count) result(s)":
foreach ($objResult in $results)    {$objItem = $objResult.Properties; $objItem}
```

## Troubleshoot the augmentation

If augmentation is enabled, LDAPCP gets group membership of federated users to populate 2 kind of tokens:

- SharePoint SAML token of users, when they sign-in
- Non-interactive SharePoint token: this internal token is unique per user and per site collection, and used by some features like email alerts, "check permissions", incoming email, etc...

If augmentation does not work, here is how to troubleshoot it:

### Ensure augmentation is enabled in LDAPCP

Go to central administration > Security > LDAPCP global configuration page and validate that:

- Augmentation is enabled.
- A claim type for the groups is selected.
- Servers are enabled for augmentation.

### "Check permissions" feature is not working

This usually means that the non-interactive token does not contain the group membership.  
This token is per site collection and cached for 1 day.  
So to be 100% sure that you troubleshoot the refresh of this token, you need to create a new, temporary site collection:

```powershell
New-SPSite "http://spsites/sites/test" -OwnerAlias "i:0#.w|contoso\yvand" -Language 1033 -Template "STS#0"
```

Then, the 1st run of the script below will trigger a refresh of the non-interactive token of the user specified (do not sign-in on the site with that user):

```powershell
$web = Get-SPWeb "http://spsites/sites/test"
$userToTroubleshoot = "i:05.t|contoso.local|yvand@contoso.local"
# SPWeb.DoesUserHavePermissions() uses the non-interactive token, and will refresh it only if it is expired
$web.DoesUserHavePermissions($userToTroubleshoot, [Microsoft.SharePoint.SPBasePermissions]::EditListItems)
```

Then, you can check the SharePoint logs and filter on Product/Area "LDAPCP" and Category "Augmentation".  
You can also visualize logs in real time with [ULS Viewer](https://www.microsoft.com/en-us/download/details.aspx?id=44020) or use Merge-SPLogFile cmdlet:

```powershell
Merge-SPLogFile -Path "C:\Temp\LDAPCP_logging.log" -Overwrite -Area "LDAPCP" -Category "Augmentation" -StartTime (Get-Date).AddDays(-1)
```

The output of a successful augmentation looks like this (trimmed for visibility):

```text
LDAPCP  Augmentation    1337    Medium  [LDAPCP] Domain contoso.local returned 3 groups for user yvand@contoso.local. Lookup took 575ms on AD server 'LDAP://contoso.local/DC=contoso,DC=local'
LDAPCP  Augmentation    1337    Medium  [LDAPCP] Domain MyLDS.local returned 1 groups for user yvand@contoso.local. Lookup took 6ms on LDAP server 'LDAP://DC:50500/CN=Partition1,DC=MyLDS,DC=local'
LDAPCP  Augmentation    1337    Verbose [LDAPCP] LDAP queries to get group membership on all servers completed in 2391ms
LDAPCP  Augmentation    1337    Verbose [LDAPCP] Added group "contoso.local\Domain Users" to user "yvand@contoso.local"
LDAPCP  Augmentation    1337    Verbose [LDAPCP] Added group "contoso.local\Users" to user "yvand@contoso.local"
LDAPCP  Augmentation    1337    Verbose [LDAPCP] Added group "contoso.local\group1" to user "yvand@contoso.local"
LDAPCP  Augmentation    1337    Verbose [LDAPCP] Added group "MyLDS.local\ldsGroup1" to user "yvand@contoso.local"
LDAPCP  Augmentation    1337    Medium  [LDAPCP] User 'yvand@contoso.local' was augmented with 4 groups of claim type 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
```

### Replay augmentation in PowerShell

LDAPCP has 2 ways to augment users:

- Using the .NET Directory Services API (if "Use .NET helper" is checked for the LDAP connection, in the augmentation section of LDAPCP config page):

```powershell
Add-Type -AssemblyName System.DirectoryServices.AccountManagement
$ldapPath = "contoso.local"
$ldapBase = "DC=contoso,DC=local"
$ldapUser = "contoso\spapppool"
if (!$ldapPassword) { $ldapPassword = Read-Host "Enter the password (will appear in clear text)" }

$userToAugment = "yvand"
$contextOptions = [System.DirectoryServices.AccountManagement.ContextOptions] "Negotiate, Signing, Sealing" # Encrypted connection, traffic unreadable in network analyzer
$contextOptions = [System.DirectoryServices.AccountManagement.ContextOptions] "SimpleBind" # LDAP traffic is in clear text
$contextType = [System.DirectoryServices.AccountManagement.ContextType]::Domain

$principalContext = New-Object System.DirectoryServices.AccountManagement.PrincipalContext ($contextType, $ldapPath, $ldapBase, $contextOptions, $ldapUser, $ldapPassword)
if ($null -ne $principalContext -and [String]::IsNullOrEmpty($principalContext.ConnectedServer) -eq $false) {
    $user = $groups = $summary = $null
    $principalContext
    $user = [System.DirectoryServices.AccountManagement.UserPrincipal]::FindByIdentity($principalContext, $userToAugment)

    $timeTakenGetGroups = Measure-Command { $groups = $user.GetAuthorizationGroups() }

    # The foreach group calls an enumerator that does separate LDAP binds for each group
    $timeTakenProcessGroups = [Diagnostics.Stopwatch]::StartNew()
    foreach($group in $groups) {
        $group.SamAccountName
    }
    $timeTakenProcessGroups.Stop()

    $summary = @([pscustomobject]@{"Username"= $user.name ;  "GroupCount" = $($groups | Measure-Object).Count; "GetGroupsDuration"= $timeTakenGetGroups.TotalMilliseconds; "ProcessGroupsDuration"= $timeTakenProcessGroups.Elapsed.TotalMilliseconds})
    $summary
}
```

- Using a plain LDAP query (if "Use .NET helper" is not checked for the LDAP connection, in the augmentation section of LDAPCP config page):

```powershell
Add-Type -AssemblyName System.DirectoryServices.AccountManagement
$filterUserToAugment = "(&(ObjectClass=user)(sAMAccountName=yvand))"
$ldapPath = "contoso.local"
$ldapBase = "DC=contoso,DC=local"
$ldapUser = "contoso\spapppool"
if (!$ldapPassword) { $ldapPassword = Read-Host "Enter the password (will appear in clear text)" }
$ldapAuth = [System.DirectoryServices.AuthenticationTypes] "Secure, Signing"
$ldapAuth = [System.DirectoryServices.AuthenticationTypes] "None"

$directoryEntry = New-Object System.DirectoryServices.DirectoryEntry("LDAP://$ldapPath/$ldapBase" , $ldapUser, $ldapPassword, $ldapAuth)
$searcher = New-Object System.DirectoryServices.DirectorySearcher ($directoryEntry)
$searcher.Filter = $filterUserToAugment
$searcher.PropertiesToLoad.Add("samAccountName");
$searcher.PropertiesToLoad.Add("memberOf");
$searcher.PropertiesToLoad.Add("uniquememberof");

$timeTakenGetGroups = Measure-Command { $result = $searcher.FindOne() }
if ($null -ne $result) {
    $result.Properties["memberof"]

    $summary = @([pscustomobject]@{"Username"= $result.Properties["samAccountName"][0] ;  "GroupCount" = $result.Properties["memberof"].Count; "GetGroupsDuration"= $timeTakenGetGroups.TotalMilliseconds})
    $summary
}
```
