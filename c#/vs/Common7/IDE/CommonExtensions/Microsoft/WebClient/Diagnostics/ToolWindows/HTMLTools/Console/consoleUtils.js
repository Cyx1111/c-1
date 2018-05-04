// Expected global variables:
/*global $ */

var consoleUtils = {

    // Constant for the amount of indented space in JSON 'stringified' objects
    jsonIndentCount: 12,

    // A set of types used in the console for different output items
    consoleNotifyType: {
        assert: "consoleItemError",
        error: "consoleItemError",
        info: "consoleItemInfo",
        log: "consoleItemLog",
        warn: "consoleItemWarn"
    },

    // A set of UI strings
    consoleUITypeStrings : {
        emptyArray: "[array] [ ]",
        emptyObject: "[object] { }"
    },
    
    // A set of filters
    consoleFilterId: {
        all: -1,
        error: 0,
        warning: 1,
        message: 2,
        log: 3
    },
    
    getDetailedTypeOf: function (value, constructors) {
        /// <summary>
        ///     Gets a string representing the type of the passed in value.
        ///     This supliments the built in typeof function by calculating the type of certain objects such as
        ///     array, date, and regex
        /// </summary>
        /// <param name="value" type="Object">
        ///     The javascript value to be checked for its real type
        /// </param>
        /// <param name="constructors" type="Object" optional="true">
        ///     An optional object that contains a set of constructors to check an "object" type against for further
        ///     sub typing into array, date, and regex
        ///     These objects need to come from the same window context as the value we are classifying
        /// </param>
        /// <returns type="String">
        ///     A string representing the type of this value, possible values include:
        ///     undefined, null, object, array, date, regex, string, number, function, and boolean
        /// </returns>
        /// <disable>JS3053.IncorrectNumberOfArguments,JS2005.UseShortFormInitializations</disable>
        if (value === undefined) {
            return "undefined";
        }

        var type = (typeof value);
        if (type === "object") {
            if (value) {
                if (typeof value.length === "number" && typeof value.propertyIsEnumerable === "function" && !(value.propertyIsEnumerable("length")) && typeof value.splice === "function") {
                    return "array";
                }

                // See if we have specific constructors to test against
                var arrayCon = (constructors && constructors.array ? constructors.array : (new Array()).constructor);
                var dateCon = (constructors && constructors.date ? constructors.date : (new Date()).constructor);
                var regexCon = (constructors && constructors.regex ? constructors.regex : (new RegExp()).constructor);

                try {
                    if (value.constructor === arrayCon) {
                        return "array";
                    } else if (value.constructor === dateCon) {
                        return "date";
                    } else if (value.constructor === regexCon) {
                        return "regex";
                    }
                } catch (e) {
                    // This object is not accessible
                }
            } else {
                return "null";
            }

            return "object";
        }

        return type;
    },

    isEmpty: function (obj) {
        /// <summary>
        ///     Checks if the passed in object is empty (such as { }) because it has no members
        /// </summary>
        /// <param name="obj" type="Object">
        ///     The javascript object to be checked for members
        /// </param>
        /// <returns type="Boolean">
        ///     True if the object contains no members, False otherwise
        /// </returns>

        if (typeof obj === "object") {
            try {
                for (var i in obj) {
                    return false;
                }
            } catch (e) {
                // Cannot access this member therefore it must have one
                return false;
            }
        }

        return true;
    },

    wrapInQuotes: function (stringToWrap) {
        /// <summary>
        ///     Escapes a string so that it is wrapped in double quotes.
        /// </summary>
        /// <param name="stringToWrap" type="String">
        ///     The javascript string that is to be escaped and wrapped in quotes
        /// </param>
        /// <returns type="String">
        ///     The escaped string
        /// </returns>
        
        return "\"" + stringToWrap.replace(/\\"/g, "\"") + "\"";
    },
       
    highlightElementText: function (start, end) {
        /// <summary>
        ///     Highlights consecutive dom elements on the page as if the
        ///     user had selected the text with the mouse
        /// </summary>
        /// <param name="start" type="Object">
        ///     The first dom element to highlight
        /// </param>
        /// <param name="end" type="Object" optional="true">
        ///     Optional parameter that specifies the last dom element to highlight
        ///     If this parameter is undefined, then the function will only highlight the start element
        /// </param>
        
        var selection = window.getSelection();
        selection.removeAllRanges();

        // Highlight the text
        var range = document.createRange();
        if (end) {
            range.setStart(start, 0);
            range.setEnd(end, 1);
        } else {
            range.selectNode(start);
        }
        
        try {
            selection.addRange(range);
        } catch (ex) {
            // The addRange function can fail on hidden table elements, so fail gracefully.
        }
    },
    
    getVisibleHtmlElementText: function (element) {
        /// <summary>
        ///     Calculates the visible text value of a dom element and returns it
        /// </summary>
        /// <param name="element" type="Object">
        ///     The dom element to get the visible text for
        /// </param>
        /// <returns type="String">
        ///     All the visible text for this dom element
        /// </returns>
        
        // Ensure the element is visible
        if ($(element).is(":visible")) {
        
            // Text nodes can just return their value
            if (element.nodeType === 3) {
                return element.nodeValue;
            }
        
            // Otherwise we need to use recursion to get the text for all the children nodes
            var visibleText = "", i = 0;
            while (element.childNodes[i]) {
                visibleText += consoleUtils.getVisibleHtmlElementText(element.childNodes[i]);
                i++;
            }

            return visibleText;
        }
        
        return "";
    },
    
    createPadding: function (levels, singleLevelPadding) {
        /// <summary>
        ///     Generates a white space string that can be used for indenting
        /// </summary>
        /// <param name="levels" type="Number">
        ///     The number of indents to create
        /// </param>
        /// <param name="singleLevelPadding" type="String">
        ///     The padding string to use for one level
        /// </param>
        /// <returns type="String">
        ///     The white space string to use for padding indents
        /// </returns>

        // Check for no padding
        if (levels === 0) {
            return "";
        }
        
        // Add each level
        var padding = "";
        for (var i = 0; i < levels; i++) {
            padding += singleLevelPadding;
        }
        return padding;
    },
    
    getIndentedObjectString: function (obj, detailedType, stringPadding, indentString, newLineString, useEncodeHtml, useTrim) {
        /// <summary>
        ///     Generates a indented string representing an object
        /// </summary>
        /// <param name="obj" type="Object">
        ///     The javascript object to be turned into a pretty string
        /// </param>
        /// <param name="detailedType" type="String">
        ///     The detailedType string for this object (generated from getDetailedTypeOf function)
        /// </param>
        /// <param name="stringPadding" type="Number">
        ///     The amount of padding to add to each line
        /// </param>
        /// <param name="indentString" type="String">
        ///     The string used for padding for each level of indentation
        /// </param>
        /// <param name="newLineString" type="String">
        ///     The string that should be used to split up each line of text
        /// </param>
        /// <param name="useEncodeHtml" type="Boolean">
        ///     Should each line of text be encoded so that Html is displayed safely
        /// </param>
        /// <param name="useTrim" type="Boolean">
        ///     Should each line of text be trimmed to remove whitespace
        /// </param>
        /// <returns type="String">
        ///     The correctly indented string
        /// </returns>
        
        var text = "";
        var objectString = "" + obj;
        if ((/\S/).test(objectString)) {
            // Generate the padding for this string indent
            var indentCount = 0;
            
            var finalLines = [];
            if (detailedType === "string") {
                // Strings need to retain their spacing
                if (useEncodeHtml) { 
                    objectString = toolwindowHelpers.htmlEscape(objectString);
                } 
                text = objectString.replace(/(\r\n|\n\r|\r|\n)/g, newLineString);
            } else {
                // Split into lines, then process each one
                var lines = $.trim(objectString).split(/[\r\n]+/);
                for (var lineIndex = 0; lineIndex < lines.length; lineIndex++) {
                    if (lines[lineIndex] !== "") {
                        var indent = "";

                        // Get this line of text using the parameter selections
                        var lineText = lines[lineIndex];
                        if (useEncodeHtml) { 
                            lineText = toolwindowHelpers.htmlEscape(lineText);
                        } 
                        lineText = lineText.replace(/^\s+|\s+$/g, ""); // Trim white space
                        

                        if (detailedType === "function") {
                            if ((/^\}/).test(lineText)) {
                                indentCount--;
                            }
                            
                            for (var i = 0; i < indentCount; i++) {
                                indent += indentString;
                            }
                        
                            if ((/\{$/).test(lineText)) {
                                indentCount++;
                            }
                        }
                        
                        finalLines.push(indent + lineText);
                    }
                }

                var lineBreaks = newLineString;

                // Small functions should be condensed to a single line
                if (detailedType === "function" && finalLines.length === 3) {
                    finalLines[1] = $.trim(finalLines[1].replace(/^(&nbsp;)+/, ""));
                    finalLines[2] = $.trim(finalLines[2]);
                    lineBreaks = " ";
                }

                // Join up the lines into html with line breaks
                text = finalLines.join(lineBreaks);
            }
        }
        
        return text;
    }

};
// SIG // Begin signature block
// SIG // MIIaPgYJKoZIhvcNAQcCoIIaLzCCGisCAQExCzAJBgUr
// SIG // DgMCGgUAMGcGCisGAQQBgjcCAQSgWTBXMDIGCisGAQQB
// SIG // gjcCAR4wJAIBAQQQEODJBs441BGiowAQS9NQkAIBAAIB
// SIG // AAIBAAIBAAIBADAhMAkGBSsOAwIaBQAEFIYkigOxYpvs
// SIG // gmD2aDv1c2zGTv6qoIIVLTCCBKAwggOIoAMCAQICCmEZ
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
// SIG // VmSsmsysl5gpipeQh+qdtjCCBLowggOioAMCAQICCmEF
// SIG // GZYAAAAAABswDQYJKoZIhvcNAQEFBQAwdzELMAkGA1UE
// SIG // BhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNV
// SIG // BAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBD
// SIG // b3Jwb3JhdGlvbjEhMB8GA1UEAxMYTWljcm9zb2Z0IFRp
// SIG // bWUtU3RhbXAgUENBMB4XDTExMDcyNTIwNDIxOVoXDTEy
// SIG // MTAyNTIwNDIxOVowgbMxCzAJBgNVBAYTAlVTMRMwEQYD
// SIG // VQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25k
// SIG // MR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24x
// SIG // DTALBgNVBAsTBE1PUFIxJzAlBgNVBAsTHm5DaXBoZXIg
// SIG // RFNFIEVTTjo5RTc4LTg2NEItMDM5RDElMCMGA1UEAxMc
// SIG // TWljcm9zb2Z0IFRpbWUtU3RhbXAgU2VydmljZTCCASIw
// SIG // DQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBANPLO1Oi
// SIG // n0SjeqtNVnFTineqN5N+AT79qwKjU6n/0bEixQCQ53Vu
// SIG // 7hjogQ4TxdhhAL4foHY7BA0ExQSgqPxDUwahBAS5C5KY
// SIG // AmI479QzEvcrPXvvrUVXhZUgn9djNJxiRo6+ruDZnjn2
// SIG // qVX9z+d35jUT71zov0iTTxpDB1g4in+FFGzqydBLeoJu
// SIG // y9MVYAgUiZSoWz86yT8gfW0vWBp9yoo4vMPCOWjYLVga
// SIG // I+0qEAhaIIyCpe3Rl0WShczDN4PfDZh8xdO24JlT2HgI
// SIG // 9eUjIQdihlpqaRn9cPlTNIH3JTEZhoeLwFWa/apMNRX9
// SIG // W+mVyatTmClfLKXhJQ9kxfKwJ3UCAwEAAaOCAQkwggEF
// SIG // MB0GA1UdDgQWBBR5I+ehDb5VLGgYKWKCZ9bz4TY4WjAf
// SIG // BgNVHSMEGDAWgBQjNPjZUkZwCu1A+3b7syuwwzWzDzBU
// SIG // BgNVHR8ETTBLMEmgR6BFhkNodHRwOi8vY3JsLm1pY3Jv
// SIG // c29mdC5jb20vcGtpL2NybC9wcm9kdWN0cy9NaWNyb3Nv
// SIG // ZnRUaW1lU3RhbXBQQ0EuY3JsMFgGCCsGAQUFBwEBBEww
// SIG // SjBIBggrBgEFBQcwAoY8aHR0cDovL3d3dy5taWNyb3Nv
// SIG // ZnQuY29tL3BraS9jZXJ0cy9NaWNyb3NvZnRUaW1lU3Rh
// SIG // bXBQQ0EuY3J0MBMGA1UdJQQMMAoGCCsGAQUFBwMIMA0G
// SIG // CSqGSIb3DQEBBQUAA4IBAQBHwnaBWzHdb9M8mfJ6bH6X
// SIG // E1AsBRcbELhEobWM9FbPvbAhtGRtYRzY7ujr9ZLuQ6IY
// SIG // RMP6+u+ttlx/l21LtUP7J2F4CFR8sfmvmAq0dMSq6C1Q
// SIG // xH3+fU6hmdYnKLeu2N+xj4Mijs7zefxhFG2/68yEsN+j
// SIG // u1sFt+pU9WIdbCemY0v646H6u9+FlmVpU7C2cZhkJma9
// SIG // xfFcYryR9D2cS0IADc84BRQmWtwqBUt/apk42N1zmaLO
// SIG // jFAknqTr9T+KeMxUmV0lZqRBBiivScS0UpTs3gKDZP5N
// SIG // 1P9LovwpgNvuP6s87TOIyr8iYNBcOwSwCrSYbTynOk+a
// SIG // 0QEWEWKKQXagMIIFvDCCA6SgAwIBAgIKYTMmGgAAAAAA
// SIG // MTANBgkqhkiG9w0BAQUFADBfMRMwEQYKCZImiZPyLGQB
// SIG // GRYDY29tMRkwFwYKCZImiZPyLGQBGRYJbWljcm9zb2Z0
// SIG // MS0wKwYDVQQDEyRNaWNyb3NvZnQgUm9vdCBDZXJ0aWZp
// SIG // Y2F0ZSBBdXRob3JpdHkwHhcNMTAwODMxMjIxOTMyWhcN
// SIG // MjAwODMxMjIyOTMyWjB5MQswCQYDVQQGEwJVUzETMBEG
// SIG // A1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9u
// SIG // ZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9u
// SIG // MSMwIQYDVQQDExpNaWNyb3NvZnQgQ29kZSBTaWduaW5n
// SIG // IFBDQTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
// SIG // ggEBALJyWVwZMGS/HZpgICBCmXZTbD4b1m/My/Hqa/6X
// SIG // FhDg3zp0gxq3L6Ay7P/ewkJOI9VyANs1VwqJyq4gSfTw
// SIG // aKxNS42lvXlLcZtHB9r9Jd+ddYjPqnNEf9eB2/O98jak
// SIG // yVxF3K+tPeAoaJcap6Vyc1bxF5Tk/TWUcqDWdl8ed0WD
// SIG // hTgW0HNbBbpnUo2lsmkv2hkL/pJ0KeJ2L1TdFDBZ+NKN
// SIG // Yv3LyV9GMVC5JxPkQDDPcikQKCLHN049oDI9kM2hOAaF
// SIG // XE5WgigqBTK3S9dPY+fSLWLxRT3nrAgA9kahntFbjCZT
// SIG // 6HqqSvJGzzc8OJ60d1ylF56NyxGPVjzBrAlfA9MCAwEA
// SIG // AaOCAV4wggFaMA8GA1UdEwEB/wQFMAMBAf8wHQYDVR0O
// SIG // BBYEFMsR6MrStBZYAck3LjMWFrlMmgofMAsGA1UdDwQE
// SIG // AwIBhjASBgkrBgEEAYI3FQEEBQIDAQABMCMGCSsGAQQB
// SIG // gjcVAgQWBBT90TFO0yaKleGYYDuoMW+mPLzYLTAZBgkr
// SIG // BgEEAYI3FAIEDB4KAFMAdQBiAEMAQTAfBgNVHSMEGDAW
// SIG // gBQOrIJgQFYnl+UlE/wq4QpTlVnkpDBQBgNVHR8ESTBH
// SIG // MEWgQ6BBhj9odHRwOi8vY3JsLm1pY3Jvc29mdC5jb20v
// SIG // cGtpL2NybC9wcm9kdWN0cy9taWNyb3NvZnRyb290Y2Vy
// SIG // dC5jcmwwVAYIKwYBBQUHAQEESDBGMEQGCCsGAQUFBzAC
// SIG // hjhodHRwOi8vd3d3Lm1pY3Jvc29mdC5jb20vcGtpL2Nl
// SIG // cnRzL01pY3Jvc29mdFJvb3RDZXJ0LmNydDANBgkqhkiG
// SIG // 9w0BAQUFAAOCAgEAWTk+fyZGr+tvQLEytWrrDi9uqEn3
// SIG // 61917Uw7LddDrQv+y+ktMaMjzHxQmIAhXaw9L0y6oqhW
// SIG // nONwu7i0+Hm1SXL3PupBf8rhDBdpy6WcIC36C1DEVs0t
// SIG // 40rSvHDnqA2iA6VW4LiKS1fylUKc8fPv7uOGHzQ8uFaa
// SIG // 8FMjhSqkghyT4pQHHfLiTviMocroE6WRTsgb0o9ylSpx
// SIG // bZsa+BzwU9ZnzCL/XB3Nooy9J7J5Y1ZEolHN+emjWFbd
// SIG // mwJFRC9f9Nqu1IIybvyklRPk62nnqaIsvsgrEA5ljpnb
// SIG // 9aL6EiYJZTiU8XofSrvR4Vbo0HiWGFzJNRZf3ZMdSY4t
// SIG // vq00RBzuEBUaAF3dNVshzpjHCe6FDoxPbQ4TTj18KUic
// SIG // ctHzbMrB7HCjV5JXfZSNoBtIA1r3z6NnCnSlNu0tLxfI
// SIG // 5nI3EvRvsTxngvlSso0zFmUeDordEN5k9G/ORtTTF+l5
// SIG // xAS00/ss3x+KnqwK+xMnQK3k+eGpf0a7B2BHZWBATrBC
// SIG // 7E7ts3Z52Ao0CW0cgDEf4g5U3eWh++VHEK1kmP9QFi58
// SIG // vwUheuKVQSdpw5OPlcmN2Jshrg1cnPCiroZogwxqLbt2
// SIG // awAdlq3yFnv2FoMkuYjPaqhHMS+a3ONxPdcAfmJH0c6I
// SIG // ybgY+g5yjcGjPa8CQGr/aZuW4hCoELQ3UAjWwz0wggYH
// SIG // MIID76ADAgECAgphFmg0AAAAAAAcMA0GCSqGSIb3DQEB
// SIG // BQUAMF8xEzARBgoJkiaJk/IsZAEZFgNjb20xGTAXBgoJ
// SIG // kiaJk/IsZAEZFgltaWNyb3NvZnQxLTArBgNVBAMTJE1p
// SIG // Y3Jvc29mdCBSb290IENlcnRpZmljYXRlIEF1dGhvcml0
// SIG // eTAeFw0wNzA0MDMxMjUzMDlaFw0yMTA0MDMxMzAzMDla
// SIG // MHcxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5n
// SIG // dG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVN
// SIG // aWNyb3NvZnQgQ29ycG9yYXRpb24xITAfBgNVBAMTGE1p
// SIG // Y3Jvc29mdCBUaW1lLVN0YW1wIFBDQTCCASIwDQYJKoZI
// SIG // hvcNAQEBBQADggEPADCCAQoCggEBAJ+hbLHf20iSKnxr
// SIG // LhnhveLjxZlRI1Ctzt0YTiQP7tGn0UytdDAgEesH1VSV
// SIG // FUmUG0KSrphcMCbaAGvoe73siQcP9w4EmPCJzB/LMySH
// SIG // nfL0Zxws/HvniB3q506jocEjU8qN+kXPCdBer9CwQgSi
// SIG // +aZsk2fXKNxGU7CG0OUoRi4nrIZPVVIM5AMs+2qQkDBu
// SIG // h/NZMJ36ftaXs+ghl3740hPzCLdTbVK0RZCfSABKR2YR
// SIG // JylmqJfk0waBSqL5hKcRRxQJgp+E7VV4/gGaHVAIhQAQ
// SIG // MEbtt94jRrvELVSfrx54QTF3zJvfO4OToWECtR0Nsfz3
// SIG // m7IBziJLVP/5BcPCIAsCAwEAAaOCAaswggGnMA8GA1Ud
// SIG // EwEB/wQFMAMBAf8wHQYDVR0OBBYEFCM0+NlSRnAK7UD7
// SIG // dvuzK7DDNbMPMAsGA1UdDwQEAwIBhjAQBgkrBgEEAYI3
// SIG // FQEEAwIBADCBmAYDVR0jBIGQMIGNgBQOrIJgQFYnl+Ul
// SIG // E/wq4QpTlVnkpKFjpGEwXzETMBEGCgmSJomT8ixkARkW
// SIG // A2NvbTEZMBcGCgmSJomT8ixkARkWCW1pY3Jvc29mdDEt
// SIG // MCsGA1UEAxMkTWljcm9zb2Z0IFJvb3QgQ2VydGlmaWNh
// SIG // dGUgQXV0aG9yaXR5ghB5rRahSqClrUxzWPQHEy5lMFAG
// SIG // A1UdHwRJMEcwRaBDoEGGP2h0dHA6Ly9jcmwubWljcm9z
// SIG // b2Z0LmNvbS9wa2kvY3JsL3Byb2R1Y3RzL21pY3Jvc29m
// SIG // dHJvb3RjZXJ0LmNybDBUBggrBgEFBQcBAQRIMEYwRAYI
// SIG // KwYBBQUHMAKGOGh0dHA6Ly93d3cubWljcm9zb2Z0LmNv
// SIG // bS9wa2kvY2VydHMvTWljcm9zb2Z0Um9vdENlcnQuY3J0
// SIG // MBMGA1UdJQQMMAoGCCsGAQUFBwMIMA0GCSqGSIb3DQEB
// SIG // BQUAA4ICAQAQl4rDXANENt3ptK132855UU0BsS50cVtt
// SIG // DBOrzr57j7gu1BKijG1iuFcCy04gE1CZ3XpA4le7r1ia
// SIG // HOEdAYasu3jyi9DsOwHu4r6PCgXIjUji8FMV3U+rkuTn
// SIG // jWrVgMHmlPIGL4UD6ZEqJCJw+/b85HiZLg33B+JwvBhO
// SIG // nY5rCnKVuKE5nGctxVEO6mJcPxaYiyA/4gcaMvnMMUp2
// SIG // MT0rcgvI6nA9/4UKE9/CCmGO8Ne4F+tOi3/FNSteo7/r
// SIG // vH0LQnvUU3Ih7jDKu3hlXFsBFwoUDtLaFJj1PLlmWLMt
// SIG // L+f5hYbMUVbonXCUbKw5TNT2eb+qGHpiKe+imyk0Bnca
// SIG // Ysk9Hm0fgvALxyy7z0Oz5fnsfbXjpKh0NbhOxXEjEiZ2
// SIG // CzxSjHFaRkMUvLOzsE1nyJ9C/4B5IYCeFTBm6EISXhrI
// SIG // niIh0EPpK+m79EjMLNTYMoBMJipIJF9a6lbvpt6Znco6
// SIG // b72BJ3QGEe52Ib+bgsEnVLaxaj2JoXZhtG6hE6a/qkfw
// SIG // Em/9ijJssv7fUciMI8lmvZ0dhxJkAj0tr1mPuOQh5bWw
// SIG // ymO0eFQF1EEuUKyUsKV4q7OglnUa2ZKHE3UiLzKoCG6g
// SIG // W4wlv6DvhMoh1useT8ma7kng9wFlb4kLfchpyOZu6qeX
// SIG // zjEp/w7FW1zYTRuh2Povnj8uVRZryROj/TGCBH0wggR5
// SIG // AgEBMIGHMHkxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpX
// SIG // YXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYD
// SIG // VQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xIzAhBgNV
// SIG // BAMTGk1pY3Jvc29mdCBDb2RlIFNpZ25pbmcgUENBAgph
// SIG // GcyTAAEAAABmMAkGBSsOAwIaBQCggaowGQYJKoZIhvcN
// SIG // AQkDMQwGCisGAQQBgjcCAQQwHAYKKwYBBAGCNwIBCzEO
// SIG // MAwGCisGAQQBgjcCARUwIwYJKoZIhvcNAQkEMRYEFN9P
// SIG // 99GxoTdBm/MYZ7F/e0jrwWMgMEoGCisGAQQBgjcCAQwx
// SIG // PDA6oCCAHgBjAG8AbgBzAG8AbABlAFUAdABpAGwAcwAu
// SIG // AGoAc6EWgBRodHRwOi8vbWljcm9zb2Z0LmNvbTANBgkq
// SIG // hkiG9w0BAQEFAASCAQB0pn30QggCanz18lqgjYJAzGWu
// SIG // AZAdxDFKsdXUR4FOpvK5d5rDLr/3lO9GkkWEJLyFcfz+
// SIG // FsbLfIaUd0TprovMrkNCosgFLlasU8C4w/831Icu/WLI
// SIG // WIGmdUj2F7ldR9mWh2kwZz26bJRxplXsH61Awo5WKCi1
// SIG // fwuEeyagq1yfOQ/yZ2DrYf3vQOBaI/qNy+fzZlt0TOyw
// SIG // RdF71fEQ2U37XeKdqzor/5JIo6oLR9i+citoODL62z3r
// SIG // 8nsSPfbT+COQvCUN/erBIm5yc7mmX0+lidEYkXlgwkdU
// SIG // NqhHUFZ+IdvLTtHvxDqIkD8qoZ3eWzaFXPUYRO5lCAK6
// SIG // yzej4hQeoYICHTCCAhkGCSqGSIb3DQEJBjGCAgowggIG
// SIG // AgEBMIGFMHcxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpX
// SIG // YXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYD
// SIG // VQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xITAfBgNV
// SIG // BAMTGE1pY3Jvc29mdCBUaW1lLVN0YW1wIFBDQQIKYQUZ
// SIG // lgAAAAAAGzAHBgUrDgMCGqBdMBgGCSqGSIb3DQEJAzEL
// SIG // BgkqhkiG9w0BBwEwHAYJKoZIhvcNAQkFMQ8XDTEyMDcy
// SIG // NzAxNDYyNlowIwYJKoZIhvcNAQkEMRYEFGZzOFxYLS63
// SIG // ThstU1zwpk/S7KtNMA0GCSqGSIb3DQEBBQUABIIBAEQp
// SIG // Q5NN6JM7KLGviHf4wFpt/a4j0hS0vz2aKWzaUZzFzMJS
// SIG // Lp1hzliADiQD1WjV1SQdAPiXJfMFZQWNgVOtdB1GCvLP
// SIG // E7w4Qm0fhDG2MmmtDlHAUGIsKhjnHp7wgMdy551tquBu
// SIG // MYBot06ceiLZSVLQ6poMHFVfGid8A5bnXi925j95DeWl
// SIG // 87XBgRHfeKyp2NcJiC+70lQdCgch6rLco2ZUW+i4u4Lm
// SIG // EsC9dkDsWQgK2eXNTbz3buARpZCH06jp2LXiyyIEyrOi
// SIG // mv9OMnpnkjJpw/xlSJEhpJIaNTVs+9Mqx4WNhx7m/ft1
// SIG // AjXURXXPkMuXKP8k2rVzf7T+xbA+Krw=
// SIG // End signature block
