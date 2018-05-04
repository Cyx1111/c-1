/// <reference path="./console.html" />

// Expected global variables:
/*global $ callProxy clipboardData consoleUtils toolwindowHelpers */

var consoleCode = {
    
    // Number of elements to create before adding to the DOM (300 empirically found to give best performance)
    maxMessageElementsBatchSize: 300,

    // Number of elements to clear in one go (5000 empirically found to give best performance)
    maxClearBatchSize: 5000,
    
    // Amount of milliseconds to wait before batching messages together (50ms matches the remote side timeout)
    messageBatchTimeout: 50,
    
    // The window.external object that contains functions for communicating to the remote script engine
    externalApis: null,

    // The array of input items in the console
    inputItems: [],

    // The array of output items in the console
    outputItems: [],
    
    // A queue of output objects that we are batching together
    pendingOutputObjects: [],
    
    // The number of each type of notification that is currently displayed in the console toolbar
    notificationCounts: {},

    // The number of each type of notification that is currently displayed in the console toolbar
    notificationFilters: {},
    
    // Since we don't have a log filter button, we need to store its state here
    showingLog: true,

    initialize: function (apis) {
        /// <summary>
        ///     Gets the console window ready for use. 
        ///     Creates the communication channel between VS and the remote side and inserts the remote side code ready for diagnostics
        ///     Also initializes the UI, adding the button styling to the html page
        /// </summary>
        /// <param name="apis" type="Object">
        ///     The window.external object that will be used to set up the communication channel
        ///     Unit tests can send in a mock javascript object to use as a communication harness for testing the console
        /// </param>

        consoleCode.externalApis = apis;
        consoleCode.inputItems = [];
        consoleCode.outputItems = [];
        consoleCode.notificationCounts = { errors: -1, warnings: -1, messages: -1 };
        consoleCode.notificationFilters = { errors: true, warnings: true, messages: false, log: true };
        consoleCode.showingLog = consoleCode.notificationFilters.log;
        
        if (consoleCode.externalApis) {
            // Setup the UI
            toolwindowHelpers.initializeToolWindow(consoleCode.externalApis, true, consoleCode.onMessage, consoleCode.onAttach, consoleCode.onDetach);
            consoleCode.initializeButtons();
            consoleCode.initializeContextMenus();
            consoleCode.initializeLinks();
            
            $("#messagesButton").removeClass("BPT-ToolbarToggleButton-StateOn");

            // Localize the controls
            consoleCode.loadingString = toolwindowHelpers.loadString("LoadingText");
            var clearLabel = toolwindowHelpers.loadString("ClearButtonText");
            $("#clearButton div").not(".buttonIcon").text(clearLabel);
            $("#clearButton").attr("title", clearLabel);
            consoleCode.updateAllNotificationCounts();
            
            // Show any non-fatal errors that occurred before initialization
            if (window.lastScriptError) {
                consoleCode.onError(window.lastScriptError.message, window.lastScriptError.file, window.lastScriptError.line, window.lastScriptError.additionalInfo);
            }
        }
    },

    onAttach: function () {
        /// <summary>
        ///     The onAttach handler that is called when the diagnostics engine has attached to a process 
        ///     and debugging has started
        /// </summary>
        consoleCode.clearVsSide();
        consoleCode.isInitialHandshake = true;
        
        consoleCode.externalApis.loadScriptInProc("../Common/remoteHelpers.js");
        consoleCode.externalApis.loadScriptInProc("consoleUtils.js");
        consoleCode.externalApis.loadScriptInProc("remote.js");
    },

    onDetach: function () {
        /// <summary>
        ///     The onDetach handler that is called when the diagnostics engine has detached from a process
        ///     and debugging has stopped
        /// </summary>
        
        consoleCode.showNotification(
            consoleUtils.consoleNotifyType.info,
            toolwindowHelpers.loadString("OnDetach")
        );
    },

    onMessage: function (msg) {
        /// <summary>
        ///     This method is called back when the remote side has posted a message to the console window
        /// </summary>
        /// <param name="msg" type="String">
        ///     The message string that was sent.
        ///     This function expects the string to be in the form of a JSON stringified object with the following format:
        ///     { type: int, id: "string", data: { object } };
        /// </param>
        
        window.msWriteProfilerMark("ConsoleWindow:BeginOnMessage");
        
        if (msg.data === "DocumentNotYetReady") {
            // Request the document information again
            window.setTimeout(function () {
                toolwindowHelpers.remotePort.postMessage("InitializeDocument");
            }, 100);
            
        } else if (msg.data.substr(0, 10) === "Handshake:") {
            // Document attach successful
            var connectionInfo = JSON.parse(msg.data.substring(10));
            consoleCode.onHandshake(connectionInfo);
            
            toolwindowHelpers.codeMarker(toolwindowHelpers.codeMarkers.perfBrowserTools_DiagnosticsToolWindowsConsoleReady);
            
        } else {
            callProxy.fireCallbacks(msg.data);
        }
        
        window.msWriteProfilerMark("ConsoleWindow:EndOnMessage");
    },
    
    onError: function (message, file, line, additionalInfo) {
        /// <summary>
        ///     Shows a script error message in the console with information
        /// </summary>
        /// <param name="message" type="String">
        ///     The error message
        /// </param>
        /// <param name="file" type="String">
        ///     The file in which the error occurred
        /// </param>
        /// <param name="line" type="Number">
        ///     The line on which the error occurred
        /// </param>
        /// <param name="additionalInfo" type="String">
        ///     Any additional information about the error such as callstack
        /// </param>
    
        try {
            // Get the file name
            if (file) {
                var parts = file.split("/");
                if (parts.length > 0) {
                    file = parts[parts.length - 1];
                }
            }

            // Construct the error message for localization
            var errorMessage = toolwindowHelpers.loadString("ConsoleScriptError") + "\r\n" + 
                               toolwindowHelpers.loadString("ScriptErrorMessage", [message]) + "\r\n" + 
                               toolwindowHelpers.loadString("ScriptErrorFile", [file]) + "\r\n" + 
                               toolwindowHelpers.loadString("ScriptErrorLine", [line]) + "\r\n" +
                               additionalInfo;
                               
            var outputObj = {
                inputId: -1, 
                consoleType: "consoleItemScriptError", 
                detailedType: "string", 
                isExpandable: false, 
                value: errorMessage
            };
            consoleCode.onOutput(outputObj);
   
        } catch (ex) {
            // Fail gracefully if our error handler has an error in it
        }
    },
     
    initializeButtons: function () {
        /// <summary>
        ///     This function sets up the main toolbar buttons by adding the click and keyboard activation behaviors
        /// </summary>
        
        $(".BPT-ToolbarToggleButton").bind("click keydown", function (event) {
            if (event.type === "click" || event.keyCode === 13 || event.keyCode === 32) { // Enter(13) and Space(32)
                consoleCode.updateNotificationFilters();
            }
        });
        $("#clearButton").bind("click keydown", function (event) {
            if (event.type === "click" || event.keyCode === 13 || event.keyCode === 32) { // Enter(13) and Space(32)
                consoleCode.onClear();
                return false;
            }
        });
        $("#outputArea").bind("keypress keydown", function (event) {
            if (event.ctrlKey && event.keyCode === 67) { // C (67)
                var wasCopied = consoleCode.copySelectionToClipboard();
                if (wasCopied) {
                    event.stopImmediatePropagation();
                    return false;
                }
            }
        });    
    },

    initializeContextMenus: function () {
        /// <summary>
        ///     Sets up the event listeners for context menus on the console
        /// </summary>
        
        $("#outputArea").bind("contextmenu", function (e) {
            var selectedItem = null;
            var treeElement = null;
            var treeItem = null;
            var dataObject = null;
            var x = e.clientX;
            var y = e.clientY;
            if (e.clientX <= 0 || e.clientY <= 0) {
                // Keyboard activation
                if (document.activeElement) {
                    selectedItem = consoleCode.getConsoleItemFromId(document.activeElement.id);
                    if (selectedItem) {
                        treeElement = $(document.activeElement);
                        x = treeElement.offset().left;
                        y = treeElement.offset().top;
                    }
                }
            } else {
                // Mouse activation
                treeElement = $(document.elementFromPoint(x, y));
                selectedItem = consoleCode.getConsoleItemFromClick(e.clientX, e.clientY);
            }
            
            // Get the tree item ready
            if (treeElement !== null) {
                treeItem = treeElement.closest(".BPT-DataTreeItem");
                if (treeItem.length > 0) {
                    // DataTreeItem
                    dataObject = consoleCode.getActualObjectFromDataTreeLeaf(selectedItem, treeItem);
                } else {
                    // HtmlTreeItem
                    treeItem = treeElement.closest(".BPT-HtmlTreeItem");
                }
                treeItem.trigger("click");
            }
            
            // Output list items
            var outputListCounted = $("#outputList").children(":visible:not(.BPT-IgnoreForCount)");
            var outputListIgnored = $("#outputList").children(".BPT-IgnoreForCount").children(":visible");

            // Set the parameters for the context menu
            var selectedText = document.selection.createRange().text;
            var canViewAsHtml = (dataObject && dataObject.isHtmlViewableType ? true : false);
            var canViewAsObject = (treeItem && treeItem.hasClass("BPT-HtmlTreeItem") ? true : false);
            var canCopy = (selectedText !== "" || selectedItem !== null);
            var canCopyItem = (selectedItem !== null);
            var canCopyAll = (outputListCounted.length + outputListIgnored.length > 0);
            var canClear = !$("#clearButton").hasClass("BPT-ToolbarButton-StateDisabled");
            var menuParams = [
                canViewAsHtml,
                canViewAsObject,
                canCopy,
                canCopyItem,
                canCopyAll,
                canClear,
                consoleCode.notificationFilters.errors,
                consoleCode.notificationFilters.warnings,
                consoleCode.notificationFilters.messages,
                consoleCode.notificationFilters.log
            ];

            var callback = function (id, selectedMenuItem) {
                if (id === "menuConsole") {
                    switch (selectedMenuItem) {
                        case "menuConsoleViewAsHtml":
                            if (dataObject) {
                                // Re-evaluate this data tree object as Html
                                var objectId = (typeof dataObject.value === "string" ? dataObject.value : dataObject.id);
                                objectId = (objectId ? objectId : dataObject.uid);
                                callProxy("getObjectItemAsHtml", [objectId], consoleCode.onOutput);
                            }
                            break;
                            
                        case "menuConsoleViewAsObject":
                            if (treeItem) {
                                // Re-evaluate this html item as a data tree object
                                var htmlId = treeItem.attr("data-id");
                                callProxy("getHtmlItemAsObject", [htmlId], consoleCode.onOutput);
                            }
                            break;
                            
                        case "menuConsoleCopy":
                            consoleCode.copySelectionToClipboard();
                            break;

                        case "menuConsoleCopyItem":
                            consoleCode.copyItemToClipboard(selectedItem);
                            break;

                        case "menuConsoleCopyAll":
                            var textToCopy = "";
                            var items = outputListIgnored.add(outputListCounted);
                            for (var i = 0; i < items.length; i++) {
                                var item = consoleCode.getConsoleItemFromId(items[i].id);
                                
                                if (i !== 0) {
                                    textToCopy += "\r\n";
                                }
                                
                                textToCopy += item.getCopyText();
                            }
                            consoleUtils.highlightElementText(document.getElementById("outputList"));
                            clipboardData.setData("Text", textToCopy);
                            break;

                        case "menuConsoleClear":
                            consoleCode.onClear();
                            break;

                        case "menuConsoleFilterErrors":
                            window.toggleFilter(consoleUtils.consoleFilterId.error);
                            break;

                        case "menuConsoleFilterWarnings":
                            window.toggleFilter(consoleUtils.consoleFilterId.warning);
                            break;

                        case "menuConsoleFilterMessages":
                            window.toggleFilter(consoleUtils.consoleFilterId.message);
                            break;
                            
                        case "menuConsoleFilterLog":
                            window.toggleFilter(consoleUtils.consoleFilterId.log);
                            break;

                        case "menuConsoleFilterAll":
                            window.toggleFilter(consoleUtils.consoleFilterId.all, true);
                            break;

                        default:
                            // Do nothing
                            break;
                    }
                }
            };

            consoleCode.externalApis.vsBridge.showContextMenu("menuConsole", x, y, callback, menuParams);
            return false;
        });    
    },
    
    initializeLinks: function () {
        /// <summary>
        ///     Sets up the event listeners for links on the console
        /// </summary>
        
        $(".BPT-FileLink").live("click", function (event) {
            var element = $(event.target);
            var url = element.attr("data-linkUrl");
            var line = element.attr("data-linkLine");
            var col = element.attr("data-linkCol");
            
            var lineNumber = 0;
            if (line) {
                lineNumber = parseInt(line, 10);
            }
            
            var colNumber = 0;
            if (col) {
                colNumber = parseInt(col, 10);
            }
            
            // Try to open the file in VS
            try {
                // IE reports the file url as URI encoded (eg. 'file%20name.html') so we should decode it
                url = decodeURI(url);
                toolwindowHelpers.externalApis.openDocumentLink(url, lineNumber, colNumber);
            } catch (ex) {
                // If the file fails to open then we should handle it gracefully
            }
        });
        
        $(".BPT-HelpLink").live("click", function (event) {
            var element = $(event.target);
            var keyword = element.attr("data-linkKeyword");
            
            // Open the url as an F1 help page in VS
            toolwindowHelpers.externalApis.vsBridge.openF1HelpLink(keyword);
        });        
    },

    onHandshake: function (connectionInfo) {
        /// <summary>
        ///     This function is called when the remote side has created a port and recieved a portReady message from the console
        ///     The handshake message will contain information about the remote side that we need to know such as doc mode
        /// </summary>
        /// <param name="connectionInfo" type="Object">
        ///     The handshake object returned from the remote side code.
        ///     This function expects the string to be in the form of a JSON stringified object with the following format:
        ///     { docMode: "string" }
        /// </param>

        if (consoleCode.isInitialHandshake) {
            consoleCode.isInitialHandshake = false;

            // Show that we have attached successfully
            consoleCode.showNotification(
                consoleUtils.consoleNotifyType.info,
                toolwindowHelpers.loadString("OnAttach")
            );

            // Setup the callback for console notifications
            callProxy("registerConsoleCallbacks", [
                consoleCode.onOutput,
                consoleCode.onConsoleNotification, 
                consoleCode.onRemoteClear
            ]);
        }

        var warningSection = $("#warningSection");

        warningSection.hide();
        
        // Warn about the doc mode if needed
        if (connectionInfo.docMode < 9) {
            warningSection.text(
                toolwindowHelpers.loadString("WrongDocumentMode")
            );
            warningSection.show();
        }
        
        // Remember the 'eval' context information
        consoleCode.contextInfo = connectionInfo.contextInfo;

    },

    onInput: function (input, onCompleteCallback) {
        /// <summary>
        ///     Sends a string to the current browser context for evaluation against that script engine.
        ///     Also appends that string onto the console UI as an input item.
        ///     Optionally registers a function to callback on when the evaluation of the input has completed
        ///     and the result returned and appended to the console UI.
        /// </summary>
        /// <param name="input" type="String">
        ///     The javascript string that is to be evaled on the associated script engine
        /// </param>
        /// <param name="onCompleteCallback" type="Function">
        ///     An optional function that will be called when the input has been evaluated and the result
        ///     returned and appended to the console UI.
        ///     The signiture of the function should be:
        ///     completeCallback:function(inputId, outputId, outputClass, displayText);
        ///     inputId - Integer - unique identifier of the input that caused this result
        ///     outputId - Integer - unique identifier of the result
        ///     outputClass - String - the css class of the output type (error, log, etc)
        ///     displayText - String - the actual result as displayed in the console UI
        /// </param>
        /// <returns type="Number">
        ///     The unique inputId associated with this eval if it is successfully sent to the script engine.
        ///     Note - this will match the one returned in the callback
        ///     Or -1 if the input was never sent for evaluation due to an error. In this case the callback will
        ///     never be executed.
        /// </returns>

        
        if (!toolwindowHelpers.remotePort) {
            // No connection to a script engine
            consoleCode.showNotification(
                consoleUtils.consoleNotifyType.warn,
                toolwindowHelpers.loadString("NotAttached")
            );
            return -1;
        }

        if (typeof (input) !== "string") {
            // We only respond to string inputs
            return -1;
        }

        // Ensure that we have some text to process
        if (input && (/\S/).test(input)) {
            // Create a new list item
            var inputItem = new ConsoleInputItem(
                input,
                onCompleteCallback
            );
            consoleCode.inputItems.push(inputItem);

            // Create and add the list item
            var item = $("<li>").attr("id", inputItem.getHtmlIdentifier()).addClass(inputItem.getDisplayClass()).html(inputItem.getDisplayText()).attr("tabindex", "1");
            item.appendTo("#outputList");
            consoleCode.scrollToBottom();

            // Now pack the input into a message and send to IE for evaluation
            window.msWriteProfilerMark("ConsoleWindow:BeginPostInput");
            
            // Now pack the input into a message and send to IE for evaluation
            if (toolwindowHelpers.atBreakpoint) {
                toolwindowHelpers.executeBreakModeCommand("processInput", inputItem.id, input, consoleCode.onOutput);
            } else {
                callProxy("processInput", [inputItem.id, input], consoleCode.onOutput);
            }
            
            window.msWriteProfilerMark("ConsoleWindow:EndPostInput");

            // We have an item that can be cleared now
            $("#clearButton").removeClass("BPT-ToolbarButton-StateDisabled");

            return inputItem.id;
        }

        return -1;
    },
    
    onOutput: function (outputObj) {
        /// <summary>
        ///     This method is called back when the remote side has eval'ed an input string and the result has been returned
        /// </summary>
        /// <param name="outputObj" type="Object">
        ///     The result object returned from the remote side code.
        ///     This function expects the string to be in the form of a JSON stringified object with the following format:
        ///     { inputId: number, consoleType: "string", detailedType: "string", value: {object} }
        /// </param>
        
        if (!outputObj) {
            // Invalid output objects should display an error
            consoleCode.showNotification(
                consoleUtils.consoleNotifyType.error,
                toolwindowHelpers.loadString("ConsoleObjectNotFoundError")
            );
            return;
        }
        
        if (outputObj.inputId >= 0 && consoleCode.inputItems[outputObj.inputId]) {
            // This has a matching input, so we should just process it now, instead of batching it together with others
            consoleCode.processOutputObjects([outputObj]);
            
            // Mark this as the end of the evaluation
            toolwindowHelpers.codeMarker(toolwindowHelpers.codeMarkers.perfBrowserTools_DiagnosticsToolWindowsConsoleEvalEnd);
        } else {
            consoleCode.pendingOutputObjects.push(outputObj);

            // Wait messageBatchTimeout milliseconds before processing output, this gives a performance boost
            // as we can batch DOM manipulations together.
            if (!consoleCode.outputTimeout) {
                consoleCode.outputTimeout = window.setTimeout(function () {
                    // Process all the queued items
                    consoleCode.processOutputObjects(consoleCode.pendingOutputObjects);

                    // Clear the queue and timeout
                    consoleCode.pendingOutputObjects = [];
                    consoleCode.outputTimeout = null;

                }, consoleCode.messageBatchTimeout);
            }
        }
    },

    processOutputObjects: function (outputObjects) {
        /// <summary>
        ///     This method is called back when the remote side has eval'ed an input string and the result has been returned
        /// </summary>
        /// <param name="outputObjects" type="Array">
        ///     An array of output objects to process
        /// </param>
       
        // Create storage areas for expandable objects and input matching items that need extra processing
        var expandableObjects = {};
        var itemsWithMatchingInput = [];
        var createdCount = 0;
        var addedDisplayedItem = false;
        
        // Function that will add elements to the DOM using a document fragment
        var appendBatch = function (elementsString) {
            var batchedElements = document.createElement("span");
            batchedElements.className = "BPT-BatchedMessages BPT-IgnoreForCount";
            batchedElements.innerHTML = elementsString;
            $("#outputList").append($(batchedElements));
        };
        
        // Loop through the objects and create the html string
        var elementsString = "";
        for (var i = 0; i < outputObjects.length; i++) {
            // Get the output object
            var outputObj = outputObjects[i];

            // We don't display undefined results
            if (outputObj.value !== undefined) {
                createdCount++;
                
                // Create a new list item
                var outputItem = new ConsoleOutputItem(
                    outputObj.inputId,
                    outputObj
                );
                consoleCode.outputItems.push(outputItem);

                // Get the id for this object
                var id = outputItem.getHtmlIdentifier();
                
                // Build up the css class
                var cssClass = outputItem.getDisplayClass();
                if (outputObj.isExpandable) {
                    // Expandable objects have the container class
                    if (outputObj.detailedType === "htmlElement") {
                        // Html
                        cssClass += " BPT-HtmlTree-Container";
                    } else {
                        // Object
                        cssClass += " BPT-DataTree-Container";
                    }
                    // Store this object for extra processing later
                    expandableObjects[id] = outputObj;
                } else if (outputObj.detailedType === "undefined") {
                    // Undefined values need a different color
                    cssClass += " consoleItemOutput-Undefined";
                }
                
                // Objects that have a matching input must also be processed after being created
                if (outputItem.hasMatchingInput()) {
                    itemsWithMatchingInput.push(outputItem);
                }
                
                // Change the display attribute for filtering
                var isDisplayed = true;
                switch (outputItem.getDisplayClass()) {
                    case consoleUtils.consoleNotifyType.assert:
                    case consoleUtils.consoleNotifyType.error:
                        isDisplayed = consoleCode.notificationFilters.errors;
                        break;
                    case consoleUtils.consoleNotifyType.info:
                        isDisplayed = consoleCode.notificationFilters.messages;
                         break;

                    case consoleUtils.consoleNotifyType.warn:
                        isDisplayed = consoleCode.notificationFilters.warnings;
                        break;

                    case consoleUtils.consoleNotifyType.log:
                        isDisplayed = consoleCode.notificationFilters.log;
                        break;
                        
                    default:
                        // Not a notification type, so do nothing
                        break;
                }    

                addedDisplayedItem |= isDisplayed;
                
                // Create the html string
                elementsString += "<li tabindex='1' id='" + outputItem.getHtmlIdentifier() + "' class='" + cssClass + "' " + (isDisplayed ? "" : "style='display: none'") + ">" + outputItem.getDisplayText() + "</li>";

                // If we have reached the batch size, then add these to the dom
                if (createdCount > consoleCode.maxMessageElementsBatchSize) {
                    appendBatch(elementsString);
                    elementsString = "";
                    createdCount = 0;
                }
            }
        }

        if (createdCount > 1) {
            // Add any left over elements
            appendBatch(elementsString);
        } else {
            // Add the single item directly
            var listItem = $(elementsString);
            if (itemsWithMatchingInput.length === 1) {
                // Insert next to the input
                var inputIdentifier = "#" + itemsWithMatchingInput[0].inputItem.getHtmlIdentifier();
                listItem.insertAfter(inputIdentifier);
                $(inputIdentifier).addClass("noBorder");
                
                // Callback to say we have executed this command
                itemsWithMatchingInput[0].executeCallback();
                
                // No need to process this item further
                itemsWithMatchingInput = [];
            } else {
                // Add it to the end of the list
                $("#outputList").append(listItem);
            }
        }
        
        // Now we need to process the expandable objects into the tree controls
        for (var identifier in expandableObjects) {
            var expandObject = expandableObjects[identifier];
            
            // Clear the temp html
            var item = $("#" + identifier);
            item.html("");
            
            // Create the control
            if (expandObject.detailedType === "htmlElement") {
                // Html
                consoleCode.makeExpandableHtmlTree(item.htmlTreeView(), expandObject);
            } else {
                // Object
                consoleCode.makeExpandableDataTree(item.dataTreeView(), expandObject);
            }
        }
        
        // Now process the matching input items
        for (var j = 0; j < itemsWithMatchingInput.length; j++) {
            var matchedItem = itemsWithMatchingInput[j];
            
            var inputId = "#" + matchedItem.inputItem.getHtmlIdentifier();
            var outputId = "#" + matchedItem.getHtmlIdentifier();
            $(outputId).insertAfter(inputId);
            $(inputId).addClass("noBorder");
            
            // Callback to say we have executed this command
            matchedItem.executeCallback();
        }        
        
        $("span.BPT-BatchedMessages").removeClass("BPT-BatchedMessages");
        
        // Update any filter numbers
        consoleCode.updateAllNotificationCounts();

        $("#clearButton").removeClass("BPT-ToolbarButton-StateDisabled");

        if (addedDisplayedItem) {
            // Scroll to the bottom if we've added a viewable item
            consoleCode.scrollToBottom();
        }
    },

    onConsoleNotification: function (notifyObject) {
        /// <summary>
        ///     Adds an output message to the console window that doesn't correspond to any input
        ///     Used internally on this console code side to add info to the output window
        /// </summary>
        /// <param name="notifyObject" type="Object">
        ///     An object representing the notification type
        ///     {inputId: Integer, notifyType : consoleUtils.consoleNotifyType, message: "string" }
        /// </param>
        
        // Check if we have an input to link to
        var correspondingInput = (typeof notifyObject.inputId === "number" ? notifyObject.inputId : -1);
        
        if (notifyObject.notifyType === "consoleItemCDContext") {
            // CD
            var newWindowContext = notifyObject.message;
            notifyObject.notifyType = consoleUtils.consoleNotifyType.info;
            notifyObject.message = toolwindowHelpers.loadString("CDContextChanged", newWindowContext);
        } else if (notifyObject.notifyType === "consoleItemSelectInDom") {
            // Select
            if (!notifyObject.message) {
                // Invalid argument to the select function
                notifyObject.notifyType = consoleUtils.consoleNotifyType.error;
                notifyObject.message = toolwindowHelpers.loadString("InvalidElementArgument");
            } else {
                var result = consoleCode.externalApis.vsBridge.selectElementInDomExplorer();
                if (!result) {
                    // Success, so just quit early
                    return;
                } else {
                    // Failed, so show the result as a message
                    notifyObject.notifyType = consoleUtils.consoleNotifyType.error;
                    notifyObject.message = result;
                }
            }
        }
        
        if (notifyObject.localizeId) {
            notifyObject.message = toolwindowHelpers.loadString(notifyObject.localizeId);
        }
        
        var outputObj = {
            inputId: correspondingInput, 
            consoleType: notifyObject.notifyType, 
            detailedType: "string", 
            isExpandable: false, 
            value: notifyObject.message 
        };
        consoleCode.onOutput(outputObj);
    },

    clearVsSide: function () {
        /// <summary>
        ///     Removes all items from the console output window but does not
        ///     attempt to do the same for remote.js
        /// </summary>

        // Remove the data items 
        consoleCode.inputItems = [];
        consoleCode.outputItems = [];
        
        // Disable the clear button
        $("#clearButton").addClass("BPT-ToolbarButton-StateDisabled");
        
        if (document.all.length < consoleCode.maxClearBatchSize) {
            // Just remove the items directly
            $("#outputList").empty();
            
            // Update the filters
            consoleCode.updateAllNotificationCounts();
        } else {           
            // Hide the list
            $("#outputList").hide();

            window.setTimeout(function () {
                // Clear and re-show it
                $("#outputList").empty().show();
                
                // Update the filters
                consoleCode.updateAllNotificationCounts();
            }, 0);
        }
    },
    
    onClear: function () {
        /// <summary>
        ///     Removes all items from the console output window and calls the remote side to clear itself
        /// </summary>

        consoleCode.clearVsSide();

        // Clear out the remote side
        callProxy("clearConsoleData");
    },
    
    onRemoteClear: function () {
        /// <summary>
        ///     Removes all items from the console output window
        /// </summary>
        
        consoleCode.clearVsSide();
    },
    
    showNotification: function (consoleNotifyType, msg) {
        /// <summary>
        ///     Adds an output message to the console window that doesn't correspond to any input
        ///     Used internally on this console code side to add info to the output window
        /// </summary>
        /// <param name="consoleNotifyType" type="String">
        ///     The type of the message (consoleUtils.consoleNotifyType)
        /// </param>
        /// <param name="msg" type="String">
        ///     The message to display
        /// </param>
        
        consoleCode.onConsoleNotification({notifyType: consoleNotifyType, message: msg});
    },
    
    updateAllNotificationCounts: function () {
        /// <summary>
        ///     Forces an updates to the UI displaying the number of errors, warnings, and messages in the console
        /// </summary>

        // Set the counts to be -1 to force the UI to update
        consoleCode.notificationCounts = { errors: -1, warnings: -1, messages: -1 };

        // Update the UI
        consoleCode.updateNotificationCounts(consoleUtils.consoleNotifyType.error);
        consoleCode.updateNotificationCounts(consoleUtils.consoleNotifyType.info);
        consoleCode.updateNotificationCounts(consoleUtils.consoleNotifyType.warn);
    },

    updateNotificationCounts: function (consoleNotifyType) {
        /// <summary>
        ///     Updates the UI displaying the number of errors, warnings, and messages in the console
        /// </summary>
        /// <param name="consoleNotifyType" type="String">
        ///     The notification type to update, if this is not valid, the function will do nothing
        /// </param>

        var label;
        switch (consoleNotifyType) {
            case consoleUtils.consoleNotifyType.assert:
            case consoleUtils.consoleNotifyType.error:
                var errorCount = $("#outputList ." + consoleUtils.consoleNotifyType.error).size();
                if (consoleCode.notificationCounts.errors !== errorCount) {
                    label = toolwindowHelpers.loadString((errorCount === 1 ? "SingleError" : "MultiError"), errorCount);
                    $("#errorsButton div").not(".buttonIcon").text(label);
                    $("#errorsButton").attr("title", label);
                    consoleCode.notificationCounts.errors = errorCount;
                }
                break;

            case consoleUtils.consoleNotifyType.info:
                var messageCount = $("#outputList ." + consoleUtils.consoleNotifyType.info).size();
                if (consoleCode.notificationCounts.messages !== messageCount) {
                    label = toolwindowHelpers.loadString((messageCount === 1 ? "SingleMessage" : "MultiMessage"), messageCount);
                    $("#messagesButton div").not(".buttonIcon").text(label);
                    $("#messagesButton").attr("title", label);
                    consoleCode.notificationCounts.messages = messageCount;
                }
                break;

            case consoleUtils.consoleNotifyType.warn:
                var warnCount = $("#outputList ." + consoleUtils.consoleNotifyType.warn).size();
                if (consoleCode.notificationCounts.warnings !== warnCount) {
                    label = toolwindowHelpers.loadString((warnCount === 1 ? "SingleWarning" : "MultiWarning"), warnCount);
                    $("#warningsButton div").not(".buttonIcon").text(label);
                    $("#warningsButton").attr("title", label);
                    consoleCode.notificationCounts.warnings = warnCount;
                }
                break;

            default:
                // Not a valid notification type, so just don't do anything
                break;
        }
    },

    updateNotificationFilters: function () {
        /// <summary>
        ///     Updates the UI in the console by hiding or showing the message types based on the filters
        /// </summary>

        var showingErrors = $("#errorsButton").hasClass("BPT-ToolbarToggleButton-StateOn");
        if (consoleCode.notificationFilters.errors !== showingErrors) {
            $("#outputList ." + consoleUtils.consoleNotifyType.assert).css("display", (showingErrors ? "block" : "none"));
            $("#outputList ." + consoleUtils.consoleNotifyType.error).css("display", (showingErrors ? "block" : "none"));
            consoleCode.notificationFilters.errors = showingErrors;
        }

        var showingWarnings = $("#warningsButton").hasClass("BPT-ToolbarToggleButton-StateOn");
        if (consoleCode.notificationFilters.warnings !== showingWarnings) {
            $("#outputList ." + consoleUtils.consoleNotifyType.warn).css("display", (showingWarnings ? "block" : "none"));
            consoleCode.notificationFilters.warnings = showingWarnings;
        }

        var showingMessages = $("#messagesButton").hasClass("BPT-ToolbarToggleButton-StateOn");
        if (consoleCode.notificationFilters.messages !== showingMessages) {
            $("#outputList ." + consoleUtils.consoleNotifyType.info).css("display", (showingMessages ? "block" : "none"));
            consoleCode.notificationFilters.messages = showingMessages;
        }
        
        var showingLog = consoleCode.showingLog;
        if (consoleCode.notificationFilters.log !== showingLog) {
            $("#outputList ." + consoleUtils.consoleNotifyType.log).css("display", (showingLog ? "block" : "none"));
            consoleCode.notificationFilters.log = showingLog;
        }
    },
    
    makeExpandableDataTree: function (dataTree, obj) {
        /// <summary>
        ///     Assigns the result of an evaluation that is an object or array to an existing data tree
        ///     by creating a row for the result itself and one for each child when expanded
        /// </summary>
        /// <param name="dataTree" type="Object">
        ///     The datatree element that should be populated
        /// </param>
        /// <param name="obj" type="Object">
        ///     The expandable object to use for populatation of the tree
        /// </param>
        
        // Get the name and column values for the expandable root
        var nameColumn;
        var valueColumn;
        switch (obj.detailedType) {
            case "array":
                nameColumn = (obj.name ? obj.name : "[array]");
                valueColumn = "[...]";
            break;
            
            default:
                nameColumn = (obj.name ? obj.name : "[object]");
                valueColumn = "{...}";
            break;
        }

        var dataObject = {uid: obj.uid, name: nameColumn, value: valueColumn, hasChildren: true};
        
        var expandCallback, createDataTreeItems;
        createDataTreeItems = function (parentElement, obj) {
        
            if (!obj.sortedPropNames) {
                // Sort the property names for display
                obj.sortedPropNames = toolwindowHelpers.getSortedArrayProperties(obj.value, "propertyName");
            }
            
            // Initialize each child
            var items = [];
            for (var i = 0; i < obj.sortedPropNames.length; i++) {
                var propIndex = obj.sortedPropNames[i];
                var propName = obj.value[propIndex].propertyName;
                var child = obj.value[propIndex].propertyValue;
                
                // Get a safe name for display
                var nameColumn = consoleCode.encodeValueForListItem(propName, "string");
                var valueColumn = "";
                
                // Get the value and add a row
                if (!child.isExpandable) {
                    // Add a single row
                    if (!child.displayText) {
                        child.displayText = consoleCode.encodeValueForListItem(child.value, child.detailedType);
                    }
                    valueColumn = child.displayText;
                } else {
                    // Add an expandable row
                    switch (child.detailedType) {
                        case "array":
                            valueColumn = (child.name ? child.name : "[array]") + "[...]";
                        break;
                        
                        default:
                            valueColumn = (child.name ? child.name : "[object]") + " {...}";
                        break;
                    }
                    valueColumn = consoleCode.encodeValueForListItem(valueColumn, "string");
                }
                
                items.push({uid: i, name: nameColumn, value: valueColumn, hasChildren: child.isExpandable});
            }
                            
            return parentElement.dataTreeView("addItems", items, function (isExpanding, parentElement, id, onExpandComplete) {
                var index = parseInt(id, 10);
                var childObject = obj.value[obj.sortedPropNames[index]].propertyValue;
                // Fire the expand function with this child
                expandCallback(isExpanding, parentElement, id, onExpandComplete, childObject);
            });
        };
       
        expandCallback = function (isExpanding, parentElement, id, onExpandComplete, obj) {
            if (isExpanding) {
                // Fire the begin code marker
                toolwindowHelpers.codeMarker(toolwindowHelpers.codeMarkers.perfBrowserTools_DiagnosticsToolWindowsExpandConsoleObjectBegin);
                
                if (typeof obj.value === "string") {
                    // We haven't yet evaluated these children, so do that now
                    obj.id = obj.value;
                    parentElement.dataTreeView("showLoading", consoleCode.loadingString);
                    callProxy("getObjectChildren", [obj.value], function (expandedObj) {
                        if (!expandedObj) {
                            // There were no children for this item (it was probably removed before evaluation)
                            obj.value = { 
                                undefined: "undefined"
                            };
                        } else {
                            obj.value = expandedObj.value;
                        }
                        parentElement.dataTreeView("hideLoading");
                        var childGroup = createDataTreeItems(parentElement, obj);
                        if (onExpandComplete) {
                            onExpandComplete(childGroup);
                        }
                        toolwindowHelpers.codeMarker(toolwindowHelpers.codeMarkers.perfBrowserTools_DiagnosticsToolWindowsExpandConsoleObjectEnd);
                    });
                    toolwindowHelpers.codeMarker(toolwindowHelpers.codeMarkers.perfBrowserTools_DiagnosticsToolWindowsExpandConsoleObjectInteractive);
                } else {
                    // The children have already been evaluated, so just expand them
                    var childGroup = createDataTreeItems(parentElement, obj);
                    if (onExpandComplete) {
                        onExpandComplete(childGroup);
                    }
                    // Fire the end code markers
                    toolwindowHelpers.codeMarker(toolwindowHelpers.codeMarkers.perfBrowserTools_DiagnosticsToolWindowsExpandConsoleObjectInteractive);
                    toolwindowHelpers.codeMarker(toolwindowHelpers.codeMarkers.perfBrowserTools_DiagnosticsToolWindowsExpandConsoleObjectEnd);
                }
                
                // Fire the End code marker
                toolwindowHelpers.codeMarker(toolwindowHelpers.codeMarkers.perfBrowserTools_DiagnosticsToolWindowsDataTreeToggleEnd);
            }
        };
        
        // Create the root tree item
        dataTree.dataTreeView("addItems", [dataObject], function (isExpanding, parentElement, id, onExpandComplete) {
            expandCallback(isExpanding, parentElement, id, onExpandComplete, obj);
        });		
        

    },
    
    makeExpandableHtmlTree: function (htmlTree, obj) {
        /// <summary>
        ///     Creates an item for the tree view that is representing the DOM of the attached document
        /// </summary>
        /// <param name="htmlTree" type="Object">
        ///     The HtmlTreeView object that should be populated
        /// </param>        
        /// <param name="obj" type="Object">
        ///     The object to populate the tree with
        /// </param>
        
        var domObject = obj.value;
        
        var createHtmlTreeItems, expandCallback;
        createHtmlTreeItems = function (parentElement, children) {
        
            // Initialize each child
            for (var i = 0; i < children.length; i++) {                
                // Format the text
                children[i].text = toolwindowHelpers.formatMultilineString(children[i].text);
            }
            
            parentElement.htmlTreeView("clear");
            return parentElement.htmlTreeView("addElements", children, function (isExpanding, parentElement, id, onExpandComplete) {
                // Find the correct domObject from the children and id
                var obj = null;
                for (var i = 0; i < children.length; i++) {
                    if (children[i].uid === id) {
                        obj = children[i];
                        break;
                    }
                }
                // Fire the expand function with this child
                expandCallback(isExpanding, parentElement, id, onExpandComplete, obj);
            });
        };
       
        expandCallback = function (isExpanding, parentElement, id, onExpandComplete, obj) {
            if (isExpanding) {
                if (!obj.children) {
                    // We haven't yet evaluated these children, so do that now
                    parentElement.htmlTreeView("showLoading", consoleCode.loadingString);
                    callProxy("getHtmlChildren", [id], function (children) {
                        if (!children) {
                            // There were no children for this item (it was probably removed before evaluation)
                            children = [];
                        }
                        parentElement.htmlTreeView("hideLoading");
                        obj.children = children;
                        var childGroup = createHtmlTreeItems(parentElement, children);

                        // Fire the End code marker
                        toolwindowHelpers.codeMarker(toolwindowHelpers.codeMarkers.perfBrowserTools_DiagnosticsToolWindowsTreeViewToggleEnd);

                        if (onExpandComplete) {
                            onExpandComplete(childGroup);
                        }
                    });
                } else {
                    // The children have already been evaluated, so just expand them
                    var childGroup = createHtmlTreeItems(parentElement, obj.children);
                    
                    // Fire the End code marker
                    toolwindowHelpers.codeMarker(toolwindowHelpers.codeMarkers.perfBrowserTools_DiagnosticsToolWindowsTreeViewToggleEnd);
                    
                    if (onExpandComplete) {
                        onExpandComplete(childGroup);
                    }
                }
            }
        };
        
        if (domObject.tag === "#document") {
            // This is a document object that uses a hidden root
            var hiddenRoot = htmlTree.htmlTreeView("addRootElement", domObject.uid, domObject.tag, domObject.rootTag, function (isExpanding, parentElement, id, onExpandComplete) {
                expandCallback(isExpanding, parentElement, id, onExpandComplete, domObject);
            });
            hiddenRoot.htmlTreeView("toggle");
        } else {
            // Create the root tree item
            htmlTree.htmlTreeView("addElements", [domObject], function (isExpanding, parentElement, id, onExpandComplete) {
                expandCallback(isExpanding, parentElement, id, onExpandComplete, domObject);
            });
        }
    },    
    
    colorizeItem: function (element, detailedType) {
        /// <summary>
        ///     Adds a class to the specified element based on its detailedType
        ///     The class will apply the correct color to the element    
        /// </summary>
        /// <param name="element" type="Object">
        ///     The jquery DOM element to add the class to
        /// </param>
        /// <param name="detailedType" type="String">
        ///     The detailedType that this element represents
        /// </param>
        
        if (detailedType === "exception") {
            return element.addClass("BPT-DataTree-Value-Exception");
        }
        
    },

    encodeValueForListItem: function (obj, detailedType) {
        /// <summary>
        ///     Gets a string that is safe to add to the HTML console UI &lt;li&gt;, that represents the object sent in to the function
        ///     The object will have its string representation generated along with the escaping of any HTML characters (&lt;, &gt;, &amp;)
        ///     A multi-line string will also be split into lines using &lt;br /&gt; tags so that it will display on multilines in HTML
        /// </summary>
        /// <param name="obj" type="Object">
        ///     The javascript object to be turned into a list item string
        /// </param>
        /// <param name="detailedType" type="String">
        ///     Parameter specifying the detailedType string for this object (generated from getDetailedTypeOf function)
        ///     If this parameter is missing, a detailedType will be generated using the getDetailedTypeOf function
        /// </param>      
        /// <returns type="String">
        ///     A string representing the object that is safe to add to an HTML &lt;li&gt; element
        /// </returns>
        var text = "";

        if (!detailedType) {
            detailedType = consoleUtils.getDetailedTypeOf(obj);
        }

        switch (detailedType) {
            case "array":
                text = consoleUtils.consoleUITypeStrings.emptyArray;
                break;

            case "object":
                text = consoleUtils.consoleUITypeStrings.emptyObject;
                break;

            case "null":
                text = "null";
                break;

            case "undefined":
                text = "undefined";
                break;
                
            default:
                text = consoleUtils.getIndentedObjectString(obj, detailedType, 0, "&nbsp;&nbsp;&nbsp;", "<br />", true, false);
                break;
        }

        return text;
    },

    encodeValueForCopy: function (obj, detailedType, mainIndentLevel, stringPadding) {
        /// <summary>
        ///     Gets a string that is safe to for copying to the clipboard
        /// </summary>
        /// <param name="obj" type="Object">
        ///     The javascript object to be turned into a copyable string
        /// </param>
        /// <param name="detailedType" type="String" optional="true">
        ///     Optional parameter specifying the detailedType string for this object (generated from getDetailedTypeOf function)
        ///     If this parameter is missing, a detailedType will be generated using the getDetailedTypeOf function
        /// </param>
        /// <param name="mainIndentLevel" type="Number" optional="true">
        ///     Optional parameter specifying the level of the indent for the string
        ///     If this parameter is missing, the level will be set to zero
        /// </param>
        /// <param name="stringPadding" type="Number" optional="true">
        ///     Optional parameter specifying the size of the padding to give to any multiline strings
        ///     If this parameter is missing, the level will be set to zero
        /// </param>
        /// <returns type="String">
        ///     A string representing the object that is safe to add to an HTML li element
        /// </returns>
        var text = "";

        if (!detailedType) {
            detailedType = consoleUtils.getDetailedTypeOf(obj);
        }
        if (!mainIndentLevel) {
            mainIndentLevel = 0;
        }
        if (!stringPadding) {
            stringPadding = 0;
        }

        switch (detailedType) {
            case "array":
            case "object":
                // Get the correct JSON symbols for the collection
                var openSymbol = "{";
                var closeSymbol = "}";
                if (detailedType === "array") {
                    openSymbol = "[";
                    closeSymbol = "]";
                }
                
                if (!obj.sortedPropNames) {
                    // Sort the property names for display
                    obj.sortedPropNames = toolwindowHelpers.getSortedArrayProperties(obj, "propertyName");
                }
                
                if (!obj.sortedPropNames) {
                    // If we still have no sorted properties, then this object didn't have any to sort,
                    // This indicates that the properties weren't sent from the remote side.
                    return openSymbol + "..." + closeSymbol;
                }
            
                // Generate the padding for this object indent
                mainIndentLevel++;
                var insidePadding = consoleUtils.createPadding(mainIndentLevel, "    ");
                var closingPadding = consoleUtils.createPadding(mainIndentLevel - 1, "    ");
               
                // Generate the string
                text = openSymbol + (obj.sortedPropNames.length > 0 ? "\r\n" : "");
                for (var i = 0; i < obj.sortedPropNames.length; i++) {
                    var propIndex = obj.sortedPropNames[i];
                    var propName = obj[propIndex].propertyName;
                    var propValue = obj[propIndex].propertyValue;
                    if (i !== 0) {
                        text += ",\r\n";
                    }
                    text += 
                        insidePadding + 
                        propName + " : " + 
                        consoleCode.encodeValueForCopy(
                            propValue.value, 
                            propValue.detailedType, 
                            mainIndentLevel, 
                            (mainIndentLevel * 4) + stringPadding + propName.length + 3
                        );
                }
                text += (obj.sortedPropNames.length > 0 ? "\r\n" + closingPadding : " ") + closeSymbol;
                break;

            case "null":
                text = "null";
                break;

            case "undefined":
                text = "undefined";
                break;

            default:
                text = consoleUtils.getIndentedObjectString(obj, detailedType, stringPadding, "   ", "\r\n", false, true);
                break;
        }

        return text;
    },
    
    getConsoleItemFromClick: function (x, y) {
        /// <summary>
        ///     Gets a string that is safe to for copying to the clipboard
        /// </summary>
        /// <param name="x" type="Number">
        ///     The x coordinate of the click
        /// </param>
        /// <param name="y" type="Number">
        ///     The y coordinate of the click
        /// </param>
        /// <returns type="Object">
        ///     The console item that was clicked or null if there was none
        /// </returns>
        
        var selectedItem = null;
        var element = $(document.elementFromPoint(x, y));
        
        if (element.length > 0) {
            // Select the actual console item
            var consoleItem = (element.is("#outputList li") ? 
                element : 
                element.parents("#outputList li")
            );
            
            // Check that we have selected a console item now
            if (consoleItem.length > 0) {
                selectedItem = consoleCode.getConsoleItemFromId(consoleItem.attr("id"));
            }
        }    
        
        return selectedItem;
    },
    
    getConsoleItemFromId: function (id) {
        /// <summary>
        ///     Gets a console input or output item from a DOM id
        /// </summary>
        /// <param name="id" type="String">
        ///     The dom id to convert to a consoleItem
        /// </param>
        /// <returns type="Object">
        ///     The console item with this id
        /// </returns>  
        
        var consoleItem = null;
        var index;
        
        if (id.match("^input")) {
            index = parseInt(id.substring(5), 10);
            consoleItem = consoleCode.inputItems[index];
        } else if (id.match("^output")) {
            index = parseInt(id.substring(6), 10);
            consoleItem = consoleCode.outputItems[index];
        }
        
        return consoleItem;
    },
    
    getActualObjectFromDataTreeLeaf: function (consoleOutputItem, dataTreeLeaf) {
        /// <summary>
        ///     Finds the actual object that a particular leaf of a DataTree is representing
        ///     This object can then be re-evaluated on the remote side to display it as an HtmlTree
        /// </summary>
        /// <param name="consoleOutputItem" type="Object">
        ///     The ConsoleOutputItem that the full DataTree is representing
        /// </param>
        /// <param name="dataTreeLeaf" type="Object">
        ///     The JQuery DataTreeItem from the tree that we need the real object for
        /// </param>
        /// <returns type="Object">
        ///     The sub object that the dataTreeLeaf is representing
        /// </returns>  
        
        var i = 0;
        var propIds = [dataTreeLeaf.attr("data-id")];
        
        // The ConsoleOutputItem only has a reference to its real root object.
        // To get the real object for a leaf node, we need to walk up the data tree,
        // creating an array of property ids that we use to find the actual object for the leaf.
        var hierarchy = dataTreeLeaf.parents(".BPT-DataTreeItem");
        if (hierarchy.length > 0) {
            // Walk hierarchy, and append each id to the beginning of the array
            for (i = 0; i < hierarchy.length - 1; i++) {
                propIds.splice(0, 0, $(hierarchy[i]).attr("data-id"));
            }
        } else {
            // No hierarchy, so this must be the data object already
            return consoleOutputItem.outputObj;
        }
        
        // Now we have the sequence of property ids, we can walk down the sorted properties 
        // to find the object that the leaf node is representing.
        var valueObject = consoleOutputItem.outputObj;
        for (i = 0; i < propIds.length; i++) {
            valueObject = valueObject.value[valueObject.sortedPropNames[propIds[i]]].propertyValue;
        }
        
        return valueObject;
    },
    
    copyItemToClipboard: function (selectedItem) {
        /// <summary>
        ///     Gets the text of the selected item and copies it to the clipboard
        /// </summary>
        /// <param name="selectedItem" type="Object">
        ///     The consoleItem to copy
        /// </param>
   
        var start = null;
        var end = null;
        var textToCopy = "";
        if (selectedItem.getDisplayClass() === "consoleItemInput") {
            // Get the start element to highlight and set the text
            start = document.getElementById(selectedItem.getHtmlIdentifier());
            textToCopy = selectedItem.getCopyText();
            
            // Check if we have an output item to append
            if (selectedItem.outputItem) {
                textToCopy += "\r\n";
                textToCopy += selectedItem.outputItem.getCopyText();
                end = document.getElementById(selectedItem.outputItem.getHtmlIdentifier());
            }
        } else {
            // Check if we have an input item to prepend
            if (selectedItem.inputItem) {
                start = document.getElementById(selectedItem.inputItem.getHtmlIdentifier());
                end = document.getElementById(selectedItem.getHtmlIdentifier());
                textToCopy = selectedItem.inputItem.getCopyText();
                textToCopy += "\r\n";
            } else {
                start = document.getElementById(selectedItem.getHtmlIdentifier());
                end = null;
            }
            
            // Append the output item text
            textToCopy += selectedItem.getCopyText();
        }
        
        // Highlight and copy
        consoleUtils.highlightElementText(start, end);
        clipboardData.setData("Text", textToCopy);
    },
    
    copySelectionToClipboard: function () {
        /// <summary>
        ///     Copies either the selected text (if any) or the selected row to the clipboard
        /// </summary>
        /// <returns type="Boolean">
        ///     True if some text has been highlighted and copied to the clipboard, False otherwise.
        /// </returns>
        
        var textToCopy;
        var selectedText = document.selection.createRange().text;

        if (selectedText) {
            return toolwindowHelpers.copySelectedTextToClipboard();
        } else if (document.activeElement) {
            
            // No selected text, so find the tree control
            var isDataTree = true;
            var container = $(document.activeElement).closest(".BPT-DataTree-Container");
            if (container.length === 0) {
                container = $(document.activeElement).closest(".BPT-HtmlTree-Container");
                isDataTree = false;
            }
            
            if (container.length === 0) {
                // Still no tree control means it must be plain text
                textToCopy = document.activeElement.innerText;

                // Highlight
                consoleUtils.highlightElementText(document.activeElement);
            } else {
                // Copy the item in the tree
                var treeItem, treeItemHeader;
                if (isDataTree) {
                    // Get the data tree item
                    treeItem = container.children(".BPT-DataTree:first").dataTreeView("getSelected");
                    treeItemHeader = treeItem;
                    
                    // Grab the JSON text
                    var outputItem = consoleCode.getConsoleItemFromId(container.attr("id"));
                    var obj = consoleCode.getActualObjectFromDataTreeLeaf(outputItem, treeItem);
                    textToCopy = consoleCode.encodeValueForCopy(obj.value, obj.detailedType);
                    
                    // Prepend the name to the JSON text
                    textToCopy = treeItem.dataTreeView("getName").text() + ": " + textToCopy;
                } else {
                    // Get the html tree item
                    treeItem = container.children(".BPT-HtmlTree:first").htmlTreeView("getSelected");
                    treeItemHeader = treeItem.children(".BPT-HtmlTreeItem-Header:first");
                    textToCopy = treeItem.children(".BPT-HtmlTreeItem-Header")[0].innerText;
                }
                
                if (treeItemHeader.length === 1) {
                    // Highlight
                    consoleUtils.highlightElementText(treeItemHeader[0]);
                }
            }

            if (textToCopy) {
                clipboardData.setData("Text", textToCopy);
                return true;
            }
        }

        return false;
    },
    
    scrollToBottom: function () {
        /// <summary>
        ///     Scrolls the output list to the bottom
        ///     This is called whenever a new item is added to the list so that we always show the most recent in the window
        /// </summary>

        window.setTimeout(function () {
            var scroller = $(".ScrollContainer");
            scroller.scrollTop(scroller.attr("scrollHeight"));
        }, 0);
    }

};

