// Expected global variables:
/*global clipboardData domExplorerCode jQuery */

(function ($) {
    /// <summary>
    ///     TabItem - JQuery extension for constructing a tab item, 
    ///     The tabItem object can be initialized by calling tabItem on a jQuery object.
    ///     Requires:
    ///     - layout.css
    /// </summary>
    
    var methods = {
    
        // Default constructor
        init: function (selectedCallback) {
            /// <summary>
            ///     Creates a new TabItem
            /// </summary>
            /// <param name="selectedCallback" type="Function">
            ///     The callback to fire when the tab is changed
            /// </param>
            /// <returns type="Object">
            ///     The jquery object for the new TabItem
            /// </returns>
            
            this.addClass("BPT-Tab-Item");
            
            // Add the click and focus handlers
            this.bind("click focus", function () {
            
                // Ensure we aren't currently editing a textbox
                if (document.activeElement && document.activeElement.type !== "text") {
                    var item = $(this);
                    
                    // Get the currently selected tab from the siblings of the one clicked (or focused)
                    var currentElement = item.siblings(".BPT-Tab-Item.BPT-Tab-Item-Active");

                    // Ensure the tab has changed
                    if (currentElement[0]) {
                        currentElement.removeClass("BPT-Tab-Item-Active");
                        currentElement.addClass("BPT-Tab-Item-Inactive");
                        currentElement.removeAttr("tabindex");
                        
                        item.attr("tabindex", "1");
                        item.removeClass("BPT-Tab-Item-Inactive");
                        item.addClass("BPT-Tab-Item-Active");
                        if (selectedCallback) {
                            selectedCallback();
                        }
                    }
                }
            });
        },
        
        isActive: function () {
            /// <summary>
            ///     Gets a value indicating if this TabItem is the currently selected one
            /// </summary>  
            /// <returns type="Boolean">
            ///     True if this item is active, false otherwise
            /// </returns>
            
            return this.hasClass("BPT-Tab-Item-Active");
        }
    };

    $.fn.tabItem = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method !== "object" || !method) {
            return methods.init.apply(this, arguments);
        }
    };
}(jQuery));


(function ($) {
    /// <summary>
    ///     HorizontalPane - JQuery extension for constructing a horizontal resizable pane, 
    ///     The horizontalPane object can be initialized by calling horizontalPane on a jQuery object.
    ///     Requires:
    ///     - layout.css
    /// </summary>

    var methods = {
    
        // Default constructor
        init: function () {
            /// <summary>
            ///     Creates a new HorizontalPane
            /// </summary>
            /// <returns type="Object">
            ///     The jquery object for the new HorizontalPane
            /// </returns>
            
            var item = this;
            var rightPane = item.children(".BPT-HorizontalPane-Right");
            item.children().addClass("BPT-Pane");

            var windowWidth = $(window).width();
            
            var curWidth = (windowWidth > 0 ? (windowWidth / 100) * 30 : 300);

//+VWD
            if (window.VWDHost && window.VWDHost.LastRightPaneWidth >= 0) {
                curWidth = window.VWDHost.LastRightPaneWidth;
            }
//-VWD
            var minPaneSize = 200;
            var setPaneWidth = function (newWidth) {
                if (newWidth <= 0) {
                    return;
                }
                curWidth = newWidth = Math.max(minPaneSize, newWidth);
                curWidth = newWidth = Math.round(curWidth); // Clamp to nearest pixel
                var paneSize = item.outerWidth();
                if (paneSize < minPaneSize * 2) {
                    newWidth = paneSize >> 1;
                } else if (paneSize - newWidth < minPaneSize) {
                    newWidth = paneSize - minPaneSize;
                }
//+VWD
                if (window.VWDHost) {
                    window.VWDHost.LastRightPaneWidth = newWidth;
                }
//-VWD                
                item.css("paddingRight", newWidth + "px");
                rightPane.css("marginRight", "-" + newWidth + "px");
                rightPane.css("width", newWidth + "px");
            };
            
            $(window).resize(function () {
                setPaneWidth(curWidth);
            });
            
            setPaneWidth(curWidth);

            var divider = $("<div class='BPT-Pane-Divider'></div>");
            rightPane.prepend(divider);
            divider.mousedown(function (evt) {
                var prevCursor = document.body.style.cursor;
                document.body.style.cursor = "w-resize";

                // Create mouse handlers for resizing
                var mouseMoveHandler, mouseUpHandler;
                mouseMoveHandler = function (evt) {
                    // If the user triggered the 'mouseup' event outside the tool window
                    if (!window.event.button) {
                        mouseUpHandler();
                    }
                    var dividerLoc = divider.offset().left;
                    setPaneWidth(rightPane.width() - evt.pageX + dividerLoc);
                };
                mouseUpHandler = function () {
                    $(document).unbind("mousemove", mouseMoveHandler);
                    $(document).unbind("mouseup", mouseUpHandler);
                    document.body.style.cursor = prevCursor;
                };
                $(document).bind("mousemove", mouseMoveHandler);
                $(document).bind("mouseup", mouseUpHandler);
                
                // Prevent highlighting text while resizing
                // This also stops resizing while the cursor is outside our window.
                evt.stopImmediatePropagation();
                evt.preventDefault();
            });

        }
    };
    
    $.fn.horizontalPane = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method !== "object" || !method) {
            return methods.init.apply(this, arguments);
        }
    };    
        
}(jQuery));


