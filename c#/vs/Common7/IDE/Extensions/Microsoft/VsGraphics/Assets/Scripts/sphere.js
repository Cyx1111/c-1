
//
// create a sphere in the scene
//

// enable in prop window
var flags = 0x8;

// create the mesh and scene node and place into documents list
var sphereElement = document.createMesh(1102);
var mesh = sphereElement.behavior;

var material = services.effects.createEffectInstance("Phong");

// set up the color traits
var diffuseColorTrait = material.getOrCreateTrait("MaterialDiffuse", "float4", flags);
diffuseColorTrait.value = [1, 1, 1, 1];

var ambientColorTrait = material.getOrCreateTrait("MaterialAmbient", "float4", flags);
ambientColorTrait.value = [1, 1, 1, 1]

// add to our materials collection
mesh.materials.append(material);

// get the geometry
var geom = sphereElement.getTrait("Geometry").value;

function generateSpherePoints(radius, hDiv, vDiv) {
    var pointList = new Array();

    // Points in between
    for (var v = 0; v <= vDiv; v ++)
    {
        for (var h = 0; h < hDiv; h++) {
            var hAngle = h * (2 * Math.PI) / vDiv;
            var vAngle = v * Math.PI / hDiv;

            var x = radius * Math.cos(hAngle) * Math.sin(vAngle);
            var y = radius * Math.cos(vAngle);
            var z = radius * Math.sin(hAngle) * Math.sin(vAngle);
            pointList.push(x,y,z);
        }
    }
    
    return pointList;
}

var hDivisions = 22;
var vDivisions = 22;

// Sphere points
var points = generateSpherePoints(1, hDivisions, vDivisions);
var pointCount = points.length / 3;

// update the geometry
geom.addPoints(points, pointCount);

var polygonPointCounts = new Array();
var polygonCount = (hDivisions) * (vDivisions);
for (var i = 0; i < polygonCount; i++)
{
    polygonPointCounts.push(4);
}

var polygonPointIndices = new Array();
for (var i = 0; i < vDivisions; i++) {
    for (var j = 0; j < hDivisions; j++) {
        var nextH = j + 1;
        if (nextH == hDivisions) {
            nextH = 0;
        }
        var row0 = i * hDivisions;
        var row1 = (i+1) * hDivisions;
        polygonPointIndices.push(row1 + nextH, row1 + j, row0 + j, row0 + nextH);
    }
}

// this uses material '0' 
geom.addPolygons(0, polygonPointIndices, polygonPointCounts, polygonCount);

function generateSphereUV(hDiv, vDiv) {
    var uvs = new Array();

    // Points in between
    for (var v = 0.0; v <= vDiv; v += 1.0) {
        for (var h = 0.0; h <= hDiv; h += 1.0) {

            var x = h / vDiv;
            var y = v / hDiv;

            var uv = new Object();
            uv.x = 1 - x;
            uv.y = 1 - y;
            uvs.push(uv);
        }
    }

    return uvs;
}

var uvs = generateSphereUV(hDivisions, vDivisions);
var IndexingModePerPointOnPoly = 3;

var splitUVs = new Array();
for (var i = 0; i < vDivisions; i++) {
    for (var j = 0; j < hDivisions; j++) {
        var nextH = j + 1;

        var row0 = i * (hDivisions+1);
        var row1 = (i + 1) * (hDivisions+1);
        splitUVs.push(uvs[row1 + nextH].x, uvs[row1 + nextH].y);
        splitUVs.push(uvs[row1 + j].x, uvs[row1 + j].y);
        splitUVs.push(uvs[row0 + j].x, uvs[row0 + j].y);
        splitUVs.push(uvs[row0 + nextH].x, uvs[row0 + nextH].y);
    }
}

geom.addTextureCoordinates(splitUVs, splitUVs.length / 2);
geom.textureCoordinateIndexingMode = IndexingModePerPointOnPoly;

var coord = document.getCoordinateSystemMatrix();
geom.transform(coord);