var ConsoleInputItem = function (inputCommand, callbackFunc) {
    /// <summary>
    ///     Object that represents an input item in the console
    /// </summary>
        
    this.id = consoleCode.inputItems.length;
    this.inputCommand = inputCommand;
    this.callbackFunc = callbackFunc;
    this.outputItem = null;
    
    this.getHtmlIdentifier = function () {
        /// <summary>
        ///     Gets the Html id attribute for this item
        /// </summary>
        /// <returns type="String">
        ///     The unique id attribute for this item in the Html
        /// </returns>    
        return "input" + this.id;
    };
    
    this.getDisplayClass = function () {
        /// <summary>
        ///     Gets the CSS class attribute for this item
        /// </summary>
        /// <returns type="String">
        ///     The CSS class attribute for this item in the Html
        /// </returns>
        return "consoleItemInput";
    };

    this.getDisplayText = function () {
        /// <summary>
        ///     Gets the text for this item as it is displayed in the Html
        /// </summary>
        /// <returns type="String">
        ///     The Html safe encoded display text
        /// </returns>    
        if (!this.displayText) {
            this.displayText = consoleCode.encodeValueForListItem(this.inputCommand, "string");
        }
        return this.displayText;
    };
    
    this.getCopyText = function () {
        /// <summary>
        ///     Gets the text for this item for copying to the clipboard
        /// </summary>
        /// <returns type="String">
        ///     The copyable text
        /// </returns>
        return consoleCode.encodeValueForCopy(this.inputCommand, "string");
    };
    
    this.hasMatchingOutput = function () {
        /// <summary>
        ///     Gets whether this input item has the result of a matching output item
        /// </summary>
        /// <returns type="Boolean">
        ///     True if this input item has a matching output item, False if it does not.
        /// </returns>       
        return (this.outputItem ? true : false);
    };
    
    this.getEvalCommand = function () {
        /// <summary>
        ///     Gets the text that can be used to re-evaluate this input item
        /// </summary>
        /// <returns type="String">
        ///     The console command that will re-evaluate this input item
        /// </returns>        
        if (!this.evalCommand) {
            this.evalCommand = $.trim(this.inputCommand.replace(/[\r\n]/g, " "));
        }
        return this.evalCommand;
    };
};