(function ($) {
    /// <summary>
    ///     EditTextbox - JQuery extension for constructing a double click editbox,
    ///     Takes a span element and replaces it with a textbox that has the same contents as the original span.  
    ///     Triggers a callback function when the changes are being submitted.    
    ///     The EditTextbox object can be initialized by calling editTextbox on a jQuery object.
    ///
    ///     Requires:
    ///     - layout.css
    /// </summary>
    
    var textBox = $("<input type='text' class='BPT-EditBox'></input>");
    var replacedObj = null;
    var editChangeCallback = null;
    var editClosedCallback = null;
    var originalValue = null;
    var originalOverflow = "";
    var lastCommitedValue = null;
    var arrowKeysUsed = false;
    
    var methods = {
    
        // Default constructor
        init: function (changeCallback, closedCallback) {
            /// <summary>
            ///     Creates a new EditTextbox
            /// </summary>
            /// <param name="changeCallback" type="Function" optional="true">
            ///     Optional parameter specifying a callback for when the edit box has changed text
            /// </param> 
            /// <param name="closedCallback" type="Function" optional="true">
            ///     Optional parameter specifying a callback for when the edit box has closed
            /// </param>                           
            /// <returns type="Object">
            ///     The jquery object for the new EditTextbox
            /// </returns>
            
            var removeAndFocusParentContainer, removeTextbox;
            removeAndFocusParentContainer = function (evt, wasCancelled) {
                var container = textBox.parents(".BPT-DataTree-Container");
                container = (container.length > 0 ? container : textBox.parents(".BPT-HtmlTree-Container"));
                container = (container.length > 0 ? container : textBox.parents(".BPT-EditContainer:first"));
                
                removeTextbox(wasCancelled);

                if (container.length > 0) {
                    container.data("mouseActivate", true); // Stop the default 'scroll into view' behavior
                    container.focus();
                    try {
                        container.data("mouseActivate", true); // Stop the default 'scroll into view' behavior
                        container[0].setActive();
                    } catch (ex) {
                        // Setting the active element can sometimes cause an 'Incorrect Function' exception in IE9/10,
                        // We should fail gracefully in this situation.
                    }
                }
            };
            
            removeTextbox = function (wasCancelled) {
                $(document).unbind("mousedown", removeAndFocusParentContainer);
                
                var newValue = textBox.attr("value");
                
                if (wasCancelled) {
                    // We need to reset the value because it was cancelled
                    newValue = originalValue;
                    
                    // We need to fire another change, if the arrow keys were used to change the value dynamically
                    if (arrowKeysUsed && lastCommitedValue !== originalValue) {
                        if (editChangeCallback) {
                            editChangeCallback(originalValue);
                        }
                    }
                } else if (arrowKeysUsed && lastCommitedValue !== newValue) {
                    // Fire a change because the arrow keys changed the value dynamically, but then the user changed the text manually
                    if (editChangeCallback) {
                        editChangeCallback(newValue);
                    }
                } else if (newValue !== originalValue) {
                    // Fire a change because the user changed the text manually
                    if (editChangeCallback) {
                        editChangeCallback(newValue);
                    }
                } 
                
                // Update the real value
                if (replacedObj) {
                    // Restore the parent's style
                    textBox.parent().css("overflow", originalOverflow);
            
                    textBox.replaceWith(replacedObj);
                    replacedObj.text(newValue);
                    replacedObj = null;

                    // Fire the closed callback
                    if (editClosedCallback) {
                        editClosedCallback(newValue, wasCancelled);
                    }
                }
            };
           
            var stopPropagationHandler = function (evt) {
                evt.stopPropagation();
            };
            
            var keyPressHandler = function (evt) {
                if (evt.keyCode === 9 || evt.keyCode === 13 || evt.keyCode === 27) { // Tab(9), Enter(13), Escape(27)
                
                    removeAndFocusParentContainer(evt, evt.keyCode === 27);   // Escape(27) means the commit was cancelled
                    evt.stopImmediatePropagation();
                    return false;
                } else if (event.keyCode === 38 || event.keyCode === 40) { // Up(38) or Down(40)
                
                    // Get the value and check for a single number
                    var text = textBox.val();
                    var number = parseInt(text, 10);
                    if (!isNaN(number)) {

                        // Change the number
                        var changeAmount = (evt.shiftKey ? 10 : 1);
                        var newNumber = number + (event.keyCode === 38 ? (1 * changeAmount) : (-1 * changeAmount));
                        var newText = text.replace("" + number, newNumber);
                        textBox.val(newText);
                        
                        // Fire the callback
                        if (editChangeCallback) {
                            // Mark the usage of arrow keys to change the value
                            arrowKeysUsed = true;
                            lastCommitedValue = newText;
                            editChangeCallback(newText);
                        }
                    }            
                }
            };
    
            // If we are trying to create an edit box for a non-existent element, then quit early
            if (this.length === 0) {
                return;
            }
            
            // Remove any existing textbox
            if (replacedObj) {
                // Inform caller that the commit was cancelled
                removeTextbox(true);
            }

            // Set the variables and create the textbox
            editChangeCallback = changeCallback;
            editClosedCallback = closedCallback;
            originalValue = this.text();
            lastCommitedValue = null;
            arrowKeysUsed = false;
            
            // Try to have the textbox at around the same size as the thing we are replacing
            textBox.attr("size", Math.max(originalValue.length, 8));
            
            // Save the parent's original style and change it to always allow the textbox to be seen
            originalOverflow = this.parent().css("overflow");
            this.parent().css("overflow", "visible");
            
            replacedObj = this.replaceWith(textBox.attr("value", originalValue));
            
            // Add event handlers
            $(document).bind("mousedown", removeAndFocusParentContainer, true);
            textBox.keydown(keyPressHandler);
            textBox.bind("mousedown mouseup click dblclick", stopPropagationHandler);
            
            textBox.bind("contextmenu", function (e) {
                var x = e.clientX;
                var y = e.clientY;
                if (e.clientX <= 0 || e.clientY <= 0) {
                    // Keyboard activation
                    x = textBox.offset().left;
                    y = textBox.offset().top;
                }
                
                // Get the context menu parameters
                var selectedText = document.selection.createRange().text;
                var pasteText = clipboardData.getData("Text");
                var canCut = (selectedText !== "");
                var canCopy = canCut;
                var canPaste = (pasteText && pasteText !== "" ? true : false);
                var menuParams = [
                    canCut,
                    canCopy,
                    canPaste
                ];
                
                var callback = function (id, selectedMenuItem) {
                    if (id === "menuTextControl") {
                        switch (selectedMenuItem) {
                            case "menuTextControlCut":
                                document.selection.createRange().execCommand("Cut");
                                break;
                                
                            case "menuTextControlCopy":
                                clipboardData.setData("Text", selectedText);
                                break;
                                
                            case "menuTextControlPaste":
                                var textElement = textBox[0];
                                var startPos = textElement.selectionStart;
                                var endPos = textElement.selectionEnd;

                                textElement.value = textElement.value.substring(0, startPos) + pasteText + textElement.value.substring(endPos, textElement.value.length);
                                break;
                        }
                    }
                };
//                domExplorerCode.externalApis.vsBridge.showContextMenu("menuTextControl", x, y, callback, menuParams);
                domExplorerCode.externalApis.resources.showContextMenu("menuTextControl", x, y, callback, menuParams);

                // Stop the real context menu
                stopPropagationHandler(e);
                return false;
            });

            // Now select and focus the new textbox
            textBox.select().focus();
        }
    };
    
    $.fn.editTextbox = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method !== "object" || !method) {
            return methods.init.apply(this, arguments);
        }
    };      
}(jQuery));