sphereElement.getTrait("SmoothingAngle").value = 45;
var mesh = sphereElement.behavior;
mesh.computeNormals();

//
// create an undoable operation that creates the object on do and deletes the object on undo
//
function UndoableItem(element, parent) {
    this._element = element;
    this._parentElement = parent;

    this.getName = function () {
        var IDS_MreUndoCreateSphere = 157;
        return services.strings.getStringFromId(IDS_MreUndoCreateSphere);
    }

    this.onDo = function () {
        this._element.parent = this._parentElement;
        document.elements.append(this._parentElement);
        document.elements.append(this._element);

        this._element.parent = this._parentElement;
        this._parentElement.parent = document.getSceneRoot();
    }

    this.onUndo = function () {
        document.deleteSceneElement(this._parentElement);
    }
}

undoableItem = new UndoableItem(sphereElement, sphereElement.parent);
services.undoService.addUndoableItem(undoableItem);
// SIG // Begin signature block
// SIG // MIIaHQYJKoZIhvcNAQcCoIIaDjCCGgoCAQExCzAJBgUr
// SIG // DgMCGgUAMGcGCisGAQQBgjcCAQSgWTBXMDIGCisGAQQB
// SIG // gjcCAR4wJAIBAQQQEODJBs441BGiowAQS9NQkAIBAAIB
// SIG // AAIBAAIBAAIBADAhMAkGBSsOAwIaBQAEFOZ9s+JCVkFv
// SIG // aUz1mtm9ZNwIFLeboIIVFjCCBKAwggOIoAMCAQICCmEZ
// SIG // zJMAAQAAAGYwDQYJKoZIhvcNAQEFBQAweTELMAkGA1UE
// SIG // BhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNV
// SIG // BAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBD
// SIG // b3Jwb3JhdGlvbjEjMCEGA1UEAxMaTWljcm9zb2Z0IENv
// SIG // ZGUgU2lnbmluZyBQQ0EwHhcNMTExMDEwMjAzMjI1WhcN
// SIG // MTMwMTEwMjAzMjI1WjCBgzELMAkGA1UEBhMCVVMxEzAR
// SIG // BgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1v
// SIG // bmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlv
// SIG // bjENMAsGA1UECxMETU9QUjEeMBwGA1UEAxMVTWljcm9z
// SIG // b2Z0IENvcnBvcmF0aW9uMIIBIjANBgkqhkiG9w0BAQEF
// SIG // AAOCAQ8AMIIBCgKCAQEA7lu+fREk44YG4Gb/SLUXvQLk
// SIG // tAwy8HI+fS6H106hsadDL/dlnjHhMjFFrtfBJIQh1y61
// SIG // hH76NdNTHNe2UR5Pzma567cMAv0pXK2oh/bKIrTVvwh1
// SIG // 9Ypwj2PX74oe6Y9DJGRa04d9kG07rHbNVzZ96LwQVqyY
// SIG // 8IldLmTGryYJXh5jFfE9vxaPmYgCwzC3wQtgHw9yzNa3
// SIG // qDUShpuhCwrmk1uO+lScwfMZX0KNEp8dP5C3JxODGTKC
// SIG // HfPZh9QhsjyitgdP1ySq7o31s9n6+TlPp+nyr1lS9NxB
// SIG // my8RcGPd6t6q8W0hBBBTM7uyT8XhU7JBZUduN/a86ZsW
// SIG // QZFrLlswwwIDAQABo4IBHTCCARkwEwYDVR0lBAwwCgYI
// SIG // KwYBBQUHAwMwHQYDVR0OBBYEFBtSDvMRKrfAicMRgT3U
// SIG // lli5o1NuMA4GA1UdDwEB/wQEAwIHgDAfBgNVHSMEGDAW
// SIG // gBTLEejK0rQWWAHJNy4zFha5TJoKHzBWBgNVHR8ETzBN
// SIG // MEugSaBHhkVodHRwOi8vY3JsLm1pY3Jvc29mdC5jb20v
// SIG // cGtpL2NybC9wcm9kdWN0cy9NaWNDb2RTaWdQQ0FfMDgt
// SIG // MzEtMjAxMC5jcmwwWgYIKwYBBQUHAQEETjBMMEoGCCsG
// SIG // AQUFBzAChj5odHRwOi8vd3d3Lm1pY3Jvc29mdC5jb20v
// SIG // cGtpL2NlcnRzL01pY0NvZFNpZ1BDQV8wOC0zMS0yMDEw
// SIG // LmNydDANBgkqhkiG9w0BAQUFAAOCAQEApVs2bK1Om2kS
// SIG // 42+KAptpd8NsZHIoiNk9RW0sGHvUKC8T4llqG8ILNLeK
// SIG // /eq5lOwHMeZq9HUE06faXjoGnhD9qQ29nFFDb/9nlJzh
// SIG // z3zwJLA1zINd7trAbzZJwFoKV/Zz4Z7z4whMOz4vzNLN
// SIG // 7k8icPcEHwKmS5u4j1yIDjaUbDMHuKmtUaDQwtyOIhK9
// SIG // w9+C11ah993wpSBXEBCd7qyGdGxxm8Hw8sJwXqfbbU03
// SIG // WJlNeUDQNF1aJa5n6xtORgawjCkfoxCPpTOfI9X4tUZ9
// SIG // 4O5jmJBLPgWoL7AYs1mkr0FTjggFEC0qyToGTBwuqTFR
// SIG // VmSsmsysl5gpipeQh+qdtjCCBKMwggOLoAMCAQICCmEN
// SIG // r40AAAAAACgwDQYJKoZIhvcNAQEFBQAwdzELMAkGA1UE
// SIG // BhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNV
// SIG // BAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBD
// SIG // b3Jwb3JhdGlvbjEhMB8GA1UEAxMYTWljcm9zb2Z0IFRp
// SIG // bWUtU3RhbXAgUENBMB4XDTEyMDIyMDIxMzY0N1oXDTEz
// SIG // MDUyMDIxNDY0N1owgbMxCzAJBgNVBAYTAlVTMRMwEQYD
// SIG // VQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25k
// SIG // MR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24x
// SIG // DTALBgNVBAsTBE1PUFIxJzAlBgNVBAsTHm5DaXBoZXIg
// SIG // RFNFIEVTTjpDMEY0LTMwODYtREVGODElMCMGA1UEAxMc
// SIG // TWljcm9zb2Z0IFRpbWUtU3RhbXAgU2VydmljZTCCASIw
// SIG // DQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBANDJ9rK+
// SIG // Gu/uLXz4AGAeCLaaYWKStKnXDjEDPbpcfdP0ABq4m3hc
// SIG // RHdhq4Jnr6IwqeBZJkU73oA9j6lU87f84tOdgAEDQBYj
// SIG // KwRxXLkFbQnErIKKVwOcHgy03B/wpCzMWxl7ZcM/Cc+E
// SIG // jRJAreDmP3EwdhzqeRjFmmal8pOi5IPOOm8i4LVOtfFR
// SIG // DJynHMj/gf4zNVH3mzIp+/9pZhxJTcFOJoVXdu3TpI9k
// SIG // f9FEECEfTgJSHKIl9Zi9pSuuRZgDT8r0tsZ6GPdNnZvR
// SIG // opi1PbJNYDsoi3LbjTfbhyzpZN3IGPoJ3eNNp0WOoLoq
// SIG // rzWL6Mnv9DUZRRWFgvF3/QkS49sCAwEAAaOB8zCB8DAd
// SIG // BgNVHQ4EFgQUN+fwSUd2RYwO41LysvR6NzJrhdMwHwYD
// SIG // VR0jBBgwFoAUIzT42VJGcArtQPt2+7MrsMM1sw8wVAYD
// SIG // VR0fBE0wSzBJoEegRYZDaHR0cDovL2NybC5taWNyb3Nv
// SIG // ZnQuY29tL3BraS9jcmwvcHJvZHVjdHMvTWljcm9zb2Z0
// SIG // VGltZVN0YW1wUENBLmNybDBYBggrBgEFBQcBAQRMMEow
// SIG // SAYIKwYBBQUHMAKGPGh0dHA6Ly93d3cubWljcm9zb2Z0
// SIG // LmNvbS9wa2kvY2VydHMvTWljcm9zb2Z0VGltZVN0YW1w
// SIG // UENBLmNydDANBgkqhkiG9w0BAQUFAAOCAQEAbyv5ZHfk
// SIG // phuPosWMlNbjaIEB8v7EhJ/pJr3lZ2xcb33NdWVlAGgA
// SIG // VAmGOXq44nqvJ0maRRL3LJ9qRjiNflOvlOh+ZjcL+lTQ
// SIG // FsPx6NjDazMHghc0kI4aQEbMnNmiaX7fX0dqOpgLbkiK
// SIG // mf5pFDhv2C9kGyBHjwJcwKtpYzM3P0grjG6GVt6qIjTm
// SIG // OAsdMqdMsPePRh7nUa6AiEgjlgmDCTqmP84qByH0sEvI
// SIG // 9ZpNYf2XbhJFZZJsnsX4SJIpZVxl0T1ZFPBL7FU5CzRc
// SIG // FMpJbzdfcuTTRJA/CHM6eB6w/cgrawVF2A7YCevUT1yQ
// SIG // aEi+bgYqwt+uLYucfxwRJnI+ZTCCBbwwggOkoAMCAQIC
// SIG // CmEzJhoAAAAAADEwDQYJKoZIhvcNAQEFBQAwXzETMBEG
// SIG // CgmSJomT8ixkARkWA2NvbTEZMBcGCgmSJomT8ixkARkW
// SIG // CW1pY3Jvc29mdDEtMCsGA1UEAxMkTWljcm9zb2Z0IFJv
// SIG // b3QgQ2VydGlmaWNhdGUgQXV0aG9yaXR5MB4XDTEwMDgz
// SIG // MTIyMTkzMloXDTIwMDgzMTIyMjkzMloweTELMAkGA1UE
// SIG // BhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNV
// SIG // BAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBD
// SIG // b3Jwb3JhdGlvbjEjMCEGA1UEAxMaTWljcm9zb2Z0IENv
// SIG // ZGUgU2lnbmluZyBQQ0EwggEiMA0GCSqGSIb3DQEBAQUA
// SIG // A4IBDwAwggEKAoIBAQCycllcGTBkvx2aYCAgQpl2U2w+
// SIG // G9ZvzMvx6mv+lxYQ4N86dIMaty+gMuz/3sJCTiPVcgDb
// SIG // NVcKicquIEn08GisTUuNpb15S3GbRwfa/SXfnXWIz6pz
// SIG // RH/XgdvzvfI2pMlcRdyvrT3gKGiXGqelcnNW8ReU5P01
// SIG // lHKg1nZfHndFg4U4FtBzWwW6Z1KNpbJpL9oZC/6SdCni
// SIG // di9U3RQwWfjSjWL9y8lfRjFQuScT5EAwz3IpECgixzdO
// SIG // PaAyPZDNoTgGhVxOVoIoKgUyt0vXT2Pn0i1i8UU956wI
// SIG // APZGoZ7RW4wmU+h6qkryRs83PDietHdcpReejcsRj1Y8
// SIG // wawJXwPTAgMBAAGjggFeMIIBWjAPBgNVHRMBAf8EBTAD
// SIG // AQH/MB0GA1UdDgQWBBTLEejK0rQWWAHJNy4zFha5TJoK
// SIG // HzALBgNVHQ8EBAMCAYYwEgYJKwYBBAGCNxUBBAUCAwEA
// SIG // ATAjBgkrBgEEAYI3FQIEFgQU/dExTtMmipXhmGA7qDFv
// SIG // pjy82C0wGQYJKwYBBAGCNxQCBAweCgBTAHUAYgBDAEEw
// SIG // HwYDVR0jBBgwFoAUDqyCYEBWJ5flJRP8KuEKU5VZ5KQw
// SIG // UAYDVR0fBEkwRzBFoEOgQYY/aHR0cDovL2NybC5taWNy
// SIG // b3NvZnQuY29tL3BraS9jcmwvcHJvZHVjdHMvbWljcm9z
// SIG // b2Z0cm9vdGNlcnQuY3JsMFQGCCsGAQUFBwEBBEgwRjBE
// SIG // BggrBgEFBQcwAoY4aHR0cDovL3d3dy5taWNyb3NvZnQu
// SIG // Y29tL3BraS9jZXJ0cy9NaWNyb3NvZnRSb290Q2VydC5j
// SIG // cnQwDQYJKoZIhvcNAQEFBQADggIBAFk5Pn8mRq/rb0Cx
// SIG // MrVq6w4vbqhJ9+tfde1MOy3XQ60L/svpLTGjI8x8UJiA
// SIG // IV2sPS9MuqKoVpzjcLu4tPh5tUly9z7qQX/K4QwXacul
// SIG // nCAt+gtQxFbNLeNK0rxw56gNogOlVuC4iktX8pVCnPHz
// SIG // 7+7jhh80PLhWmvBTI4UqpIIck+KUBx3y4k74jKHK6BOl
// SIG // kU7IG9KPcpUqcW2bGvgc8FPWZ8wi/1wdzaKMvSeyeWNW
// SIG // RKJRzfnpo1hW3ZsCRUQvX/TartSCMm78pJUT5Otp56mi
// SIG // LL7IKxAOZY6Z2/Wi+hImCWU4lPF6H0q70eFW6NB4lhhc
// SIG // yTUWX92THUmOLb6tNEQc7hAVGgBd3TVbIc6YxwnuhQ6M
// SIG // T20OE049fClInHLR82zKwexwo1eSV32UjaAbSANa98+j
// SIG // Zwp0pTbtLS8XyOZyNxL0b7E8Z4L5UrKNMxZlHg6K3RDe
// SIG // ZPRvzkbU0xfpecQEtNP7LN8fip6sCvsTJ0Ct5PnhqX9G
// SIG // uwdgR2VgQE6wQuxO7bN2edgKNAltHIAxH+IOVN3lofvl
// SIG // RxCtZJj/UBYufL8FIXrilUEnacOTj5XJjdibIa4NXJzw
// SIG // oq6GaIMMai27dmsAHZat8hZ79haDJLmIz2qoRzEvmtzj
// SIG // cT3XAH5iR9HOiMm4GPoOco3Boz2vAkBq/2mbluIQqBC0
// SIG // N1AI1sM9MIIGBzCCA++gAwIBAgIKYRZoNAAAAAAAHDAN
// SIG // BgkqhkiG9w0BAQUFADBfMRMwEQYKCZImiZPyLGQBGRYD
// SIG // Y29tMRkwFwYKCZImiZPyLGQBGRYJbWljcm9zb2Z0MS0w
// SIG // KwYDVQQDEyRNaWNyb3NvZnQgUm9vdCBDZXJ0aWZpY2F0
// SIG // ZSBBdXRob3JpdHkwHhcNMDcwNDAzMTI1MzA5WhcNMjEw
// SIG // NDAzMTMwMzA5WjB3MQswCQYDVQQGEwJVUzETMBEGA1UE
// SIG // CBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEe
// SIG // MBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMSEw
// SIG // HwYDVQQDExhNaWNyb3NvZnQgVGltZS1TdGFtcCBQQ0Ew
// SIG // ggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCf
// SIG // oWyx39tIkip8ay4Z4b3i48WZUSNQrc7dGE4kD+7Rp9FM
// SIG // rXQwIBHrB9VUlRVJlBtCkq6YXDAm2gBr6Hu97IkHD/cO
// SIG // BJjwicwfyzMkh53y9GccLPx754gd6udOo6HBI1PKjfpF
// SIG // zwnQXq/QsEIEovmmbJNn1yjcRlOwhtDlKEYuJ6yGT1VS
// SIG // DOQDLPtqkJAwbofzWTCd+n7Wl7PoIZd++NIT8wi3U21S
// SIG // tEWQn0gASkdmEScpZqiX5NMGgUqi+YSnEUcUCYKfhO1V
// SIG // eP4Bmh1QCIUAEDBG7bfeI0a7xC1Un68eeEExd8yb3zuD
// SIG // k6FhArUdDbH895uyAc4iS1T/+QXDwiALAgMBAAGjggGr
// SIG // MIIBpzAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBQj
// SIG // NPjZUkZwCu1A+3b7syuwwzWzDzALBgNVHQ8EBAMCAYYw
// SIG // EAYJKwYBBAGCNxUBBAMCAQAwgZgGA1UdIwSBkDCBjYAU
// SIG // DqyCYEBWJ5flJRP8KuEKU5VZ5KShY6RhMF8xEzARBgoJ
// SIG // kiaJk/IsZAEZFgNjb20xGTAXBgoJkiaJk/IsZAEZFglt
// SIG // aWNyb3NvZnQxLTArBgNVBAMTJE1pY3Jvc29mdCBSb290
// SIG // IENlcnRpZmljYXRlIEF1dGhvcml0eYIQea0WoUqgpa1M
// SIG // c1j0BxMuZTBQBgNVHR8ESTBHMEWgQ6BBhj9odHRwOi8v
// SIG // Y3JsLm1pY3Jvc29mdC5jb20vcGtpL2NybC9wcm9kdWN0
// SIG // cy9taWNyb3NvZnRyb290Y2VydC5jcmwwVAYIKwYBBQUH
// SIG // AQEESDBGMEQGCCsGAQUFBzAChjhodHRwOi8vd3d3Lm1p
// SIG // Y3Jvc29mdC5jb20vcGtpL2NlcnRzL01pY3Jvc29mdFJv
// SIG // b3RDZXJ0LmNydDATBgNVHSUEDDAKBggrBgEFBQcDCDAN
// SIG // BgkqhkiG9w0BAQUFAAOCAgEAEJeKw1wDRDbd6bStd9vO
// SIG // eVFNAbEudHFbbQwTq86+e4+4LtQSooxtYrhXAstOIBNQ
// SIG // md16QOJXu69YmhzhHQGGrLt48ovQ7DsB7uK+jwoFyI1I
// SIG // 4vBTFd1Pq5Lk541q1YDB5pTyBi+FA+mRKiQicPv2/OR4
// SIG // mS4N9wficLwYTp2OawpylbihOZxnLcVRDupiXD8WmIsg
// SIG // P+IHGjL5zDFKdjE9K3ILyOpwPf+FChPfwgphjvDXuBfr
// SIG // Tot/xTUrXqO/67x9C0J71FNyIe4wyrt4ZVxbARcKFA7S
// SIG // 2hSY9Ty5ZlizLS/n+YWGzFFW6J1wlGysOUzU9nm/qhh6
// SIG // YinvopspNAZ3GmLJPR5tH4LwC8csu89Ds+X57H2146So
// SIG // dDW4TsVxIxImdgs8UoxxWkZDFLyzs7BNZ8ifQv+AeSGA
// SIG // nhUwZuhCEl4ayJ4iIdBD6Svpu/RIzCzU2DKATCYqSCRf
// SIG // WupW76bemZ3KOm+9gSd0BhHudiG/m4LBJ1S2sWo9iaF2
// SIG // YbRuoROmv6pH8BJv/YoybLL+31HIjCPJZr2dHYcSZAI9
// SIG // La9Zj7jkIeW1sMpjtHhUBdRBLlCslLCleKuzoJZ1GtmS
// SIG // hxN1Ii8yqAhuoFuMJb+g74TKIdbrHk/Jmu5J4PcBZW+J
// SIG // C33Iacjmbuqnl84xKf8OxVtc2E0bodj6L54/LlUWa8kT
// SIG // o/0xggRzMIIEbwIBATCBhzB5MQswCQYDVQQGEwJVUzET
// SIG // MBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVk
// SIG // bW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0
// SIG // aW9uMSMwIQYDVQQDExpNaWNyb3NvZnQgQ29kZSBTaWdu
// SIG // aW5nIFBDQQIKYRnMkwABAAAAZjAJBgUrDgMCGgUAoIGe
// SIG // MBkGCSqGSIb3DQEJAzEMBgorBgEEAYI3AgEEMBwGCisG
// SIG // AQQBgjcCAQsxDjAMBgorBgEEAYI3AgEVMCMGCSqGSIb3
// SIG // DQEJBDEWBBTnblwxnIykAjhSplpU8tu2W7vnJzA+Bgor
// SIG // BgEEAYI3AgEMMTAwLqAUgBIAUwBwAGgAZQByAGUALgBq
// SIG // AHOhFoAUaHR0cDovL21pY3Jvc29mdC5jb20wDQYJKoZI
// SIG // hvcNAQEBBQAEggEAS7JL82etanHfenZQB9aa/pjN4Xot
// SIG // KAEb9lSVu2/5w5DRTfGFSJi7N72M5324xIkp9Tlbc+mH
// SIG // dmxq9GbNhsKbH7XKLxF6p9FUxr+7doUZWdhlAsiH+bMb
// SIG // HNmWLZ7XxFFdWn+VE2KZXiNHBJIAbu64GEslNGKGcb5L
// SIG // mIRv15uzYlQRYwcCerSigq49CKQs2PK+NM8WWSpaC8qc
// SIG // AZDD/brijWZl8tvBoKc9arIDFakXii+BMj5x7Yt2aTLK
// SIG // FKpxg/b75RrXFlUStRX1hOP836zZWXlEAoK1TZ1rh9fX
// SIG // kg1xFL7b6CXiltn9vj6rN7RrDjzANrpcVVsnLd5+k5ev
// SIG // mUWMnKGCAh8wggIbBgkqhkiG9w0BCQYxggIMMIICCAIB
// SIG // ATCBhTB3MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2Fz
// SIG // aGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UE
// SIG // ChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMSEwHwYDVQQD
// SIG // ExhNaWNyb3NvZnQgVGltZS1TdGFtcCBQQ0ECCmENr40A
// SIG // AAAAACgwCQYFKw4DAhoFAKBdMBgGCSqGSIb3DQEJAzEL
// SIG // BgkqhkiG9w0BBwEwHAYJKoZIhvcNAQkFMQ8XDTEyMDcy
// SIG // NzAxNDYzOVowIwYJKoZIhvcNAQkEMRYEFKicG/3X117f
// SIG // YtEU5buIPDJRPTF4MA0GCSqGSIb3DQEBBQUABIIBAAfB
// SIG // gxXUiH6EoOIgN8JxlyubJxZWovs28axHR9O/+aezvyaC
// SIG // PTYultKIzikbodL9P9VuIT1RTS1YgFAtzMdr+qLXfYEQ
// SIG // t738YFakbGHmw7+Zs5YJlj87Ip2D7FUsfUfiEi1PnZpQ
// SIG // G3pJC/iml9Tq37MIMBcwP+hLwGa1KuIhL1OCHhjhbw55
// SIG // vrupEQwQ/IIBLMwr7qAy7P3E16p/I3xspmjr2RdV7sBW
// SIG // jDJwhij+ryRtipDICBpMUxoHARKO43z5476czI3xOhc1
// SIG // iGdVXfYm1fvt7Rcwfewmn+++nlTzC+yrSQotvaZI7x5v
// SIG // +SkEQS3qjrFX/AdBYdQDSCFxk16pqqg=
// SIG // End signature block