var ConsoleOutputItem = function (inputId, outputObj) {
    /// <summary>
    ///     Object that represents an output item in the console
    /// </summary>
    
    this.id = consoleCode.outputItems.length;
    this.inputId = inputId;
    this.outputObj = outputObj;
    this.outputClass = outputObj.consoleType;
    this.inputItem = (inputId < 0 ? null : consoleCode.inputItems[inputId]);
    if (this.inputItem) {
        // Give the input this item as a matching output
        this.inputItem.outputItem = this;
    }
    
    // Check for the notification type
    switch (this.outputClass) {
        case consoleUtils.consoleNotifyType.assert:
        case consoleUtils.consoleNotifyType.error:
        case consoleUtils.consoleNotifyType.info:
        case consoleUtils.consoleNotifyType.log:
        case consoleUtils.consoleNotifyType.warn:
            this.isNotification = true;
            if (typeof outputObj.value !== "string") {
                this.notificationInfo = outputObj.value;
                outputObj.value = this.notificationInfo.message;
            }
            break;
            
        default:
            // Not a notification type
            this.isNotification = false;
            break;
    }
    
 
    this.getHtmlIdentifier = function () {
        /// <summary>
        ///     Gets the Html id attribute for this item
        /// </summary>
        /// <returns type="String">
        ///     The unique id attribute for this item in the Html
        /// </returns>
        return "output" + this.id;
    };
    
    this.getDisplayClass = function () {
        /// <summary>
        ///     Gets the CSS class attribute for this item
        /// </summary>
        /// <returns type="String">
        ///     The CSS class attribute for this item in the Html
        /// </returns>    
        return this.outputClass;
    };

    this.getDisplayText = function () {
        /// <summary>
        ///     Gets the text for this item as it is displayed in the Html
        /// </summary>
        /// <returns type="String">
        ///     The Html safe encoded display text
        /// </returns>        
        if (!this.displayText) {
            this.displayText = consoleCode.encodeValueForListItem(this.outputObj.value, this.outputObj.detailedType);
            
            
            if (this.isNotification && this.notificationInfo) {
                // Add extra info to the message
                
                if (this.notificationInfo.messageId) {
                    // Add the help link for this message identifier
                    var messageId = this.notificationInfo.messageId;
                    var startText = this.displayText.substring(0, messageId.length);
                    if (startText === messageId) {
                        var helpLink = "<span class='BPT-HelpLink' data-linkKeyword='" + messageId + "'>" + messageId + "</span>";
                        
                        this.displayText = helpLink + this.displayText.substring(messageId.length);
                    }
                }
                
                if (this.notificationInfo.fileUrl) {
                    // Build up a url we can use in VS
                    var url = consoleUtils.wrapInQuotes(this.notificationInfo.fileUrl);
                    var line = "";
                    var col = "";
                    var useLineAndColumn = false;
                    
                    if (this.notificationInfo.lineNumber !== undefined && (typeof this.notificationInfo.lineNumber === "number")) {
                        if (!this.notificationInfo.columnNumber || (typeof this.notificationInfo.columnNumber !== "number")) {
                            // Since we have a line number and this is a file link, default undefined column to 1 (1 index based from VS UI) 
                            this.notificationInfo.columnNumber = 1;
                        }
                        line = " data-linkLine='" + this.notificationInfo.lineNumber + "'";
                        col = " data-linkCol='" + this.notificationInfo.columnNumber + "'";
                        useLineAndColumn = true;
                    }
                    
                    // Find a short filename to display
                    var shortUrl = toolwindowHelpers.createShortenedUrlText(this.notificationInfo.fileUrl);
                    
                    // Set the link tooltip to be the full url
                    var tooltip = consoleUtils.wrapInQuotes(toolwindowHelpers.htmlEscape(this.notificationInfo.fileUrl));

                    // Load the correct localized string
                    var fileLabel;
                    if (useLineAndColumn) {
                        fileLabel = toolwindowHelpers.htmlEscape(toolwindowHelpers.loadString("EventFullScriptPositionText", [shortUrl, this.notificationInfo.lineNumber, this.notificationInfo.columnNumber]));
                    } else {
                        fileLabel = toolwindowHelpers.htmlEscape(toolwindowHelpers.loadString("ScriptErrorFile", shortUrl));
                    }
                    this.displayText += "<br /><span class='BPT-FileLink' data-linkUrl=" + url + line + col + " title=" + tooltip + ">" + fileLabel + "</span>";
                } else {
                
                    // No file link, so just append the line and/or column
                    var useLine = false;
                    var useColumn = false;
                    if (this.notificationInfo.lineNumber !== undefined && (typeof this.notificationInfo.lineNumber === "number")) {
                        useLine = true;
                        if (this.notificationInfo.columnNumber !== undefined && (typeof this.notificationInfo.columnNumber === "number")) {
                            useColumn = true;
                        }
                    }
                    
                    var lineLabel = null;
                    if (useLine && useColumn) {
                        // Both line and column
                        lineLabel = toolwindowHelpers.htmlEscape(toolwindowHelpers.loadString("EventScriptPositionText", [this.notificationInfo.lineNumber, this.notificationInfo.columnNumber]));
                    } else if (useLine) {
                        // Only line
                        lineLabel = toolwindowHelpers.htmlEscape(toolwindowHelpers.loadString("ScriptErrorLine", this.notificationInfo.lineNumber));
                    }

                    if (lineLabel) {
                        this.displayText += " " + lineLabel;
                    }
                }

            }
            
        }
        return this.displayText;
    };
    
    this.getCopyText = function () {
        /// <summary>
        ///     Gets the text for this item for copying to the clipboard
        /// </summary>
        /// <returns type="String">
        ///     The copyable text
        /// </returns>
        
        if (this.outputClass === "consoleItemOutput") {
            if (this.outputObj.detailedType === "htmlElement") {
                // HtmlElements need to get only their visible text
                var htmlItem = $("li[id='" + this.getHtmlIdentifier() + "'");
                return consoleUtils.getVisibleHtmlElementText(htmlItem[0]);
            } else {
                return consoleCode.encodeValueForCopy(this.outputObj.value, this.outputObj.detailedType);
            }
        } else {
            return consoleCode.encodeValueForCopy(this.outputObj.value, this.outputObj.detailedType);
        }
    };
    
    this.hasMatchingInput = function () {
        /// <summary>
        ///     Gets whether this output item was the result of a matching input command item
        /// </summary>
        /// <returns type="Boolean">
        ///     True if this output item has a matching input item, False if it does not (probably due to being a notification or console.log etc command)
        /// </returns>       
        return (this.inputItem ? true : false);
    };
    
    this.executeCallback = function () {
        /// <summary>
        ///     Executes the callback associated with this output item's input, if it has one
        ///     This essentially fires the onCommandExecuted callback for the input item that caused this eval'd result
        /// </summary>
 
        // Check that we have a callback to execute
        if (this.hasMatchingInput() && this.inputItem.callbackFunc) {
            // Callback with the correct information
            this.inputItem.callbackFunc(this.inputItem.id, this.id, this.getDisplayClass(), this.getDisplayText());
            // We no longer need this callback, so lets just get rid of it
            this.inputItem.callbackFunc = null;
        }
    };
};