// SIG // Begin signature block
// SIG // MIIaYgYJKoZIhvcNAQcCoIIaUzCCGk8CAQExCzAJBgUr
// SIG // DgMCGgUAMGcGCisGAQQBgjcCAQSgWTBXMDIGCisGAQQB
// SIG // gjcCAR4wJAIBAQQQEODJBs441BGiowAQS9NQkAIBAAIB
// SIG // AAIBAAIBAAIBADAhMAkGBSsOAwIaBQAEFFglVi8Du7n+
// SIG // AX2KrFufdvNPC0YMoIIVLTCCBKAwggOIoAMCAQICCmEZ
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
// SIG // EzYAAAAAABowDQYJKoZIhvcNAQEFBQAwdzELMAkGA1UE
// SIG // BhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNV
// SIG // BAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBD
// SIG // b3Jwb3JhdGlvbjEhMB8GA1UEAxMYTWljcm9zb2Z0IFRp
// SIG // bWUtU3RhbXAgUENBMB4XDTExMDcyNTIwNDIxN1oXDTEy
// SIG // MTAyNTIwNDIxN1owgbMxCzAJBgNVBAYTAlVTMRMwEQYD
// SIG // VQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25k
// SIG // MR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24x
// SIG // DTALBgNVBAsTBE1PUFIxJzAlBgNVBAsTHm5DaXBoZXIg
// SIG // RFNFIEVTTjoxNTlDLUEzRjctMjU3MDElMCMGA1UEAxMc
// SIG // TWljcm9zb2Z0IFRpbWUtU3RhbXAgU2VydmljZTCCASIw
// SIG // DQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAJw0mBnJ
// SIG // CSljmQIWdaiIV32hu6lBEvxkkaXWBXi/d9zs5q64UE7A
// SIG // 4xq97bf9+CCKcTmqcpJyn4oJ5RPvkUHtYSVrUa3uqEO1
// SIG // YUIsnfIdsdL8t/V7o3N2E7Mro9uUYYBVoQ9t3djsFv+F
// SIG // f5aeiH8ALo56JLponY/GyvSQeXrhm+8GXX74LsNqFZw8
// SIG // FC/n1ZTIIhtRy6lVhiG3WvNBEjmf8FWpTqolK2P7kXI8
// SIG // D3zAlnLcwaPBCMrexcm1wApfpZwLqnIKXQpAfS6Y0Kuy
// SIG // iI+GgOh90b5Va+BYLMg2P/nmEcPwQwWFeAMX5SynKXzT
// SIG // 4pUXAGzb3K08GToC4H1i1M72HT0CAwEAAaOCAQkwggEF
// SIG // MB0GA1UdDgQWBBT2g4sghxHug8vb3oWi0miGN2F0kDAf
// SIG // BgNVHSMEGDAWgBQjNPjZUkZwCu1A+3b7syuwwzWzDzBU
// SIG // BgNVHR8ETTBLMEmgR6BFhkNodHRwOi8vY3JsLm1pY3Jv
// SIG // c29mdC5jb20vcGtpL2NybC9wcm9kdWN0cy9NaWNyb3Nv
// SIG // ZnRUaW1lU3RhbXBQQ0EuY3JsMFgGCCsGAQUFBwEBBEww
// SIG // SjBIBggrBgEFBQcwAoY8aHR0cDovL3d3dy5taWNyb3Nv
// SIG // ZnQuY29tL3BraS9jZXJ0cy9NaWNyb3NvZnRUaW1lU3Rh
// SIG // bXBQQ0EuY3J0MBMGA1UdJQQMMAoGCCsGAQUFBwMIMA0G
// SIG // CSqGSIb3DQEBBQUAA4IBAQBi9AUNT+cba4LnUgzfeYyo
// SIG // VYEzl9Okysn+r0jbe9pveihPx9C3idjRppnMkVYAOzjo
// SIG // tzIv7vnPa9mY3tYC9UJYUmuO2kDcFqCz1L8mFctIQszT
// SIG // /bT65ESJZg9CDl73BJ8jSFu0iUHE2mz4NvQ/wh4V35hM
// SIG // AMSy7N5fAQFDnLhC1iLIk5qeyaUYZ/xHhB6RXZvydvex
// SIG // jnIdgHY8NhFGyn46SPOv40n2FzONuwBjgpxXo1anw26Q
// SIG // oz6Vt/xk0V0YwgsBUGOn/PPRgJ6E4zI03VeVQKNtftrr
// SIG // LloItBAGXjLJCekygnEWp/rGr2aYifnZnrVfECOjd4Dy
// SIG // TdYoAHJQhbzlMIIFvDCCA6SgAwIBAgIKYTMmGgAAAAAA
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
// SIG // zjEp/w7FW1zYTRuh2Povnj8uVRZryROj/TGCBKEwggSd
// SIG // AgEBMIGHMHkxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpX
// SIG // YXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYD
// SIG // VQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xIzAhBgNV
// SIG // BAMTGk1pY3Jvc29mdCBDb2RlIFNpZ25pbmcgUENBAgph
// SIG // GcyTAAEAAABmMAkGBSsOAwIaBQCggc4wGQYJKoZIhvcN
// SIG // AQkDMQwGCisGAQQBgjcCAQQwHAYKKwYBBAGCNwIBCzEO
// SIG // MAwGCisGAQQBgjcCARUwIwYJKoZIhvcNAQkEMRYEFGki
// SIG // Nd9d3Nv09JZfdVqSZjW9RSmkMG4GCisGAQQBgjcCAQwx
// SIG // YDBeoESAQgBNAGkAYwByAG8AcwBvAGYAdAAgAFYAaQBz
// SIG // AHUAYQBsACAAUwB0AHUAZABpAG8AIABXAGUAYgAgAFQA
// SIG // bwBvAGwAc6EWgBRodHRwOi8vd3d3LmFzcC5uZXQvIDAN
// SIG // BgkqhkiG9w0BAQEFAASCAQChsE5H8MId7a+g4ushDSHX
// SIG // fZi/g+7wV4rrCvi+8eLqtWG1N5XVKiSePwSZ3w2Djbp+
// SIG // kQJMl2mAflk/y2CXmPyF812U+VPNPaLf2UHMRp5iEdax
// SIG // MreHuotx7KjB26+Tde4uPKVYluhAghwTR9TIprl1AzxM
// SIG // NIbhzFFnE0JMF2Lj8wrimC5xlAhXrJXxihaLb+z6UMqn
// SIG // Q6B7QTPOlylhnHEhkakZ8JuUzNhKVODQvxGvjhe82evq
// SIG // +Iz9aQ6urVrwHC/HYlSm4gnFTpbfO+TdB4ETsjrPq1Bj
// SIG // EbbfHztvEwFpettz8DXTrooFxQE4xEfiEYmc/RIney4I
// SIG // BNLGWeH2mx+QoYICHTCCAhkGCSqGSIb3DQEJBjGCAgow
// SIG // ggIGAgEBMIGFMHcxCzAJBgNVBAYTAlVTMRMwEQYDVQQI
// SIG // EwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4w
// SIG // HAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xITAf
// SIG // BgNVBAMTGE1pY3Jvc29mdCBUaW1lLVN0YW1wIFBDQQIK
// SIG // YQUTNgAAAAAAGjAHBgUrDgMCGqBdMBgGCSqGSIb3DQEJ
// SIG // AzELBgkqhkiG9w0BBwEwHAYJKoZIhvcNAQkFMQ8XDTEy
// SIG // MDcxMDIxMzgzOFowIwYJKoZIhvcNAQkEMRYEFIvwA14L
// SIG // UvBFwjU6VVI4zfNDyfvOMA0GCSqGSIb3DQEBBQUABIIB
// SIG // ABeEyLWtQHJAxZKbr3yWeS+qEGUYhUalBjl/SB9IJQP9
// SIG // FyeYH4qHWxxltvWs6OZVQlzpuIez/gO1/w75wHLwmHmZ
// SIG // Q0vLkjVJCAsumJsC2nmDto5CTDFVufUWYMo2wwuzBvEe
// SIG // OfKe0fBydcGnXjHpK9gf3SvX2wNC/MJneb/3gnvWFv0O
// SIG // IHBHLQjYN9NIN3Xckft4yHE9TouG++cxrlqnrbPtkd/B
// SIG // ED/BnodRRLKgyZ0wcNTJEv9JqpNB2eqCwHDJlIIISA2u
// SIG // o17nhYXp7dtjo9MPMYI8Zu0uhnZU+CYCCgrxZLSy21O/
// SIG // yOhSiRW8uKOKgdWr6kkM7UKGTbLOs8D22N4=
// SIG // End signature block
