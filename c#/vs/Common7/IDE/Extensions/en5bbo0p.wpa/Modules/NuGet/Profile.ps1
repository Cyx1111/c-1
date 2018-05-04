#
# PowerConsole profile
#

<#
.SYNOPSIS
    Clear the host content.
    
.DESCRIPTION
    This function replaces the standard Clear-Host and is aliased by "cls".
#>
function Clear-Host
{
    $host.PrivateData.ClearHost()
}

<#
.SYNOPSIS
    Simple path completion function for PowerConsole.
#>
function _TabExpansionPath($line)
{
    function UnquoteString($s) {
        if ($s.StartsWith('"') -or $s.StartsWith("'")) {
            $s = $s.Substring(1)
        }
        if ($s.EndsWith('"') -or $s.EndsWith("'")) {
            $s = $s.Substring(0, $s.Length - 1)
        }
        return $s
    }
    
    $e = $null
    $tokens = @([System.Management.Automation.PSParser]::Tokenize($line, [ref]$e))
    $lastToken = $tokens | Select-Object -Last 1
    
    $replaceStart = -1
    $lastWord = $null
    
    if ($lastToken -and ($lastToken.EndColumn -gt $line.Length)) {
        #Last token is terminated
                        
        if ($tokens.Length -gt 1) {
            $prevToken = $tokens[$tokens.Length - 2]
            if ($prevToken.EndColumn -eq $lastToken.StartColumn) {
                $replaceStart = $prevToken.StartColumn - 1
                $lastWord = (UnquoteString $prevToken.Content) + (UnquoteString $lastToken.Content)
            }
        }
                                
        if ($replaceStart -lt 0) {
            $replaceStart = $lastToken.StartColumn - 1
            $lastWord = UnquoteString $lastToken.Content
        }
    } else {
        #There is unrecognized/unterminated words
    
        if(!$lastToken) {
            $lastWord = $line
        } else {
            $lastWord = $line.Substring($lastToken.EndColumn - 1).TrimStart()
        }
        $replaceStart = $line.Length - $lastWord.Length
        $lastWord = UnquoteString $lastWord
    }

    # If previously unquoted, put back quote in results
    $unquoted = ($replaceStart -lt ($line.Length - $lastWord.Length))    
    $relative = !(($lastWord.IndexOf(':') -ge 0) -or $lastWord.StartsWith('/') -or $lastWord.StartsWith('\'))    

    $result = "" | select ReplaceStart, Paths
    $result.ReplaceStart = $replaceStart
    $result.Paths = @(Resolve-Path ${lastWord}* -ErrorAction SilentlyContinue -Relative:$relative | %{
    
        # Resolve-Path may return PathInfo or String (e.g. when passing different -Relative)
        $path = $_.ToString()
        
        if ($unquoted -or ($path.IndexOf(' ') -ge 0)) {
            "'$path'"
        } else {
            $path
        }
    })
    
    $result
}

<#
.SYNOPSIS
    Get an explict interface on an object so that you can invoke the interface members.
    
.DESCRIPTION
    PowerShell object adapter does not provide explict interface members. For COM objects
    it only makes IDispatch members available.
    
    This function helps access interface members on an object through reflection. A new
    object is returned with the interface members as ScriptProperties and ScriptMethods.
    
.EXAMPLE
    $dte2 = Get-Interface $dte ([EnvDTE80.DTE2])
#>
function Get-Interface
{
    Param(
        $Object,
        [type]$InterfaceType
    )
    
    [NuGetConsole.Host.PowerShell.Implementation.PSTypeWrapper]::GetInterface($Object, $InterfaceType)
}

<#
.SYNOPSIS
    Get a VS service.

.EXAMPLE
    Get-VSService ([Microsoft.VisualStudio.Shell.Interop.SVsShell]) ([Microsoft.VisualStudio.Shell.Interop.IVsShell])
#>
function Get-VSService
{
    Param(
        [type]$ServiceType,
        [type]$InterfaceType
    )

    $service = [Microsoft.VisualStudio.Shell.Package]::GetGlobalService($ServiceType)
    if ($service -and $InterfaceType) {
        $service = Get-Interface $service $InterfaceType
    }

    $service
}

<#
.SYNOPSIS
    Get VS IComponentModel service to access VS MEF hosting.
#>
function Get-VSComponentModel
{
    Get-VSService ([Microsoft.VisualStudio.ComponentModelHost.SComponentModel]) ([Microsoft.VisualStudio.ComponentModelHost.IComponentModel])
}

# Set initial directory
Set-Location "$env:USERPROFILE"

# For PowerShell v2, we need to create a reference to the default TabExpansion function
# so we can delegate back to it in our custom function. This isn't needed in PowerShell v3, 
# as omitting output in a custom TabExpansion function signals to TabExpansion2 that it 
# should use its own completion list.
if ((Test-Path Function:\DefaultTabExpansion) -eq $false -and (Test-Path Function:\TabExpansion)) {
    Rename-Item Function:\TabExpansion DefaultTabExpansion
}

function TabExpansion([string]$line, [string]$lastWord) {
       $nugetSuggestions = & (Get-Module NuGet) NuGetTabExpansion $line $lastWord
       
       if ($nugetSuggestions.NoResult) {
              # We only want to delegate back to the default tab completion in PowerShell v2.
              # PowerShell v3's TabExpansion2 will use its own command completion list if the
              # custom TabExpansion doesn't return anything.
              if (Test-Path Function:\DefaultTabExpansion) {
                     $line = $line.ToUpperInvariant()
                     $lastWord = $lastWord.ToUpperInvariant()
                     return DefaultTabExpansion $line $lastWord
              }
       }
       else {
              return $nugetSuggestions
       }
}

# default prompt
function prompt {
    "PM>"
}

# SIG # Begin signature block
# MIIaVAYJKoZIhvcNAQcCoIIaRTCCGkECAQExCzAJBgUrDgMCGgUAMGkGCisGAQQB
# gjcCAQSgWzBZMDQGCisGAQQBgjcCAR4wJgIDAQAABBAfzDtgWUsITrck0sYpfvNR
# AgEAAgEAAgEAAgEAAgEAMCEwCQYFKw4DAhoFAAQUzrybryeGjFQ1ndAZPspjCdvf
# ahSgghUtMIIEoDCCA4igAwIBAgIKYRnMkwABAAAAZjANBgkqhkiG9w0BAQUFADB5
# MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVk
# bW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMSMwIQYDVQQDExpN
# aWNyb3NvZnQgQ29kZSBTaWduaW5nIFBDQTAeFw0xMTEwMTAyMDMyMjVaFw0xMzAx
# MTAyMDMyMjVaMIGDMQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQ
# MA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9u
# MQ0wCwYDVQQLEwRNT1BSMR4wHAYDVQQDExVNaWNyb3NvZnQgQ29ycG9yYXRpb24w
# ggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDuW759ESTjhgbgZv9ItRe9
# AuS0DDLwcj59LofXTqGxp0Mv92WeMeEyMUWu18EkhCHXLrWEfvo101Mc17ZRHk/O
# ZrnrtwwC/SlcraiH9soitNW/CHX1inCPY9fvih7pj0MkZFrTh32QbTusds1XNn3o
# vBBWrJjwiV0uZMavJgleHmMV8T2/Fo+ZiALDMLfBC2AfD3LM1reoNRKGm6ELCuaT
# W476VJzB8xlfQo0Snx0/kLcnE4MZMoId89mH1CGyPKK2B0/XJKrujfWz2fr5OU+n
# 6fKvWVL03EGbLxFwY93q3qrxbSEEEFMzu7JPxeFTskFlR2439rzpmxZBkWsuWzDD
# AgMBAAGjggEdMIIBGTATBgNVHSUEDDAKBggrBgEFBQcDAzAdBgNVHQ4EFgQUG1IO
# 8xEqt8CJwxGBPdSWWLmjU24wDgYDVR0PAQH/BAQDAgeAMB8GA1UdIwQYMBaAFMsR
# 6MrStBZYAck3LjMWFrlMmgofMFYGA1UdHwRPME0wS6BJoEeGRWh0dHA6Ly9jcmwu
# bWljcm9zb2Z0LmNvbS9wa2kvY3JsL3Byb2R1Y3RzL01pY0NvZFNpZ1BDQV8wOC0z
# MS0yMDEwLmNybDBaBggrBgEFBQcBAQROMEwwSgYIKwYBBQUHMAKGPmh0dHA6Ly93
# d3cubWljcm9zb2Z0LmNvbS9wa2kvY2VydHMvTWljQ29kU2lnUENBXzA4LTMxLTIw
# MTAuY3J0MA0GCSqGSIb3DQEBBQUAA4IBAQClWzZsrU6baRLjb4oCm2l3w2xkciiI
# 2T1FbSwYe9QoLxPiWWobwgs0t4r96rmU7Acx5mr0dQTTp9peOgaeEP2pDb2cUUNv
# /2eUnOHPfPAksDXMg13u2sBvNknAWgpX9nPhnvPjCEw7Pi/M0s3uTyJw9wQfAqZL
# m7iPXIgONpRsMwe4qa1RoNDC3I4iEr3D34LXVqH33fClIFcQEJ3urIZ0bHGbwfDy
# wnBep9ttTTdYmU15QNA0XVolrmfrG05GBrCMKR+jEI+lM58j1fi1Rn3g7mOYkEs+
# BagvsBizWaSvQVOOCAUQLSrJOgZMHC6pMVFWZKyazKyXmCmKl5CH6p22MIIEujCC
# A6KgAwIBAgIKYQUZlgAAAAAAGzANBgkqhkiG9w0BAQUFADB3MQswCQYDVQQGEwJV
# UzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UE
# ChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMSEwHwYDVQQDExhNaWNyb3NvZnQgVGlt
# ZS1TdGFtcCBQQ0EwHhcNMTEwNzI1MjA0MjE5WhcNMTIxMDI1MjA0MjE5WjCBszEL
# MAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1v
# bmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjENMAsGA1UECxMETU9Q
# UjEnMCUGA1UECxMebkNpcGhlciBEU0UgRVNOOjlFNzgtODY0Qi0wMzlEMSUwIwYD
# VQQDExxNaWNyb3NvZnQgVGltZS1TdGFtcCBTZXJ2aWNlMIIBIjANBgkqhkiG9w0B
# AQEFAAOCAQ8AMIIBCgKCAQEA08s7U6KfRKN6q01WcVOKd6o3k34BPv2rAqNTqf/R
# sSLFAJDndW7uGOiBDhPF2GEAvh+gdjsEDQTFBKCo/ENTBqEEBLkLkpgCYjjv1DMS
# 9ys9e++tRVeFlSCf12M0nGJGjr6u4NmeOfapVf3P53fmNRPvXOi/SJNPGkMHWDiK
# f4UUbOrJ0Et6gm7L0xVgCBSJlKhbPzrJPyB9bS9YGn3Kiji8w8I5aNgtWBoj7SoQ
# CFogjIKl7dGXRZKFzMM3g98NmHzF07bgmVPYeAj15SMhB2KGWmppGf1w+VM0gfcl
# MRmGh4vAVZr9qkw1Ff1b6ZXJq1OYKV8speElD2TF8rAndQIDAQABo4IBCTCCAQUw
# HQYDVR0OBBYEFHkj56ENvlUsaBgpYoJn1vPhNjhaMB8GA1UdIwQYMBaAFCM0+NlS
# RnAK7UD7dvuzK7DDNbMPMFQGA1UdHwRNMEswSaBHoEWGQ2h0dHA6Ly9jcmwubWlj
# cm9zb2Z0LmNvbS9wa2kvY3JsL3Byb2R1Y3RzL01pY3Jvc29mdFRpbWVTdGFtcFBD
# QS5jcmwwWAYIKwYBBQUHAQEETDBKMEgGCCsGAQUFBzAChjxodHRwOi8vd3d3Lm1p
# Y3Jvc29mdC5jb20vcGtpL2NlcnRzL01pY3Jvc29mdFRpbWVTdGFtcFBDQS5jcnQw
# EwYDVR0lBAwwCgYIKwYBBQUHAwgwDQYJKoZIhvcNAQEFBQADggEBAEfCdoFbMd1v
# 0zyZ8npsfpcTUCwFFxsQuEShtYz0Vs+9sCG0ZG1hHNju6Ov1ku5DohhEw/r67622
# XH+XbUu1Q/snYXgIVHyx+a+YCrR0xKroLVDEff59TqGZ1icot67Y37GPgyKOzvN5
# /GEUbb/rzISw36O7WwW36lT1Yh1sJ6ZjS/rjofq734WWZWlTsLZxmGQmZr3F8Vxi
# vJH0PZxLQgANzzgFFCZa3CoFS39qmTjY3XOZos6MUCSepOv1P4p4zFSZXSVmpEEG
# KK9JxLRSlOzeAoNk/k3U/0ui/CmA2+4/qzztM4jKvyJg0Fw7BLAKtJhtPKc6T5rR
# ARYRYopBdqAwggW8MIIDpKADAgECAgphMyYaAAAAAAAxMA0GCSqGSIb3DQEBBQUA
# MF8xEzARBgoJkiaJk/IsZAEZFgNjb20xGTAXBgoJkiaJk/IsZAEZFgltaWNyb3Nv
# ZnQxLTArBgNVBAMTJE1pY3Jvc29mdCBSb290IENlcnRpZmljYXRlIEF1dGhvcml0
# eTAeFw0xMDA4MzEyMjE5MzJaFw0yMDA4MzEyMjI5MzJaMHkxCzAJBgNVBAYTAlVT
# MRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQK
# ExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xIzAhBgNVBAMTGk1pY3Jvc29mdCBDb2Rl
# IFNpZ25pbmcgUENBMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAsnJZ
# XBkwZL8dmmAgIEKZdlNsPhvWb8zL8epr/pcWEODfOnSDGrcvoDLs/97CQk4j1XIA
# 2zVXConKriBJ9PBorE1LjaW9eUtxm0cH2v0l3511iM+qc0R/14Hb873yNqTJXEXc
# r6094CholxqnpXJzVvEXlOT9NZRyoNZ2Xx53RYOFOBbQc1sFumdSjaWyaS/aGQv+
# knQp4nYvVN0UMFn40o1i/cvJX0YxULknE+RAMM9yKRAoIsc3Tj2gMj2QzaE4BoVc
# TlaCKCoFMrdL109j59ItYvFFPeesCAD2RqGe0VuMJlPoeqpK8kbPNzw4nrR3XKUX
# no3LEY9WPMGsCV8D0wIDAQABo4IBXjCCAVowDwYDVR0TAQH/BAUwAwEB/zAdBgNV
# HQ4EFgQUyxHoytK0FlgByTcuMxYWuUyaCh8wCwYDVR0PBAQDAgGGMBIGCSsGAQQB
# gjcVAQQFAgMBAAEwIwYJKwYBBAGCNxUCBBYEFP3RMU7TJoqV4ZhgO6gxb6Y8vNgt
# MBkGCSsGAQQBgjcUAgQMHgoAUwB1AGIAQwBBMB8GA1UdIwQYMBaAFA6sgmBAVieX
# 5SUT/CrhClOVWeSkMFAGA1UdHwRJMEcwRaBDoEGGP2h0dHA6Ly9jcmwubWljcm9z
# b2Z0LmNvbS9wa2kvY3JsL3Byb2R1Y3RzL21pY3Jvc29mdHJvb3RjZXJ0LmNybDBU
# BggrBgEFBQcBAQRIMEYwRAYIKwYBBQUHMAKGOGh0dHA6Ly93d3cubWljcm9zb2Z0
# LmNvbS9wa2kvY2VydHMvTWljcm9zb2Z0Um9vdENlcnQuY3J0MA0GCSqGSIb3DQEB
# BQUAA4ICAQBZOT5/Jkav629AsTK1ausOL26oSffrX3XtTDst10OtC/7L6S0xoyPM
# fFCYgCFdrD0vTLqiqFac43C7uLT4ebVJcvc+6kF/yuEMF2nLpZwgLfoLUMRWzS3j
# StK8cOeoDaIDpVbguIpLV/KVQpzx8+/u44YfNDy4VprwUyOFKqSCHJPilAcd8uJO
# +IyhyugTpZFOyBvSj3KVKnFtmxr4HPBT1mfMIv9cHc2ijL0nsnljVkSiUc356aNY
# Vt2bAkVEL1/02q7UgjJu/KSVE+Traeepoiy+yCsQDmWOmdv1ovoSJgllOJTxeh9K
# u9HhVujQeJYYXMk1Fl/dkx1Jji2+rTREHO4QFRoAXd01WyHOmMcJ7oUOjE9tDhNO
# PXwpSJxy0fNsysHscKNXkld9lI2gG0gDWvfPo2cKdKU27S0vF8jmcjcS9G+xPGeC
# +VKyjTMWZR4Oit0Q3mT0b85G1NMX6XnEBLTT+yzfH4qerAr7EydAreT54al/RrsH
# YEdlYEBOsELsTu2zdnnYCjQJbRyAMR/iDlTd5aH75UcQrWSY/1AWLny/BSF64pVB
# J2nDk4+VyY3YmyGuDVyc8KKuhmiDDGotu3ZrAB2WrfIWe/YWgyS5iM9qqEcxL5rc
# 43E91wB+YkfRzojJuBj6DnKNwaM9rwJAav9pm5biEKgQtDdQCNbDPTCCBgcwggPv
# oAMCAQICCmEWaDQAAAAAABwwDQYJKoZIhvcNAQEFBQAwXzETMBEGCgmSJomT8ixk
# ARkWA2NvbTEZMBcGCgmSJomT8ixkARkWCW1pY3Jvc29mdDEtMCsGA1UEAxMkTWlj
# cm9zb2Z0IFJvb3QgQ2VydGlmaWNhdGUgQXV0aG9yaXR5MB4XDTA3MDQwMzEyNTMw
# OVoXDTIxMDQwMzEzMDMwOVowdzELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hp
# bmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jw
# b3JhdGlvbjEhMB8GA1UEAxMYTWljcm9zb2Z0IFRpbWUtU3RhbXAgUENBMIIBIjAN
# BgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAn6Fssd/bSJIqfGsuGeG94uPFmVEj
# UK3O3RhOJA/u0afRTK10MCAR6wfVVJUVSZQbQpKumFwwJtoAa+h7veyJBw/3DgSY
# 8InMH8szJIed8vRnHCz8e+eIHernTqOhwSNTyo36Rc8J0F6v0LBCBKL5pmyTZ9co
# 3EZTsIbQ5ShGLieshk9VUgzkAyz7apCQMG6H81kwnfp+1pez6CGXfvjSE/MIt1Nt
# UrRFkJ9IAEpHZhEnKWaol+TTBoFKovmEpxFHFAmCn4TtVXj+AZodUAiFABAwRu23
# 3iNGu8QtVJ+vHnhBMXfMm987g5OhYQK1HQ2x/PebsgHOIktU//kFw8IgCwIDAQAB
# o4IBqzCCAacwDwYDVR0TAQH/BAUwAwEB/zAdBgNVHQ4EFgQUIzT42VJGcArtQPt2
# +7MrsMM1sw8wCwYDVR0PBAQDAgGGMBAGCSsGAQQBgjcVAQQDAgEAMIGYBgNVHSME
# gZAwgY2AFA6sgmBAVieX5SUT/CrhClOVWeSkoWOkYTBfMRMwEQYKCZImiZPyLGQB
# GRYDY29tMRkwFwYKCZImiZPyLGQBGRYJbWljcm9zb2Z0MS0wKwYDVQQDEyRNaWNy
# b3NvZnQgUm9vdCBDZXJ0aWZpY2F0ZSBBdXRob3JpdHmCEHmtFqFKoKWtTHNY9AcT
# LmUwUAYDVR0fBEkwRzBFoEOgQYY/aHR0cDovL2NybC5taWNyb3NvZnQuY29tL3Br
# aS9jcmwvcHJvZHVjdHMvbWljcm9zb2Z0cm9vdGNlcnQuY3JsMFQGCCsGAQUFBwEB
# BEgwRjBEBggrBgEFBQcwAoY4aHR0cDovL3d3dy5taWNyb3NvZnQuY29tL3BraS9j
# ZXJ0cy9NaWNyb3NvZnRSb290Q2VydC5jcnQwEwYDVR0lBAwwCgYIKwYBBQUHAwgw
# DQYJKoZIhvcNAQEFBQADggIBABCXisNcA0Q23em0rXfbznlRTQGxLnRxW20ME6vO
# vnuPuC7UEqKMbWK4VwLLTiATUJndekDiV7uvWJoc4R0Bhqy7ePKL0Ow7Ae7ivo8K
# BciNSOLwUxXdT6uS5OeNatWAweaU8gYvhQPpkSokInD79vzkeJkuDfcH4nC8GE6d
# jmsKcpW4oTmcZy3FUQ7qYlw/FpiLID/iBxoy+cwxSnYxPStyC8jqcD3/hQoT38IK
# YY7w17gX606Lf8U1K16jv+u8fQtCe9RTciHuMMq7eGVcWwEXChQO0toUmPU8uWZY
# sy0v5/mFhsxRVuidcJRsrDlM1PZ5v6oYemIp76KbKTQGdxpiyT0ebR+C8AvHLLvP
# Q7Pl+ex9teOkqHQ1uE7FcSMSJnYLPFKMcVpGQxS8s7OwTWfIn0L/gHkhgJ4VMGbo
# QhJeGsieIiHQQ+kr6bv0SMws1NgygEwmKkgkX1rqVu+m3pmdyjpvvYEndAYR7nYh
# v5uCwSdUtrFqPYmhdmG0bqETpr+qR/ASb/2KMmyy/t9RyIwjyWa9nR2HEmQCPS2v
# WY+45CHltbDKY7R4VAXUQS5QrJSwpXirs6CWdRrZkocTdSIvMqgIbqBbjCW/oO+E
# yiHW6x5PyZruSeD3AWVviQt9yGnI5m7qp5fOMSn/DsVbXNhNG6HY+i+ePy5VFmvJ
# E6P9MYIEkTCCBI0CAQEwgYcweTELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hp
# bmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jw
# b3JhdGlvbjEjMCEGA1UEAxMaTWljcm9zb2Z0IENvZGUgU2lnbmluZyBQQ0ECCmEZ
# zJMAAQAAAGYwCQYFKw4DAhoFAKCBvjAZBgkqhkiG9w0BCQMxDAYKKwYBBAGCNwIB
# BDAcBgorBgEEAYI3AgELMQ4wDAYKKwYBBAGCNwIBFTAjBgkqhkiG9w0BCQQxFgQU
# y5+x3fZAIG4sABXSuSpbpspVZhIwXgYKKwYBBAGCNwIBDDFQME6gNIAyAE0AaQBj
# AHIAbwBzAG8AZgB0ACAAUABhAGMAawBhAGcAZQAgAE0AYQBuAGEAZwBlAHKhFoAU
# aHR0cDovL3d3dy5hc3AubmV0LyAwDQYJKoZIhvcNAQEBBQAEggEA1TOl6bO7vtqz
# /TDXw1OmEMBky3NnGArWn2rkNchysXo2/11EYQHp9yIYn9fiLoZ6fFrJ/XgjyiVp
# KV5nTjfmLXfSNo8RGPTSo7Ou3FY9gJw1MSpLe185R+13l3nXdBhB1xyNkD54mDdE
# hd82Dugpg/haNOTsYQPu688vlkM+mO3n/ffaNzHFbuLrqiKUu/8TjawdfwzxRFQi
# 0G8CBRijyflWbJRzDVoZHdDNk1y7AM2UvcQweT6TPJTRmwkfqD0IVO9FSKiD5k39
# j3d9kON/TlUw8QMBZZLjXqXl9VVL/1I2zfLBrV48Gysv5V4I/LBQNjidIwATK8ir
# h6Ig6fHM3qGCAh0wggIZBgkqhkiG9w0BCQYxggIKMIICBgIBATCBhTB3MQswCQYD
# VQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEe
# MBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMSEwHwYDVQQDExhNaWNyb3Nv
# ZnQgVGltZS1TdGFtcCBQQ0ECCmEFGZYAAAAAABswBwYFKw4DAhqgXTAYBgkqhkiG
# 9w0BCQMxCwYJKoZIhvcNAQcBMBwGCSqGSIb3DQEJBTEPFw0xMjA3MDExMDA3MDZa
# MCMGCSqGSIb3DQEJBDEWBBQrg3t1Wndm8eDkPH+duAoi6OPqGTANBgkqhkiG9w0B
# AQUFAASCAQDRgGwPTq/Ehk1VPHw+Bi1vW0zvXYTOadEOEXId5riUNbWWizHrGaxJ
# 1iQbhmA9K3RRVMI4q0GnRvSNGvQBZlpx6OKBZWlPaVV/QDTiydhe4kNFGn+SHuR4
# nns2TaV10yKh0dg4FXO0wR1Y2exR2piDpRCrB6k1s+6HGLOekOy6uFlhu70DEmOL
# YXjym6wNIBSGJRmOKQ3y+Rjw8vRRmjdjwGttuDWP6npwuPZYM6+B03YidWEkyUUG
# ifmfqlQKa16ZT51v8aLEsv/ESPEQEnayUupeyJjDP7RzISQeLYgAQPdGO6UYgNSD
# tY1R3VyC+RjUaZT77nZXIxizXuc08TaW
# SIG # End signature block