function processInput(input, onCompleteCallback) {
    /// <summary>
    ///     Sends a string to the current browser context for evaluation against that script engine.
    ///     Also appends that string onto the console UI as an input item.
    ///     Optionally registers a function to callback on when the evaluation of the input has completed
    ///     and the result returned and appended to the console UI.
    /// </summary>
    /// <param name="input" type="String">
    ///     The javascript string that is to be evaled on the associated script engine
    /// </param>
    /// <param name="onCompleteCallback" type="Function">
    ///     An optional function that will be called when the input has been evaluated and the result
    ///     returned and appended to the console UI.
    ///     The signiture of the function should be:
    ///     completeCallback:function(inputId, outputId, outputClass, displayText);
    ///     inputId - Integer - unique identifier of the input that caused this result
    ///     outputId - Integer - unique identifier of the result
    ///     outputClass - String - the css class of the output type (error, log, etc)
    ///     displayText - String - the actual result as displayed in the console UI
    /// </param>
    /// <returns type="Number">
    ///     The unique inputId associated with this eval if it is successfully sent to the script engine.
    ///     Note - this will match the one returned in the callback
    ///     Or -1 if the input was never sent for evaluation due to an error. In this case the callback will
    ///     never be executed.
    /// </returns>

    // Mark the beginning of the evaluation
    toolwindowHelpers.codeMarker(toolwindowHelpers.codeMarkers.perfBrowserTools_DiagnosticsToolWindowsConsoleEvalBegin);
    return consoleCode.onInput(input, onCompleteCallback);
}

function writeError(messageId, messageText, fileUrl, lineNumber, columnNumber) {
    /// <summary>
    ///     Logs an error message to the console, including an optional link to open
    ///     an associated document
    /// </summary>
    /// <param name="messageId" type="String">
    ///     A message identifier that will become a hyperlink to an external help file
    ///     This parameter can be null or an empty string if no help file is needed
    /// </param> 
    /// <param name="messageText" type="String">
    ///     The error message to log
    /// </param>
    /// <param name="fileUrl" type="String" optional="true">
    ///     An optional document url to link to for this error
    /// </param>
    /// <param name="lineNumber" type="Number" optional="true">
    ///     An optional line number for the document
    /// </param>
    /// <param name="columnNumber" type="Number" optional="true">
    ///     An optional column number for the document
    /// </param> 
    
    // Indices in the VS status bar are one based, so update our UI
    lineNumber += 1;
    columnNumber += 1;
    
    // Prepend any messageId to the message text
    if (messageId) {
        messageText = messageId + ": " + messageText;
    }
    
    var data = {messageId: messageId, message: messageText, fileUrl: fileUrl, lineNumber: lineNumber, columnNumber: columnNumber};
    consoleCode.onConsoleNotification({notifyType: consoleUtils.consoleNotifyType.error, message: data});
}

function toggleFilter(filterIndex, displayAllShouldDefaultToOn) {
    /// <summary>
    ///     Toggles a console output filter on or off
    /// </summary>
    /// <param name="filterIndex" type="Number">
    ///     The filter to toggle
    ///     If the index === -1 then the filter behavior is determined by the optional parameter,
    /// </param>
    /// <param name="displayAllShouldDefaultToOn" type="Boolean" optional="true">
    ///     Optional parameter that specifies what action to take if we are toggling 'all' filters
    ///     If true then all the filters will be turned on (if any are off) or
    ///     all the filters will be turned off (if they are all on)
    ///     If false then all the filters will be turned off (if any are on) or
    ///     all the filters will be turned on (if they are all off)
    /// </param>    
    
    if ((typeof displayAllShouldDefaultToOn) !== "boolean") {
        displayAllShouldDefaultToOn = false;
    }
    
    if (filterIndex === consoleUtils.consoleFilterId.all) {
        // Check how many flags are already on
        var onCount = (consoleCode.notificationFilters.errors ? 1 : 0) + 
                      (consoleCode.notificationFilters.warnings ? 1 : 0) + 
                      (consoleCode.notificationFilters.messages ? 1 : 0) + 
                      (consoleCode.notificationFilters.log ? 1 : 0);
        
        if (onCount === 4) {
            // They are all on, so toggle them off
            $("#errorsButton,#warningsButton,#messagesButton").toggleClass("BPT-ToolbarToggleButton-StateOn", false);
            consoleCode.showingLog = false;
        } else if (onCount > 0) {
            // Some are on, and some are off, so use the default flag
            $("#errorsButton,#warningsButton,#messagesButton").toggleClass("BPT-ToolbarToggleButton-StateOn", displayAllShouldDefaultToOn);
            consoleCode.showingLog = displayAllShouldDefaultToOn;
        } else {
            // They are all off, so toggle them on
            $("#errorsButton,#warningsButton,#messagesButton").toggleClass("BPT-ToolbarToggleButton-StateOn", true);
            consoleCode.showingLog = true;
        }
    } else {
        // Toggle an individual filter
        switch (filterIndex) {
            case consoleUtils.consoleFilterId.error:
                $("#errorsButton").toggleClass("BPT-ToolbarToggleButton-StateOn");
                break;
            case consoleUtils.consoleFilterId.warning:
                $("#warningsButton").toggleClass("BPT-ToolbarToggleButton-StateOn");
                break;
            case consoleUtils.consoleFilterId.message:
                $("#messagesButton").toggleClass("BPT-ToolbarToggleButton-StateOn");
                break;
            case consoleUtils.consoleFilterId.log:
                consoleCode.showingLog = !consoleCode.showingLog;
                break;
                
            default:
                // Not a valid filter index, so ignore
                return;
        }
    }
    
    // Update the UI
    consoleCode.updateNotificationFilters();
}

// Get the external object used for communication between VS and the scripting host
var externalObj;
if (window.parent.getExternalObj) {
    // Hosted in an IFRAME, so get the external object from there
    externalObj = window.parent.getExternalObj();
} else if (window.external) { 
    // Hosted in Dev11
    externalObj = window.external;
}

// Setup the error handling before initialization code has executed
toolwindowHelpers.registerErrorComponent("Console", consoleCode.onError);

// Setup the theme before the window has loaded
window.setTimeout(function () {
    toolwindowHelpers.registerThemeChange(externalObj, ["console.css"]);
}, 0);

window.onload = function () {
    // Setup the console now that the window has loaded
    consoleCode.initialize(externalObj);
};

// SIG // Begin signature block
// SIG // MIIaNgYJKoZIhvcNAQcCoIIaJzCCGiMCAQExCzAJBgUr
// SIG // DgMCGgUAMGcGCisGAQQBgjcCAQSgWTBXMDIGCisGAQQB
// SIG // gjcCAR4wJAIBAQQQEODJBs441BGiowAQS9NQkAIBAAIB
// SIG // AAIBAAIBAAIBADAhMAkGBSsOAwIaBQAEFOK6S/0O2Qlt
// SIG // HZVXUm42R7XTvapQoIIVLTCCBKAwggOIoAMCAQICCmEZ
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
// SIG // VmSsmsysl5gpipeQh+qdtjCCBLowggOioAMCAQICCmEC
// SIG // jkIAAAAAAB8wDQYJKoZIhvcNAQEFBQAwdzELMAkGA1UE
// SIG // BhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNV
// SIG // BAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBD
// SIG // b3Jwb3JhdGlvbjEhMB8GA1UEAxMYTWljcm9zb2Z0IFRp
// SIG // bWUtU3RhbXAgUENBMB4XDTEyMDEwOTIyMjU1OFoXDTEz
// SIG // MDQwOTIyMjU1OFowgbMxCzAJBgNVBAYTAlVTMRMwEQYD
// SIG // VQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25k
// SIG // MR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24x
// SIG // DTALBgNVBAsTBE1PUFIxJzAlBgNVBAsTHm5DaXBoZXIg
// SIG // RFNFIEVTTjpGNTI4LTM3NzctOEE3NjElMCMGA1UEAxMc
// SIG // TWljcm9zb2Z0IFRpbWUtU3RhbXAgU2VydmljZTCCASIw
// SIG // DQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAJbsjkdN
// SIG // VMJclYDXTgs9v5dDw0vjYGcRLwFNDNjRRi8QQN4LpFBS
// SIG // EogLQ3otP+5IbmbHkeYDym7sealqI5vNYp7NaqQ/56ND
// SIG // /2JHobS6RPrfQMGFVH7ooKcsQyObUh8yNfT+mlafjWN3
// SIG // ezCeCjOFchvKSsjMJc3bXREux7CM8Y9DSEcFtXogC+Xz
// SIG // 78G69LPYzTiP+yGqPQpthRfQyueGA8Azg7UlxMxanMTD
// SIG // 2mIlTVMlFGGP+xvg7PdHxoBF5jVTIzZ3yrDdmCs5wHU1
// SIG // D92BTCE9djDFsrBlcylIJ9jC0rCER7t4utV0A97XSxn3
// SIG // U9542ob3YYgmM7RHxqBUiBUrLHUCAwEAAaOCAQkwggEF
// SIG // MB0GA1UdDgQWBBQv6EbIaNNuT7Ig0N6JTvFH7kjB8jAf
// SIG // BgNVHSMEGDAWgBQjNPjZUkZwCu1A+3b7syuwwzWzDzBU
// SIG // BgNVHR8ETTBLMEmgR6BFhkNodHRwOi8vY3JsLm1pY3Jv
// SIG // c29mdC5jb20vcGtpL2NybC9wcm9kdWN0cy9NaWNyb3Nv
// SIG // ZnRUaW1lU3RhbXBQQ0EuY3JsMFgGCCsGAQUFBwEBBEww
// SIG // SjBIBggrBgEFBQcwAoY8aHR0cDovL3d3dy5taWNyb3Nv
// SIG // ZnQuY29tL3BraS9jZXJ0cy9NaWNyb3NvZnRUaW1lU3Rh
// SIG // bXBQQ0EuY3J0MBMGA1UdJQQMMAoGCCsGAQUFBwMIMA0G
// SIG // CSqGSIb3DQEBBQUAA4IBAQBz/30unc2NiCt8feNeFXHp
// SIG // aGLwCLZDVsRcSi1o2PlIEZHzEZyF7BLUVKB1qTihWX91
// SIG // 7sb1NNhUpOLQzHyXq5N1MJcHHQRTLDZ/f/FAHgybgOIS
// SIG // CiA6McAHdWfg+jSc7Ij7VxzlWGIgkEUvXUWpyI6zfHJt
// SIG // ECfFS9hvoqgSs201I2f6LNslLbldsR4F50MoPpwFdnfx
// SIG // Jd4FRxlt3kmFodpKSwhGITWodTZMt7MIqt+3K9m+Kmr9
// SIG // 3zUXzD8Mx90Gz06UJGMgCy4krl9DRBJ6XN0326RFs5E6
// SIG // Eld940fGZtPPnEZW9EwHseAMqtX21Tyi4LXU+Bx+BFUQ
// SIG // axj0kc1Rp5VlMIIFvDCCA6SgAwIBAgIKYTMmGgAAAAAA
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
// SIG // zjEp/w7FW1zYTRuh2Povnj8uVRZryROj/TGCBHUwggRx
// SIG // AgEBMIGHMHkxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpX
// SIG // YXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYD
// SIG // VQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xIzAhBgNV
// SIG // BAMTGk1pY3Jvc29mdCBDb2RlIFNpZ25pbmcgUENBAgph
// SIG // GcyTAAEAAABmMAkGBSsOAwIaBQCggaAwGQYJKoZIhvcN
// SIG // AQkDMQwGCisGAQQBgjcCAQQwHAYKKwYBBAGCNwIBCzEO
// SIG // MAwGCisGAQQBgjcCARUwIwYJKoZIhvcNAQkEMRYEFEt6
// SIG // 156j4D0u3agcgZSeEy0FHCNaMEAGCisGAQQBgjcCAQwx
// SIG // MjAwoBaAFABjAG8AbgBzAG8AbABlAC4AagBzoRaAFGh0
// SIG // dHA6Ly9taWNyb3NvZnQuY29tMA0GCSqGSIb3DQEBAQUA
// SIG // BIIBAAF53rQ2+AANv+QnIUEG7VVusO0rlDIiPmbU+3Zl
// SIG // NBBK0Xa1JAzJ477/qySoEbTjpIUsOWvE+T4b2KKqbIUW
// SIG // xQCgKq+0WyfY08CoHWWwciUqHy6AXwXms+woKqtY1vAR
// SIG // CCplFfVNNpdtFxTLWbjhPufF0r4EKa1pHrWaQG9HMT7s
// SIG // 8hfvihsTmn/m6VbqtCAQ1cVUDSt/N+pntcEGS6WxfHTN
// SIG // D2QqiLBPYXvSCZ/Xkj2X2mP/gY6ePN3yG54WX0NaKSLq
// SIG // LOrNw2DmKPhxnP1WlHWZH7+ME7AV7vQcQxeQKRwD9dB1
// SIG // p9TRRdmylSoWLBCJnT7y3GSEPfje82sryPMBh1KhggIf
// SIG // MIICGwYJKoZIhvcNAQkGMYICDDCCAggCAQEwgYUwdzEL
// SIG // MAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24x
// SIG // EDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jv
// SIG // c29mdCBDb3Jwb3JhdGlvbjEhMB8GA1UEAxMYTWljcm9z
// SIG // b2Z0IFRpbWUtU3RhbXAgUENBAgphAo5CAAAAAAAfMAkG
// SIG // BSsOAwIaBQCgXTAYBgkqhkiG9w0BCQMxCwYJKoZIhvcN
// SIG // AQcBMBwGCSqGSIb3DQEJBTEPFw0xMjA3MjcwMTQ2MjZa
// SIG // MCMGCSqGSIb3DQEJBDEWBBTMmMxs5ufTuHJ/l8AWuRgM
// SIG // 1oTwQDANBgkqhkiG9w0BAQUFAASCAQAhc01ksNuUvPUH
// SIG // dKo3pN9wNrLA0W0QUcqfcGzOH079k61rn6kK+tUw3hmd
// SIG // INn6mpmcd+tzc5evIISWWBtAjto/xrwepH7AlcE6uhgn
// SIG // /hC0yIREFUEs6t8vqBC7JN6J4waPmXC0rWFiXutXTkNf
// SIG // fJHOpgluVqEq3Mi/Pras9K4uSuxdCQACrYOR667+q3KZ
// SIG // Fth56bHoE8nhhH5JhO4OgnXwXNDjAV6DGW/INodYMBe+
// SIG // 5pcZl1fttRkZaSp6qp5Ni6uAsK6pPS/vp2g7lPfhe9BD
// SIG // Pe/+3VSYtl2jAsb6EU1XVleqSUDh+NkbLaQx6e+Hm7tS
// SIG // KoGKUaTq2Q9mkw9f7j/c
// SIG // End signature block
