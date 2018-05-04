/// <reference path="./domexplorer.html" />

// Expected global variables:
/*global $ callProxy clipboardData escape jQuery StyleViews TabPanes DomTree toolwindowHelpers unescape */

var domExplorerCode = {

    // The window.external object that contains functions for communicating to the remote script engine
    externalApis: null,
    
    // The communication port that is talking to the remote script engine
    remotePort: null,
    
    // Queued callbacks waiting to be executed
    callbacks: {},
    
    // The current unique id used for identifying callbacks
    uid: 0,
    
    // A queue of messages waiting to be sent to the remote side for processing
    pendingMessages: [],
    
    // The current timeout used for batching messages to the remote side
    pendingTimeout: null,

    // Max text length of 'inlined' text elements before they need to be expanded to show the text element child
    maxInlineLength: 70,
    
    // The id of the currently selected element in the DomTree
    currentSelectedId: "",
        
    initialize: function (apis) {
        /// <summary>
        ///     Gets the dom explorer window ready for use. 
        ///     Creates the communication channel between VS and the remote side and inserts the remote side code ready for diagnostics
        ///     Also initializes the UI, adding the button styling to the html page
        /// </summary>
        /// <param name="apis" type="Object">
        ///     The window.external object that will be used to set up the communication channel
        ///     Unit tests can send in a mock javascript object to use as a communication harness for testing the console
        /// </param>

        domExplorerCode.externalApis = apis;
        
        if (domExplorerCode.externalApis) {
            // Setup the UI
            toolwindowHelpers.initializeToolWindow(domExplorerCode.externalApis, false, domExplorerCode.onMessage, domExplorerCode.onAttach, domExplorerCode.onDetach, domExplorerCode.onShow, domExplorerCode.onBreak, domExplorerCode.onRun);

            // Setup the tabs and buttons
            domExplorerCode.initializeTabs();
            domExplorerCode.initializeToolbarButtons();
            domExplorerCode.initializeLayoutButtons();
            domExplorerCode.initializeAttributeButtons();
            domExplorerCode.initializeContextMenus();
            domExplorerCode.initializeLinks();
            
            // Localize the controls
            $("#selectElementByClick div").not(".buttonIcon").text(toolwindowHelpers.loadString("SelectElementButton"));
            $("#selectElementByClick").attr("title", toolwindowHelpers.loadString("SelectElementButtonTooltip", "Ctrl + B"));
            
            $("#elementSourceLabel > div > span:first").text(toolwindowHelpers.loadString("ElementSourceLabel"));
            $("#elementSourceLabel > div > span:first").attr("title", toolwindowHelpers.loadString("ElementSourceLabelTooltip"));
            
            $("#refreshButton div").text(toolwindowHelpers.loadString("RefreshDomExplorerButton"));
            $("#refreshButton").attr("title", toolwindowHelpers.loadString("RefreshDomExplorerButtonTooltip"));            
            
            $("#addAttributeButton div").not(".buttonIcon").text(toolwindowHelpers.loadString("AddAttributeButton"));
            $("#addAttributeButton").attr("title", toolwindowHelpers.loadString("AddAttributeButtonTooltip"));
            
            $("#removeAttributeButton div").not(".buttonIcon").text(toolwindowHelpers.loadString("RemoveAttributeButton"));
            $("#removeAttributeButton").attr("title", toolwindowHelpers.loadString("RemoveAttributeButtonTooltip"));
            
            $("#attributeNodeLabel div > span:first").text(toolwindowHelpers.loadString("AttributeNodeLabel"));
            $("#attributeNodeLabel").attr("title", toolwindowHelpers.loadString("AttributeNodeLabelTooltip"));

            $("#stylesTabButton").text(toolwindowHelpers.loadString("StylesTabButtonText"));
            $("#stylesTabButton").attr("title", toolwindowHelpers.loadString("StylesTabButtonTooltip"));

            $("#traceStylesTabButton").text(toolwindowHelpers.loadString("TraceStylesTabButtonText"));
            $("#traceStylesTabButton").attr("title", toolwindowHelpers.loadString("TraceStylesTabButtonTooltip"));

            $("#layoutTabButton").text(toolwindowHelpers.loadString("LayoutTabButtonText"));
            $("#layoutTabButton").attr("title", toolwindowHelpers.loadString("LayoutTabButtonTooltip"));

            $("#attributesTabButton").text(toolwindowHelpers.loadString("AttributesTabButtonText"));
            $("#attributesTabButton").attr("title", toolwindowHelpers.loadString("AttributesTabButtonTooltip"));

            $("#eventsTabButton").text(toolwindowHelpers.loadString("EventsTabButtonText"));
            $("#eventsTabButton").attr("title", toolwindowHelpers.loadString("EventsTabButtonTooltip"));
            
            $(".BPT-HorizontalPane-Right-Tab").hide();
            $("#elementSourceLabel").hide();
            
            // Show any non-fatal errors that occurred before initialization
            if (window.lastScriptError) {
                domExplorerCode.onError(window.lastScriptError.message, window.lastScriptError.file, window.lastScriptError.line, window.lastScriptError.additionalInfo);
            }
        }
    },
    
    onAttach: function () {
        /// <summary>
        ///     The onAttach handler that is called when the diagnostics engine has attached to a process 
        ///     and debugging has started
        /// </summary>

        // Load the remote code into the 'debuggee'
        domExplorerCode.externalApis.loadScriptInProc("../Common/remoteHelpers.js");
        domExplorerCode.externalApis.loadScriptInProc("remote.js");
    },

    onDetach: function () {
        /// <summary>
        ///     The onDetach handler that is called when the diagnostics engine has detached from a process
        ///     and debugging has stopped
        /// </summary>

        // Clear the tree
        $("#tree").children(":first").children().remove();

        // Clear the tab views
        $(".BPT-DataTree-Container").each(function (index, item) {
            $(item).dataTreeView("clear");
        });
        $("#pane-right").hide();
        TabPanes.executeCleanup();
        $("#elementSourceLabel").hide();

        // Clear the layout view
        $(".BPT-Layout-Top,.BPT-Layout-Bottom,.BPT-Layout-Left,.BPT-Layout-Right").find(".BPT-EditContainer > span").text("");
        var sizeChildren = $("#Layout-Size").children();
        sizeChildren.first().find(".BPT-EditContainer > span").text("");
        sizeChildren.last().find(".BPT-EditContainer > span").text("");
        
        // Disable toolbar buttons
        $("#selectElementByClick").removeClass("BPT-ToolbarToggleButton-StateOn");
        $("#selectElementByClick, #refreshButton").addClass("BPT-ToolbarButton-StateDisabled");
    },
    
    onShow: function () {
        /// <summary>
        ///     The onShow handler that is called when the toolwindow has been shown
        /// </summary>
        
        callProxy("getDocumentMode", [], function (docMode) {
            // Fire the code marker (the end marker will fire after the async refresh has happened, and the body node has been expanded)
            toolwindowHelpers.codeMarker(toolwindowHelpers.codeMarkers.perfBrowserTools_DiagnosticsToolWindowsDomExplorerRefreshBegin);
           
            domExplorerCode.populateTree(docMode);
        });
    },

    onBreak: function () {
        /// <summary>
        ///     The onBreak handler that is called when the diagnostics debugging is paused at a breakpoint
        /// </summary>
        
        // Disable select element button
        domExplorerCode.stopSelectElementByClick();
        $("#selectElementByClick").addClass("BPT-ToolbarButton-StateDisabled");        
    },

    onRun: function () {
        /// <summary>
        ///     The onRun handler that is called when the diagnostics debugging has resumed from a breakpoint
        /// </summary>
        
        // Enable select element buttons if we are attached
        if (toolwindowHelpers.remotePort && domExplorerCode.currentDocMode >= 9) {
            $("#selectElementByClick").removeClass("BPT-ToolbarButton-StateDisabled");        
        }
    },
    
    onMessage: function (msg) {
        /// <summary>
        ///     This method is called back when the remote side has posted a message to the dom explorer window
        /// </summary>
        /// <param name="msg" type="String">
        ///     The message string that was sent.
        ///     This function expects the string to be in the form of a JSON stringified object with the following format:
        ///     { type: int, id: "string", data: { object } };
        /// </param>

        if (msg.data === "DocumentNotYetReady") {
            // Request the document information again
            window.setTimeout(function () {
                toolwindowHelpers.remotePort.postMessage("InitializeDocument");
            }, 100);
            
        } else if (msg.data.substr(0, 12) === "RefreshTree:") {
            // Document attach successful
            var docMode = parseFloat(msg.data.substring(12));
            domExplorerCode.populateTree(docMode);
            
            toolwindowHelpers.codeMarker(toolwindowHelpers.codeMarkers.perfBrowserTools_DiagnosticsToolWindowsDomExplorerReady);
        } else {
            callProxy.fireCallbacks(msg.data);
        }
    },
    
    onError: function (message, file, line, additionalInfo) {
        /// <summary>
        ///     Shows a script error message in the dom explorer with information
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
            var errorMessage = toolwindowHelpers.htmlEscape(toolwindowHelpers.loadString("DomExplorerScriptError")) + "<br/>" + 
                               toolwindowHelpers.htmlEscape(toolwindowHelpers.loadString("ScriptErrorMessage", [message])) + "<br/>" + 
                               toolwindowHelpers.htmlEscape(toolwindowHelpers.loadString("ScriptErrorFile", [file])) + "<br/>" + 
                               toolwindowHelpers.htmlEscape(toolwindowHelpers.loadString("ScriptErrorLine", [line])) + "\r\n" +
                               additionalInfo;

            $("#scriptErrorSection").html(errorMessage).show();
   
        } catch (ex) {
            // Fail gracefully if our error handler has an error in it
        }
    },
    
    populateTree: function (docMode) {
        /// <summary>
        ///     Populates the tree view of the DOM or shows the wrong doc mode message if the page is not supported
        /// </summary>
        /// <param name="docMode" type="Number">
        ///     The document mode of the page
        /// </param>
        
        // Remember the doc mode
        domExplorerCode.currentDocMode = docMode;

        // Clear the non-fatal error message
        $("#scriptErrorSection").html("").hide();

        // Clear the tree
        var tree = $("#tree");
        tree.children(":first").children().remove();
        domExplorerCode.currentSelectedId = "";
        
        // Remove any old callbacks since we no longer need them
        toolwindowHelpers.callbacks = {};
        
        // Show the correct tabs and hide the break message
        $(".BPT-HorizontalPane").show();
        $(".BPT-Toolbar").show();
        $("#pane-right").show();
        $("#warningSection").hide();
               
        // Clear the tab views
        $(".BPT-DataTree-Container").each(function (index, item) {
            $(item).dataTreeView("clear");
        });
        TabPanes.clearState();
        TabPanes.executeCleanup();
        $("#elementSourceLabel").hide();

        // Clear the layout view
        $(".BPT-Layout-Top,.BPT-Layout-Bottom,.BPT-Layout-Left,.BPT-Layout-Right").find(".BPT-EditContainer > span").text("");
        var sizeChildren = $("#Layout-Size").children();
        sizeChildren.first().find(".BPT-EditContainer > span").text("");
        sizeChildren.last().find(".BPT-EditContainer > span").text("");

        // Disable toolbar buttons
        $("#selectElementByClick").removeClass("BPT-ToolbarToggleButton-StateOn");
        $("#selectElementByClick, #refreshButton").addClass("BPT-ToolbarButton-StateDisabled");
        domExplorerCode.updateAttributeButtons(false, false);
        
        var warningSection = $("#warningSection");
       
        if (docMode >= 9) {
            warningSection.hide();
            // Enable toolbar buttons
            $("#selectElementByClick").removeClass("BPT-ToolbarToggleButton-StateOn");
            $("#selectElementByClick, #refreshButton").removeClass("BPT-ToolbarButton-StateDisabled");            
            
            // Attach the remote F12 key to show dom explorer and Ctrl+B to start select element by click
            callProxy("setKeyBindCallbacks", [domExplorerCode.onGiveVSFocus, domExplorerCode.startSelectElementByClick, domExplorerCode.stopSelectElementByClick]);
            
            // When the port gets established, retrieve the root object and 
            // start building our tree.
            callProxy("getRootElement", [], function (domObj) {
                if (domObj) {
                    domExplorerCode.createExpandableHtmlTree(tree, domObj);
                }
            });
        } else {
            // Get the localized force doc mode link text
            var linkBeforeText = toolwindowHelpers.loadString("WrongDocumentModeBeforeLink");
            var linkText = toolwindowHelpers.loadString("WrongDocumentModeLink");
            var linkAfterText = toolwindowHelpers.loadString("WrongDocumentModeAfterLink");
        
            // Create the warning
            var htmlWarning = "<div>" + 
                                toolwindowHelpers.htmlEscape(toolwindowHelpers.loadString("WrongDocumentMode")) + 
                                "<br/>" + 
                                toolwindowHelpers.htmlEscape(toolwindowHelpers.loadString("WrongDocumentModeMetaTag")) +
                                "<br />" +
                                "<div><span>" + linkBeforeText + "</span>" + "<span id='forceLatestDocMode' class='BPT-FileLink'>" + linkText + "</span>" + "<span>" + linkAfterText + "</span></div>" + 
                              "</div>";
            warningSection.html(htmlWarning);
            
            // Add the click function
            $("#forceLatestDocMode").click(function () {
                callProxy("forceLatestDocMode", [function () {
                    // Setting new doc mode failed
                    warningSection.text(toolwindowHelpers.loadString("WrongDocumentMode"));
                }]);
            });
            
            warningSection.show();
            
            // We should allow the refresh button on wrong doc modes, so that they can refresh incase the page changes mode
            $("#refreshButton").removeClass("BPT-ToolbarButton-StateDisabled");  
        }
        
        // Re-show the active tab
        if (TabPanes.activeTab) {
            $("#" + TabPanes.activeTab).show();
        }
    },
    
    onGiveVSFocus: function () {
        var vsBridge = domExplorerCode.externalApis.vsBridge;
        
        // Take focus from the simulator if it is able
        if (!vsBridge.bringVSToForegroundFromSimulator()) {
            // We are not running under the simulator, so ask the remote side to allow VS to take focus
            var permissionReady = function (succeeded) {
                if (succeeded) {
                    vsBridge.bringVSToForeground();
                }
            };
            callProxy("allowProcessToTakeForeground", [vsBridge.getVSProcessId()], permissionReady);
        }
    },
    
    initializeTabs: function () {
        /// <summary>
        ///     This function creates the tabs used in the right side pane using the tabItem function
        ///     to initialize and style the tab
        /// </summary>
        
        $("#tree").htmlTreeView();
        $("#pane").horizontalPane();
        $("#stylesView").dataTreeView();
        $("#traceStylesView").dataTreeView();
        $("#attributesView .BPT-DataTree-Container").dataTreeView({initialWidth: 100});
        $("#eventsView").dataTreeView();

        $("#stylesTabButton").tabItem(function () {
            var selected = $("#tree").htmlTreeView("getSelected");
            if (selected.length > 0) {
                TabPanes.showStyles(selected.attr("data-id"), selected.attr("data-tag"));
            } else {
                TabPanes.showStyles();
            }
        });
        $("#traceStylesTabButton").tabItem(function () {
            var selected = $("#tree").htmlTreeView("getSelected");
            if (selected.length > 0) {
                TabPanes.showTraceStyles(selected.attr("data-id"), selected.attr("data-tag"));
            } else {
                TabPanes.showTraceStyles();
            }
        });
        $("#layoutTabButton").tabItem(function () {
            var selected = $("#tree").htmlTreeView("getSelected");
            if (selected.length > 0) {
                TabPanes.showLayout(selected.attr("data-id"), selected.attr("data-tag"));
            } else {
                TabPanes.showLayout();
            }
        });
        $("#attributesTabButton").tabItem(function () {
            var selected = $("#tree").htmlTreeView("getSelected");
            if (selected.length > 0) {
                TabPanes.showAttributes(selected.attr("data-id"), selected.attr("data-tag"));
            } else {
                TabPanes.showAttributes();
            }
        });
        $("#eventsTabButton").tabItem(function () {
            var selected = $("#tree").htmlTreeView("getSelected");
            if (selected.length > 0) {
                TabPanes.showEvents(selected.attr("data-id"), selected.attr("data-tag"));
            } else {
                TabPanes.showEvents();
            }
        });
    },
    
    initializeToolbarButtons: function () {
        /// <summary>
        ///     This function sets up the main toolbar buttons by adding the click and keyboard activation behaviors
        /// </summary>
        
        var pressSelectElementByClickButton = function (isFromClick) {
            // Ensure the button isn't disabled
            var element = $("#selectElementByClick");
            if (!element.hasClass("BPT-ToolbarButton-StateDisabled")) {
                // Check the state of the button (clicking the button will have already toggled the state)
                var isButtonOn = element.hasClass("BPT-ToolbarToggleButton-StateOn");
                if ((isFromClick && !isButtonOn) || (!isFromClick && isButtonOn)) {
                    // Cancel
                    domExplorerCode.stopSelectElementByClick();  
                } else {
                    // Give the remote side application focus
                    callProxy("getBrowserHwnd", [], function (remoteWindowId) {
                        domExplorerCode.externalApis.vsBridge.bringRemoteSideToForeground(remoteWindowId);
                    });
                    
                    // Select element by click
                    domExplorerCode.startSelectElementByClick();      
                }
            }
        };
        
        $("#selectElementByClick").bind("click keydown", function (event) {
            if (event.type === "click" || event.keyCode === 13 || event.keyCode === 32) { // Enter(13) or Space(32)
                pressSelectElementByClickButton(true);
            }
        });
        
        $(document).bind("keydown", function (event) { 
            if (event.keyCode === 66 && event.ctrlKey) { // B (66)
                pressSelectElementByClickButton(false);

                // Stop the key press from propagating
                event.preventDefault();
                event.stopPropagation();
                return false;
            }
        });
    },
    
    initializeLayoutButtons: function () {
        /// <summary>
        ///     This function sets up the layout edit boxes
        /// </summary>
        
        var valueEditHandler = function (event) {
            if (document.activeElement && document.activeElement.type !== "text") {
                if (event.type === "dblclick" || 
                    (event.type === "keydown" && (event.keyCode === 13 || event.keyCode === 32))) { // Enter(13) or Space(32)
                    
                    var valueContext = $(this);
                    var uid = $("#layoutView").attr("data-uid");
                    var tagName = $("#layoutView").attr("data-tag");
                    var prop = valueContext.parent().attr("data-layoutProperty");
                    
                    if (!uid || !tagName || (/^#/).test(tagName)) {
                        // Nothing is selected, so don't allow editing
                        return false;
                    }
                    
                    valueContext.children().editTextbox(
                        function onChange(newValue) {
                            // We need to change the value on the remote side
                            callProxy("setComputedBoxValue", [uid, prop, newValue]);
                        }, 
                        function onClose(newValue, wasCancelled) {
                            var tag = $("#layoutView").attr("data-tag");
                            TabPanes.showLayout(uid, tag);
                        }
                    );

                    if (event.type === "keydown") {
                        // Stop the key press from entering the textbox
                        return false;
                    }
                }
            }
        };
        
        // Add the handlers
        $("#layoutView").find(".BPT-EditContainer").bind("dblclick keydown", valueEditHandler);
    },
    
    initializeAttributeButtons: function () {
        /// <summary>
        ///     This function sets up the add and remove attribute buttons, adding the click behavior
        /// </summary>
        
        // Disable the buttons until something is selected
        $("#addAttributeButton").addClass("BPT-ToolbarButton-StateDisabled");
        $("#removeAttributeButton").addClass("BPT-ToolbarButton-StateDisabled");
        
        var addNewAttribute = function () {
        
            var onValueCreated = function (rootElement) {
                // Add the completed attribute
                var uid = rootElement.closest(".BPT-DataTree-Container").attr("data-uid");
                var name = rootElement.find(".BPT-HTML-Attribute").text();
                var value = rootElement.find(".BPT-HTML-Value").text();
                callProxy("editAttribute", [uid, name, value]);
                
                                
                // Now we have finished the chain, we can remove the temp element
                rootElement.remove();
                rootElement = null;
                
                domExplorerCode.newlyCreatedAttributeInfo = {uid: uid, name: name};
            };
            
            var onNameCreated = function (rootElement) {

                // Get the name that was just created
                var nameNode = rootElement.dataTreeView("getName");
                var attributeNameElement = nameNode.children(":first");
                var nameText = attributeNameElement.text();

                if (nameText.match(/^[0-9]/)) {
                    // Invalid attribute name, so bail out
                    rootElement.remove();
                    return;
                }
                
                var lowerName = nameText.toLowerCase();
                if (nameText !== lowerName) {
                    // Names must be lower case
                    nameText = lowerName;
                    attributeNameElement.text(nameText);
                }
                
                var existingRow = null;
                var currentAttributes = rootElement.parent().find(".BPT-HTML-Attribute");
                for (var i = 0; i < currentAttributes.length; i++) {
                    var element = $(currentAttributes[i]);
                    if (element[0] !== attributeNameElement[0] && element.text().toLowerCase() === nameText) {
                        // Existing row found with this name
                        existingRow = element.closest(".BPT-DataTreeItem");
                        break;
                    }
                }
                 
                if (!existingRow) {
                    // Edit the value textbox
                    domExplorerCode.chainNextEdit(rootElement.find(".BPT-HTML-Value"), rootElement, onValueCreated, true);
                } else {
                    // We found an existing attribute with this name, so just edit that one
                    rootElement.remove();
                    var dataTreeValueNode = existingRow.find(".BPT-DataTreeItem-Value:first");
                    existingRow.click();
                    dataTreeValueNode.dblclick();
                }
            };
            
            // Create the attribute row
            var container = $("#attributesView .BPT-DataTree-Container");
            var nameColumn = "<span class='BPT-HTML-Attribute'></span>";
            var valueColumn = "<span class='BPT-HTML-Value'></span>";
            var attrRow = container.dataTreeView("addSingleItem", "tempNode", nameColumn, valueColumn);
            
            // Select the new row
            attrRow.click();
            container.data("mouseActivate", true);
        
            // Start the edit chain using the property name textbox
            domExplorerCode.chainNextEdit(attrRow.find(".BPT-HTML-Attribute"), attrRow, onNameCreated);
            attrRow = null;
            container = null;
        };
        
        var removeSelectedAttribute = function () {
            // Find the selected attribute in the data tree
            var container = $("#attributesView .BPT-DataTree-Container");
            var row = container.find(".BPT-DataTreeItem-Selected:first");
            if (row.length > 0) {
                // Get the attribute data
                var valueSpan = row.find(".BPT-HTML-Value[data-attrName]");
                if (valueSpan.length > 0) {
                    var uid = container.attr("data-uid");
                    var attrName = valueSpan.attr("data-attrName");

                    // Remove the attribute
                    callProxy("removeAttribute", [uid, attrName]);
                }
                
                if (!domExplorerCode.showingClearAttribute) {
                    row.dataTreeView("removeAndSelect");
                }
            } 
            container = null;            
        };        
        
        $("#addAttributeButton").bind("click keydown", function (event) {
            if (event.type === "click" || event.keyCode === 13 || event.keyCode === 32) { // Enter(13) or Space(32)
                event.preventDefault();
                event.stopImmediatePropagation();
                addNewAttribute();
            }
        });
        
        // Add the button handler to remove the attribute
        $("#removeAttributeButton").bind("click keydown", function (event) {
            if (event.type === "click" || event.keyCode === 13 || event.keyCode === 32) { // Enter(13) or Space(32)
                removeSelectedAttribute();
            }
        });
        
        var container = $("#attributesView .BPT-DataTree-Container");

        // Add a handler to the data tree for pressing delete
        container.bind("keydown", function (event) {
            // Ignore key presses if we are already editing
            if (document.activeElement && document.activeElement.type !== "text") {
                if (event.keyCode === 46 || event.keyCode === 109) { // Delete(46), Minus(109)
                    removeSelectedAttribute();
                } else if (event.keyCode === 107) { // Plus(107)
                    addNewAttribute();
                    
                    // Stop the key from appearing in the textbox
                    return false;
                }
            }
        });
        
        // Add a handler to enable/disable the remove button
        container.bind("itemSelected focus blur", function (event) {
            domExplorerCode.updateAttributeButtons(true);
        });
        
        container = null;
    },
    
    initializeContextMenus: function () {
        /// <summary>
        ///     Sets up the event listeners for context menus on the dom explorer controls
        /// </summary>
        
        var getContextMenuTarget = function (e, isDataTree) {
            var treeClass = (isDataTree ? ".BPT-DataTreeItem" : ".BPT-HtmlTreeItem");
            var selectedItem = null;
            var x = e.clientX;
            var y = e.clientY;
            if (e.clientX <= 0 || e.clientY <= 0) {
                // Keyboard activation
                var treeItem = $(e.currentTarget).find(treeClass + "-Selected:first");
                if (treeItem.length > 0) {
                    selectedItem = treeItem;
                    var offset = treeItem.offset();
                    x = offset.left;
                    y = offset.top;
                }
            } else {
                // Mouse activation
                selectedItem = $(document.elementFromPoint(x, y)).closest(treeClass);
                selectedItem = (selectedItem.length > 0 ? selectedItem : null);
            }

            // Get the tree item ready
            if (selectedItem !== null && selectedItem.length > 0) {
                selectedItem.trigger("click");
            }
            
            return {target: selectedItem, x: x, y: y};
        };

        
        $("#tree").bind("contextmenu", function (e) {
            // Get the target element for this context menu
            var targetInfo = getContextMenuTarget(e, false);
            var selectedItem = targetInfo.target;
            var hasItemSelected = (selectedItem !== null && selectedItem.length > 0);
            var isTextNode = (hasItemSelected && !selectedItem.attr("data-tag"));
            var selectedText = document.selection.createRange().text;
            
            // Set the parameters for the context menu
            var canAddAttribute = (hasItemSelected && !isTextNode);
            var canCopy = (hasItemSelected || selectedText !== "");
            var canCopyInnerHtml = (hasItemSelected && !isTextNode);
            var canCopyOuterHtml = (hasItemSelected && !isTextNode);
            var menuParams = [
                canAddAttribute,
                canCopy,
                canCopyInnerHtml,
                canCopyOuterHtml
            ];

            var callback = function (id, selectedMenuItem) {
                if (id === "menuTreeView") {
                    var uid;
                    switch (selectedMenuItem) {
                        case "menuTreeViewAddAttribute":
                            $("#attributesTabButton").click();
                            $("#addAttributeButton").click();
                            break;
                            
                        case "menuTreeViewCopy":
                            if (selectedText) {
                                toolwindowHelpers.copySelectedTextToClipboard();
                            } else {
                                var textToCopy = selectedItem.children(".BPT-HtmlTreeItem-Header")[0].innerText;
                                clipboardData.setData("Text", textToCopy);
                            }
                            break;

                        case "menuTreeViewCopyInnerHtml":
                            uid = selectedItem.attr("data-id");
                            callProxy("getHTMLString", [uid, true], function (textToCopy) {
                                clipboardData.setData("Text", textToCopy);
                            });
                            break;

                        case "menuTreeViewCopyOuterHtml":
                            uid = selectedItem.attr("data-id");
                            callProxy("getHTMLString", [uid, false], function (textToCopy) {
                                clipboardData.setData("Text", textToCopy);
                            });
                            break;

                        default:
                            // Do nothing
                            break;
                    }
                }
            };
            domExplorerCode.externalApis.vsBridge.showContextMenu("menuTreeView", targetInfo.x, targetInfo.y, callback, menuParams);
            
            return false;
        });

        $("#tree").bind("keydown", function (event) {
            if (event.ctrlKey && event.keyCode === 67) { // C(67)
                var selectedText = document.selection.createRange().text;
                if (!selectedText) {
                    // No text selected, so copy the item instead
                    var treeItem = $("#tree .BPT-HtmlTreeItem-Selected:first");
                    if (treeItem.length > 0) {
                        var textToCopy = treeItem.children(".BPT-HtmlTreeItem-Header")[0].innerText;
                        clipboardData.setData("Text", textToCopy);
                    }
                }
            }
        });
        
        $("#stylesView, #traceStylesView").bind("contextmenu", function (e) {
            // Get the target element for this context menu
            var targetInfo = getContextMenuTarget(e, true);
            var selectedItem = targetInfo.target;
            
            // Find info about the selected item
            var isStylesView = $(e.currentTarget).is("#stylesView");
            var hasSelectedItem = (selectedItem !== null && selectedItem.children(".BPT-DataTreeItem-Header").find(".BPT-HTML-InheritedGroup").length === 0);
            var isSubItem = (selectedItem && selectedItem.children().first().find("span[data-prop]").length > 0);
            var selectedText = document.selection.createRange().text;
            
            // Set the parameters for the context menu
            var canAddRule = isStylesView;
            var canAddProperty = (isStylesView && hasSelectedItem);
            var canRemove = canAddProperty;
            var canCopy = (hasSelectedItem || selectedText !== "");
            var canCopyRule = (hasSelectedItem && (isStylesView ? true : isSubItem));
            var canCopyProperty = (hasSelectedItem && (isStylesView ? isSubItem : !canCopyRule));
            var menuParams = [
                canAddRule,
                canAddProperty,
                canRemove,
                canCopy,
                canCopyRule,
                canCopyProperty
            ];
            
            var textToCopy = "";
            
            var callback = function (id, selectedMenuItem) {
                if (id === "menuStyleCSS") {
                    switch (selectedMenuItem) {
                        case "menuStyleCSSAddRule":
                            domExplorerCode.addCSSRule($(e.currentTarget));
                            break;
                            
                        case "menuStyleCSSAddProperty":
                            var row = (isSubItem ? selectedItem.parent().closest(".BPT-DataTreeItem") : selectedItem);
                            domExplorerCode.addCSSProperty($(e.currentTarget), row);
                            break;
                            
                        case "menuStyleCSSRemove":
                            domExplorerCode.removeCSSStyle(selectedItem, isSubItem);
                            break;

                        case "menuStyleCSSCopy":
                            if (selectedText) {
                                toolwindowHelpers.copySelectedTextToClipboard();
                            } else {
                                if (canCopyProperty) {
                                    textToCopy = domExplorerCode.getCSSPropertyCopyText(selectedItem);
                                } else {
                                    textToCopy = domExplorerCode.getCSSRuleCopyText(selectedItem, isStylesView, isSubItem);
                                }
                                clipboardData.setData("Text", textToCopy);
                            }
                            break;
                             
                        case "menuStyleCSSCopyRule":
                            textToCopy = domExplorerCode.getCSSRuleCopyText(selectedItem, isStylesView, isSubItem);
                            clipboardData.setData("Text", textToCopy);
                            break;

                        case "menuStyleCSSCopyProperty":
                            textToCopy = domExplorerCode.getCSSPropertyCopyText(selectedItem);
                            clipboardData.setData("Text", textToCopy);
                            break;

                        default:
                            // Do nothing
                            break;
                    }
                }
            };
            domExplorerCode.externalApis.vsBridge.showContextMenu("menuStyleCSS", targetInfo.x, targetInfo.y, callback, menuParams);
        });

        $("#stylesView, #traceStylesView").bind("keydown", function (e) {
            if (event.ctrlKey && event.keyCode === 67) { // C(67)
                var selectedText = document.selection.createRange().text;
                if (!selectedText) {
                    // No text selected, so copy the item instead
                    var treeItem = $(e.currentTarget).find(".BPT-DataTreeItem-Selected:first");
                    if (treeItem.length > 0) {
                        var selectedItem = treeItem;

                        // Find info about the selected item
                        var isStylesView = $(e.currentTarget).is("#stylesView");
                        var hasSelectedItem = (selectedItem !== null && selectedItem.children(".BPT-DataTreeItem-Header").find(".BPT-HTML-InheritedGroup").length === 0);
                        var isSubItem = (selectedItem && selectedItem.children().first().find("span[data-prop]").length > 0);
                        
                        var isRule = (hasSelectedItem && (isStylesView ? !isSubItem : isSubItem));
                        var isProperty = (hasSelectedItem && (isStylesView ? isSubItem : !isSubItem));

                        var textToCopy;
                        if (isRule) {
                            textToCopy = domExplorerCode.getCSSRuleCopyText(selectedItem, isStylesView, isSubItem);
                        } else if (isProperty) {
                            textToCopy = domExplorerCode.getCSSPropertyCopyText(selectedItem);
                        }

                        if (textToCopy) {
                            clipboardData.setData("Text", textToCopy);
                        }
                    }
                }
            }
        });
        
        $("#pane-right").bind("contextmenu", function (e) {
            // We should do nothing if the pane is not showing the styles tab, or if the user clicked on the stylesView itself
            if (TabPanes.activeTab !== "stylesView" || $(e.target).closest("#stylesView").length > 0) {
                return;
            }
            
            // Get the target element for this context menu
            var targetInfo = getContextMenuTarget(e, true);
            
            // Find info about the selected item
            var uid, tagName;
            var selected = $("#tree").htmlTreeView("getSelected");
            if (selected.length > 0) {
                uid = selected.attr("data-id");
                tagName = selected.attr("data-tag");
            }
            
            // Set the parameters for the context menu
            var canAddRule = (uid && !(/^#/).test(tagName)); // Ensure that the select element has a uid and no special tag (signified by starting with #) which would prevent adding style rules
            var menuParams = [
                canAddRule,
                false,
                false,
                false,
                false,
                false
            ];
            
            var callback = function (id, selectedMenuItem) {
                if (id === "menuStyleCSS") {
                    switch (selectedMenuItem) {
                        case "menuStyleCSSAddRule":
                            domExplorerCode.addCSSRule($("#stylesView"));
                            break;

                        default:
                            // Do nothing
                            break;
                    }
                }
            };
            domExplorerCode.externalApis.vsBridge.showContextMenu("menuStyleCSS", targetInfo.x, targetInfo.y, callback, menuParams);                
        });
        
        $("#attributesView").bind("contextmenu", function (e) {
            // Get the target element for this context menu
            var targetInfo = getContextMenuTarget(e, true);
            var selectedItem = targetInfo.target;
            var selectedText = document.selection.createRange().text;
            
            // Set the parameters for the context menu
            var canCopy = (selectedText !== "" || selectedItem !== null);
            var menuParams = [
                canCopy
            ];
            
            var textToCopy = "";
            var callback = function (id, selectedMenuItem) {
                if (id === "menuAttributes") {
                    switch (selectedMenuItem) {
                        case "menuAttributesCopy":
                            if (selectedText) {
                                toolwindowHelpers.copySelectedTextToClipboard();
                            } else {
                                textToCopy = domExplorerCode.getAttributeCopyText(selectedItem);
                                clipboardData.setData("Text", textToCopy);
                            }
                            break;

                        default:
                            // Do nothing
                            break;
                    }
                }
            };
            domExplorerCode.externalApis.vsBridge.showContextMenu("menuAttributes", targetInfo.x, targetInfo.y, callback, menuParams);
        });
      
        $("#attributesView").bind("keydown", function (e) {
            if (event.ctrlKey && event.keyCode === 67) { // C(67)
                var container = $("#attributesView .BPT-DataTree-Container");
                var row = container.find(".BPT-DataTreeItem-Selected");
                var textToCopy = domExplorerCode.getAttributeCopyText(row);
                clipboardData.setData("Text", textToCopy);
            }
        });
        
        $("#eventsView").bind("contextmenu", function (e) {
            // Get the target element for this context menu
            var targetInfo = getContextMenuTarget(e, true);
            var selectedItem = targetInfo.target;
            var selectedText = document.selection.createRange().text;
            
            // Set the parameters for the context menu
            var canCopy = (selectedText !== "" || selectedItem !== null);
            var menuParams = [
                canCopy
            ];
            
            var textToCopy = "";
            var callback = function (id, selectedMenuItem) {
                if (id === "menuEvents") {
                    switch (selectedMenuItem) {
                        case "menuEventsCopy":
                            if (selectedText) {
                                toolwindowHelpers.copySelectedTextToClipboard();
                            } else {
                                textToCopy = domExplorerCode.getEventCopyText(selectedItem);
                                clipboardData.setData("Text", textToCopy);
                            }
                            break;

                        default:
                            // Do nothing
                            break;
                    }
                }
            };
            domExplorerCode.externalApis.vsBridge.showContextMenu("menuEvents", targetInfo.x, targetInfo.y, callback, menuParams);
        });
        
        $("#eventsView").bind("keydown", function (e) {
            if (event.ctrlKey && event.keyCode === 67) { // C(67)
                var container = $("#eventsView");
                var row = container.find(".BPT-DataTreeItem-Selected");
                var textToCopy = domExplorerCode.getEventCopyText(row);
                clipboardData.setData("Text", textToCopy);
            }
        });
        
        $(document).bind("copy", function (e) {
            toolwindowHelpers.copySelectedTextToClipboard();
            e.stopImmediatePropagation();
            return false;
        }, true);
    },
    
    initializeLinks: function () {
        /// <summary>
        ///     Sets up the event listeners for file links
        /// </summary>    
        
        $("#stylesView, #traceStylesView").delegate(".BPT-DataTreeItem-FileLink-Right", "click keydown", function (event) {
            // Check for Click, Enter or Space key
            if (event.type === "click" || event.keyCode === 13 || event.keyCode === 32) {
                var element = $(event.target);
                var url = element.attr("data-linkUrl");
                var search = element.attr("data-linkSearch");
                
                // Try to open the file in VS
                try {
                    // IE reports the file url as URI encoded (eg. 'file%20name.html') so we should decode it
                    url = decodeURI(url);
                    toolwindowHelpers.externalApis.openCssDocumentLink(url, search);
                } catch (ex) {
                    // If the file fails to open then we should handle it gracefully
                }
            }
        });

        var openDocumentLinkFromEvent = function (event) {
            // Check for Click, Enter or Space key
            if (event.type === "click" || event.keyCode === 13 || event.keyCode === 32) {
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
            }
        };
        $("#eventsView").delegate(".BPT-DataTreeItem-FileLink-Value", "click keydown", openDocumentLinkFromEvent);
        $("#elementSourceLabelText").delegate(".BPT-FileLink", "click keydown", openDocumentLinkFromEvent);

    },
    
    updateAttributeButtons: function (canAdd, canRemove) {
        /// <summary>
        ///     Updates the state of the add and remove attribute buttons
        /// </summary>
        /// <param name="canAdd" type="Boolean" optional="true">
        ///     Optional paramter that should be True to enable the add button, False to disable it
        ///     If this parameter is not specified, the button state will not be changed
        /// </param>
        /// <param name="canRemove" type="Boolean" optional="true">
        ///     Optional parameter that should be True to enable the remove button or False to disable it
        ///     If this parameter is not specified, the button state will be calculated from the attributes datatree
        /// </param>
        
        var container = $("#attributesView .BPT-DataTree-Container");
        var row = container.find(".BPT-DataTreeItem-Selected");
        
        // If the parameter wasn't passed in, calculate it now
        if (canRemove === undefined) {
            canRemove = (row.length > 0);
        }
        
        // Enable or disable the buttons
        var removeButton = $("#removeAttributeButton");
        if (canRemove) {
            removeButton.removeClass("BPT-ToolbarButton-StateDisabled");
        } else {
            removeButton.addClass("BPT-ToolbarButton-StateDisabled");
        }
        
        if (canAdd !== undefined) {
            if (canAdd) {
                $("#addAttributeButton").removeClass("BPT-ToolbarButton-StateDisabled");
            } else {
                $("#addAttributeButton").addClass("BPT-ToolbarButton-StateDisabled");
            }
        }       

        // Check if we need to change the remove button text
        var shouldShowClear = false;
        var attributeName = row.find("span.BPT-HTML-Attribute").text();
        if (attributeName === "value") {
            switch ($("#attributeNodeLabelText").text()) {
                case ": input":
                case ": form":
                case ": select":
                case ": option":
                case ": textarea":
                    shouldShowClear = true;
                    break;
            }
        }

        // Change the text if required
        if (shouldShowClear && !domExplorerCode.showingClearAttribute) {
            // Show clear message
            removeButton.children("div").text(toolwindowHelpers.loadString("ClearAttributeButton"));
            removeButton.attr("title", toolwindowHelpers.loadString("ClearAttributeButtonTooltip"));
            domExplorerCode.showingClearAttribute = true;
        } else if (!shouldShowClear && domExplorerCode.showingClearAttribute) {
            // Show remove message
            removeButton.children("div").text(toolwindowHelpers.loadString("RemoveAttributeButton"));
            removeButton.attr("title", toolwindowHelpers.loadString("RemoveAttributeButtonTooltip"));
            domExplorerCode.showingClearAttribute = false;
        }
        
        // Set the tab index
        if (container.find(".BPT-DataTreeItem").length > 0) {
            container.attr("tabindex", 1);
        } else {
            container.removeAttr("tabindex");
        }
    },
    
    startSelectElementByClick: function () {
        /// <summary>
        ///     This function begins "select element by click" by communicating with the remote side
        /// </summary>
        
        $("#selectElementByClick").addClass("BPT-ToolbarToggleButton-StateOn");
        
        callProxy("selectElementByClick", [function () {
            $("#selectElementByClick").removeClass("BPT-ToolbarToggleButton-StateOn");
            
            // Set focus back to Visual Studio
            domExplorerCode.onGiveVSFocus();
            
            // Expand the tree
            DomTree.expandToRemoteSelectedElement();
        }]);    
    },    

    stopSelectElementByClick: function () {
        /// <summary>
        ///     This function cancels the "select element by click" by communicating with the remote side
        /// </summary>
        
        callProxy("cancelSelectElementByClick");
        $("#selectElementByClick").removeClass("BPT-ToolbarToggleButton-StateOn");
    },
                    
    chainNextEdit: function (elementToEdit, rootElement, chainedCallback, allowEmptyString) {
        /// <summary>
        ///     Chain a number of textbox edits together
        ///     Edits a textbox and calls the specified callback when the text has been committed,
        ///     Also removes the root element if any of the edits are cancelled
        /// </summary>
        /// <param name="elementToEdit" type="Object">
        ///     The textbox element to edit
        /// </param>
        /// <param name="rootElement" type="Object">
        ///     The root element that will be removed should anything in the chain be cancelled
        /// </param>
        /// <param name="chainedCallback" type="Function">
        ///     The next function to call when this edit has been committed
        /// </param>
        /// <param name="allowEmptyString" type="Boolean" optional="true">
        ///     Optional parameter that specifies if an empty string is allowed in the textbox
        /// </param>
        
        // Edit the next element in the chain
        window.setTimeout(function () {
            elementToEdit.editTextbox(null, function (newText, wasCancelled) {
                if (!wasCancelled && (allowEmptyString || newText)) {
                    // Move to the next part of the chain
                    chainedCallback(rootElement);
                } else {
                    // The chain was cancelled, so remove the root element
                    rootElement.remove();
                }
                rootElement = null;
            });
            elementToEdit = null;
        }, 0);
    },
    
    getCSSPropertyPair: function (element) {
        /// <summary>
        ///     Checks an element's text to see if it contains a css name/value pair
        /// </summary>
        /// <param name="element" type="Object">
        ///     The element to check the text from
        /// </param>
        /// <returns type="Object">
        ///     An array containing the name and value pair, or null if it was not valid
        /// </returns>        
        
        // Ensure the parameter is valid
        if (element) {
            var text = element.text();
            
            // Try to split on a colon (:) which indicates they are using a full property in the name box
            var parts = text.split(":");
            if (parts.length === 2) {
                // Now make sure both parts contain text
                for (var i = 0; i < parts.length; i++) {
                    parts[i] = parts[i].trim();
                    if (parts[i].length === 0) { 
                        // This is not a full property
                        return null;
                    }
                }
                
                var cssPart = parts[1];
                if (cssPart.substring(cssPart.length - 1) === ";") {
                    // Remove a trailing semicolon (;)
                    parts[1] = cssPart.substring(0, cssPart.length - 1);
                }
                
                // Successful property name/value pair
                return parts;
            }
        }
        
        return null;
    },
    
    trimAndRemoveEndingString: function (element, stringToRemove) {
        /// <summary>
        ///     Removes a string from the end of a JQuery element's text if it exists
        /// </summary>
        /// <param name="element" type="Object">
        ///     The element to remove text from
        /// </param>
        /// <param name="stringToRemove" type="String">
        ///     The string to remove
        /// </param>
        
        // Ensure the parameters are valid
        if (element && (typeof stringToRemove === "string")) {
            
            // Get the text and ignore any white space
            var text = element.text().trim();
            if (text && stringToRemove && text.length > stringToRemove.length &&
                text.substring(text.length - stringToRemove.length) === stringToRemove) {
                // Remove the match
                text = text.substring(0, text.length - stringToRemove.length);
                // Set the new trimmed text
                element.text(text.trim());
            }
        }
    },
        
    addCSSRule: function (container) {
        /// <summary>
        ///     Adds a new css rule to the document
        /// </summary>
        /// <param name="container" type="Object">
        ///     The DataTree container that will display the UI for adding the rule
        /// </param>
        
        var onValueCreated = function (rootElement) {
            // Remove a semicolon (;) if it exists
            domExplorerCode.trimAndRemoveEndingString(rootElement.find(".BPT-HTML-CSS-Value"), ";");
            
            // Add the completed rule
            var selector = rootElement.dataTreeView("getName").text();
            var name = rootElement.find(".BPT-HTML-CSS-Name").text();
            var value = rootElement.find(".BPT-HTML-CSS-Value").text();
            callProxy("addCSSRule", [selector, name, value], function (selectorText) {
                // Now we have finished the chain, we can remove the temp element
                rootElement.remove();

                // Refresh the view
                domExplorerCode.refreshCSSView(true, true, (selectorText ? escape(selectorText) : null), name);
            });
        };
        
        var onNameCreated = function (rootElement) {
            var nameBox = rootElement.find(".BPT-HTML-CSS-Name");
            var parts = domExplorerCode.getCSSPropertyPair(nameBox);
            if (parts) {
                // Full property so set it here
                nameBox.text(parts[0]);
                rootElement.find(".BPT-HTML-CSS-Value").text(parts[1]);
                onValueCreated(rootElement);
            } else {
                // Remove a colon (:) if it exists
                domExplorerCode.trimAndRemoveEndingString(nameBox, ":");
                
                // Edit the value textbox
                domExplorerCode.chainNextEdit(rootElement.find(".BPT-HTML-CSS-Value"), rootElement, onValueCreated);
            }
        };
        
        var onRuleCreated = function (rootElement) {
            // Create the property row
            var nameColumn = "<input tabindex='-1' type='checkbox' checked/>" + "<span class='BPT-HTML-CSS-Name'></span>";
            var valueColumn = "<span class='BPT-HTML-CSS-Value' data-prop='' data-uid=''></span>";
            var propertyRow = rootElement.dataTreeView("addSingleItem", "tempNode2", nameColumn, valueColumn);
            
            // Edit the name textbox
            domExplorerCode.chainNextEdit(propertyRow.find(".BPT-HTML-CSS-Name"), rootElement, onNameCreated);
        };
        
        // Get the default rule name
        var defaultRuleName = "";
        var selected = $("#tree").htmlTreeView("getSelected");
        if (selected.length > 0) {
            var header = selected.children(".BPT-HtmlTreeItem-Header");
            
            // Use the id if it has one
            defaultRuleName = header.find(".BPT-HTML-Value[data-attrName='id']").text();
            if (defaultRuleName) {
                // Id
                defaultRuleName = "#" + defaultRuleName;
            } else {
                // No id, use the class 
                defaultRuleName = header.find(".BPT-HTML-Value[data-attrName='class']").text();
                if (defaultRuleName) {
                    // We found a class, make sure to only use the first one
                    defaultRuleName = "." + defaultRuleName.split(" ")[0];
                } else {
                    // No class, use the tag
                    defaultRuleName = selected.attr("data-tag");
                }
            }
        }        
        
        // Create the rule row
        var nameColumn = "<span class='BPT-HTML-CSS-Selector'>" + toolwindowHelpers.htmlEscape(defaultRuleName) + "</span>";
        var valueColumn = "&nbsp;";
        var newRuleNode = container.dataTreeView("addSingleItem", "tempNode", nameColumn, valueColumn);

        // Select the new row
        newRuleNode.click();
        container.data("mouseActivate", true);
        
        // Start the edit chain using the rule selector textbox
        domExplorerCode.chainNextEdit(newRuleNode.find(".BPT-HTML-CSS-Selector"), newRuleNode, onRuleCreated);
        newRuleNode[0].scrollIntoView();
    },
    
    addCSSProperty: function (container, ruleElement) {
        /// <summary>
        ///     Adds a new css property to an existing css rule
        /// </summary>
        /// <param name="container" type="Object">
        ///     The DataTree container that will display the UI for adding the property
        /// </param>
        /// <param name="ruleElement" type="Object">
        ///     The JQuery element that is the rule the property should be added to
        /// </param>
        
        var onValueCreated = function (rootElement) {
            // Remove a semicolon (;) if it exists
            domExplorerCode.trimAndRemoveEndingString(rootElement.find(".BPT-HTML-CSS-Value"), ";");
            
            // Add the completed property
            var uid = ruleElement.find(".BPT-HTML-CSS-Value[data-uid]:first").attr("data-uid");
            var name = rootElement.find(".BPT-HTML-CSS-Name").text();
            var value = rootElement.find(".BPT-HTML-CSS-Value").text();
            var ruleId = ruleElement.closest(".BPT-DataTreeItem").attr("data-id");
           
            callProxy("addCSSProperty", [uid, name, value]);
            
            // Now we have finished the chain, we can remove the temp element
            rootElement.remove();
            
            // Refresh the view
            domExplorerCode.refreshCSSView(true, true, ruleId, name);
        };
        
        var onNameCreated = function (rootElement) {
            var nameBox = rootElement.find(".BPT-HTML-CSS-Name");
            var parts = domExplorerCode.getCSSPropertyPair(nameBox);
            if (parts) {
                // Full property so set it here
                nameBox.text(parts[0]);
                rootElement.find(".BPT-HTML-CSS-Value").text(parts[1]);
                onValueCreated(rootElement);
            } else {
                // Remove a colon (:) if it exists
                domExplorerCode.trimAndRemoveEndingString(nameBox, ":");
                
                // Edit the value textbox
                domExplorerCode.chainNextEdit(rootElement.find(".BPT-HTML-CSS-Value"), rootElement, onValueCreated);
            }
        };
        
        var beginAddNewProperty = function () {
            // Create the property row
            var nameColumn = "<input tabindex='-1' type='checkbox' checked/>" + "<span class='BPT-HTML-CSS-Name'></span>";
            var valueColumn = "<span class='BPT-HTML-CSS-Value' data-prop='' data-uid=''></span>";
            var propertyRow = ruleElement.dataTreeView("addSingleItem", "tempNode", nameColumn, valueColumn);
            
            // Start the edit chain using the property name textbox
            domExplorerCode.chainNextEdit(propertyRow.find(".BPT-HTML-CSS-Name"), propertyRow, onNameCreated);
        };
        
        if (ruleElement.dataTreeView("isExpanded")) {
            // Add the new property directly
            beginAddNewProperty();
        } else {
            // Expand the rule so we have somewhere to display the new property edit box
            ruleElement.dataTreeView("toggle", beginAddNewProperty);
        }
    },
    
    removeCSSStyle: function (cssElement, isProperty) {
        /// <summary>
        ///     Removes a css style from the selected element
        /// </summary>
        /// <param name="cssElement" type="Object">
        ///     The BPT-DataTreeItem element that contains the css property or rule to remove
        /// </param>
        /// <param name="isProperty" type="Boolean">
        ///     True if the cssElement is representing a property, False if it represents a full rule
        /// </param>
        
        // The number of properties to remove before a refresh of the css data
        var refreshCountdown = 1;
        
        var removeProperty = function (row) {
        
            // Get the info for this property
            var valueElement = row.find(".BPT-HTML-CSS-Value[data-uid]:first");
            var uid = valueElement.attr("data-uid");
            var property = valueElement.attr("data-prop");
         
            // Remove the css by setting its value to an empty string
            callProxy("editStyles", [uid, property, ""], function (newStyleValue) {
                // For rules, and properties with no siblings, scroll to the previous rule
                var parentRule = row.parent().closest(".BPT-DataTreeItem");
                var ruleToScroll = parentRule.prev().attr("data-id");
                if (!newStyleValue) {
                    // Check if we need to remove the entire rule
                    var rule = (isProperty ? parentRule : cssElement);
                    var remainingProperties = rule.dataTreeView("getChildren");
                    if (remainingProperties.length === 1) {
                        // Check if we need to remove the rule's group
                        var group = rule.parent().closest(".BPT-DataTreeItem");
                        var remainingRules = group.dataTreeView("getChildren");
                        if (remainingRules.length === 1) {
                            // Remove the group
                            group.remove();
                        } else {
                            // Remove the rule
                            rule.remove();
                        }
                    } else {
                        // For properties with siblings scroll to the parent rule
                        if (isProperty) {
                            ruleToScroll = parentRule.attr("data-id");
                        }
                        // Remove the row
                        row.remove();
                    }
                }
                
                refreshCountdown--;
                if (refreshCountdown <= 0) {
                    // We've finished removing all the properties, so refresh the css
                    domExplorerCode.refreshCSSView(true, true, ruleToScroll);
                }
            });
        };
        
        if (isProperty) {
            // Remove this property directly
            removeProperty(cssElement);
        } else {

            var beginRemoveRule = function () {
                // This is a rule, so remove all the properties inside it
                var allProperties = cssElement.dataTreeView("getChildren");
                
                // Change the number of properties we need to remove
                refreshCountdown = allProperties.length;
                
                for (var i = 0; i < allProperties.length; i++) {
                    removeProperty($(allProperties[i]));
                }            
            };
            
            if (cssElement.dataTreeView("isExpanded")) {
                // Remove the rule directly
                beginRemoveRule();
            } else {
                // Expand the rule first, so we can correctly remove all inner properties
                cssElement.dataTreeView("toggle", beginRemoveRule);
            }
        }

    },
    
    getCSSRuleCopyText: function (selectedItem, isFromStylesView, isSubItem) {
        /// <summary>
        ///     Gets the formatted copy text for a CSS rule
        ///     The rule must be a datatree item from either the styles of trace styles view
        /// </summary>
        /// <param name="selectedItem" type="Object">
        ///     The jquery object to get the copy text for
        /// </param>
        /// <param name="isFromStylesView" type="Boolean">
        ///     True if the jquery object is from the styles view, False if it is from the trace styles view
        /// </param>
        /// <param name="isSubItem" type="Boolean">
        ///     True if the jquery object is a property within the rule we need to copy
        /// </param>        
        /// <returns type="String">
        ///     The formatted copy text
        /// </returns>
        
        var textToCopy, selectorName, propName, propValue = "";
        
        if (isFromStylesView) {
            if (isSubItem) {
                // Since this is a Styles view sub item, we need to find the actual parent collection before we copy
                selectedItem = selectedItem.parent().closest(".BPT-DataTreeItem");
            }
        
            // Get the selector name
            selectorName = domExplorerCode.getCssSelectorText(selectedItem);
            textToCopy = selectorName + " {\r\n";

            // The styles view must append each child property in the collection
            var children = selectedItem.dataTreeView("getChildren");
            for (var i = 0; i < children.length; i++) {
                var property = $(children[i]);
                
                // Ignore disabled properties
                if (!property.hasClass("BPT-Style-Disabled")) {
                    textToCopy += "   " + domExplorerCode.getCSSPropertyCopyText(property) + "\r\n";
                }
            }
            textToCopy += "}";
            
        } else {
            // The trace styles view must use the collection's name as the property
            selectorName = domExplorerCode.getCssSelectorText(selectedItem);
            propName = selectedItem.parent().closest(".BPT-DataTreeItem").dataTreeView("getName").text();
            propValue = selectedItem.dataTreeView("getValue").text();
            
            textToCopy = selectorName + " {\r\n   " + propName + ": " + propValue + ";\r\n}";
        }   

        return textToCopy;        
    },
    
    getCSSPropertyCopyText: function (selectedItem) {
        /// <summary>
        ///     Gets the formatted copy text for a CSS property
        ///     The rule must be a datatree item from either the styles of trace styles view
        /// </summary>
        /// <param name="selectedItem" type="Object">
        ///     The jquery object to get the copy text for
        /// </param>      
        /// <returns type="String">
        ///     The formatted copy text
        /// </returns>
        
        var propName = selectedItem.dataTreeView("getName").text();
        var propValue = selectedItem.dataTreeView("getValue").text();
        return propName + ": " + propValue + ";";
    },
    
    getCssSelectorText: function (dataTreeItem) {
        /// <summary>
        ///     Gets the css selector text form a DataTreeItem
        ///     This function makes sure to ignore any meta information such as the
        ///     .BPT-HTML-CSS-SelectorTag span
        /// </summary>
        /// <param name="dataTreeItem" type="Object">
        ///     The jquery DataTreeItem to get the css selector text from
        /// </param>
        /// <returns type="String">
        ///     The css selector text
        /// </returns>
        
        var findCssText = function (node) {
            var text = "";
            
            if (node.nodeType === 3) { // Text node 
                return node.nodeValue;
            } else {
                for (var i = 0; i < node.childNodes.length; i++) {
                    var child = node.childNodes[i];
                    if (!child.className || (typeof child.className !== "string") || child.className.indexOf("BPT-HTML-CSS-SelectorTag") === -1) {
                        text += findCssText(node.childNodes[i]);
                    }
                }
            }
            
            return text;
        };

        var headerElement = dataTreeItem.dataTreeView("getName").children(".BPT-HTML-CSS-Selector:first");
        if (headerElement.length > 0) {
            return $.trim(findCssText(headerElement[0]));
        }
        return "";
    },
    
    getAttributeCopyText: function (selectedItem) {
        /// <summary>
        ///     Gets the formatted copy text for an attribute
        /// </summary>
        /// <param name="selectedItem" type="Object">
        ///     The jquery object to get the copy text for
        /// </param>      
        /// <returns type="String">
        ///     The formatted copy text
        /// </returns>
        
        if (selectedItem.length === 1) {
            // Copy the selected attribute
            var name = selectedItem.dataTreeView("getName").text();
            var value = selectedItem.dataTreeView("getValue").text();
            
            // Convert it into an html ready paste attribute
            return name + "=\"" + value + "\"";
        }
        
        return "";
    },
    
    getEventCopyText: function (selectedItem) {
        /// <summary>
        ///     Gets the formatted copy text for an event or event sub-item
        /// </summary>
        /// <param name="selectedItem" type="Object">
        ///     The jquery object to get the copy text for
        /// </param>      
        /// <returns type="String">
        ///     The formatted copy text
        /// </returns>
        
        var textToCopy = "";
        if (selectedItem.length === 1) {
            // Get the event row's name
            textToCopy = selectedItem.dataTreeView("getName").text();
            
            // Check if the event has children
            var children = selectedItem.dataTreeView("getChildren");
            if (children.length > 0) {
                // Loop through and add the children
                textToCopy += "\r\n";
                for (var i = 0; i < children.length; i++) {
                    var childRow = $(children[i]);
                    textToCopy += childRow.dataTreeView("getName").text() + " " + childRow.dataTreeView("getValue").text() + "\r\n" + 
                                  childRow.attr("title") + (i < children.length - 2 ? "\r\n\r\n" : "");
                }
            } else {
                // No children, so this must be an event handler row, append the value and tooltip
                textToCopy += " " + selectedItem.dataTreeView("getValue").text() + "\r\n" + selectedItem.attr("title");
            }
        }

        return textToCopy;
    },
       
    createExpandableHtmlTree: function (htmlTree, domObject) {
        /// <summary>
        ///     Creates an item for the tree view that is representing the DOM of the attached document
        /// </summary>
        /// <param name="htmlTree" type="Object">
        ///     The HtmlTreeView object that should be populated
        /// </param>        
        /// <param name="domObject" type="Object">
        ///     The root DOM object to populate the tree with
        /// </param>
        
        
        // Create the root tree item
        htmlTree.children(":first").children().remove();
        var root = htmlTree.htmlTreeView("addRootElement", domObject.uid, domObject.tag, null, DomTree.expandCallback);
        
        // Now auto expand the root node, using the onExpandComplete callback
        var autoOpenCount = 0;
        var autoExpand = function (childGroup) {
            if (autoOpenCount === 0) {
                // Open the html element
                childGroup.children(".BPT-HtmlTreeItem[data-tag='html']").htmlTreeView("toggle", autoExpand);
                autoOpenCount++;
            } else if (autoOpenCount === 1) {
                // Open the body element
                var body = childGroup.children(".BPT-HtmlTreeItem[data-tag='body']");
                if (body.length === 0) {
                    // We haven't loaded the body yet so hook into the DOMContentLoaded event
                    var htmlUid = childGroup.parent().attr("data-id");
                    callProxy("attachDOMContentLoadedEvent", [htmlUid, domExplorerCode.onDOMContentLoaded]);
                } else {
                    body.htmlTreeView("toggle", function () {
                        // Scroll back to the top because this is the first tree population of the DomExplorer
                        window.setTimeout(function () {
                            htmlTree.closest(".BPT-HtmlTree-ScrollContainer")[0].scrollTop = 0;
                        }, 0);
                        
                        // Fire the End code marker
                        toolwindowHelpers.codeMarker(toolwindowHelpers.codeMarkers.perfBrowserTools_DiagnosticsToolWindowsDomExplorerRefreshEnd);
                    });
                }
            }
        };
        root.htmlTreeView("toggle", autoExpand);
        
        // Add the hover effects
        root.bind("mouseover", function (event) {
            if (!toolwindowHelpers.atBreakpoint) {
                var element = $(event.target).closest(".BPT-HtmlTreeItem-Header");
                if (element.length > 0 && !element.parent().hasClass("BPT-HtmlTreeItem-HiddenRoot")) {
                    var uid = element.parent().attr("data-id");
                    callProxy("hoverItem", [uid]);
                }
            }
            event.stopPropagation();
        });
        root.bind("mouseout", function (event) {
            if (!toolwindowHelpers.atBreakpoint) {
                var element = $(event.target).closest(".BPT-HtmlTreeItem-Header");
                if (element.length > 0 && !element.parent().hasClass("BPT-HtmlTreeItem-HiddenRoot")) {
                    var uid = element.parent().attr("data-id");
                    callProxy("hideHoverItem", [uid]);
                }
            }
            event.stopPropagation();
        });
        root = null;
    },
    
    onDOMContentLoaded: function (elementInfo) {
        /// <summary>
        ///     Callback used to show extra nodes that appear due to a DOMContentLoaded event
        /// </summary>
        /// <param name="elementInfo" type="Object">
        ///     An object containing the uid of the parent element and the new children for that element
        /// </param>

        // Find the element and add the children
        if (elementInfo && elementInfo.uid && elementInfo.children) {
            var element = $("#tree").find(".BPT-HtmlTreeItem[data-id='" + elementInfo.uid + "']");
            DomTree.createHtmlTreeItems(element, elementInfo.children);
        }
    },

    encodeTextForHtmlEditing: function (input) {
        /// <summary>
        ///     Encodes raw text into html encoding so that it can be edited.
        ///     Any unicode characters will be encoded into their html hex representation.
        /// </summary>
        /// <param name="input" type="String">
        ///     The text to encode into html
        /// </param>
        /// <returns type="String">
        ///     The encoded html string
        /// </returns>
        
        if (typeof input !== "string") {
            // We only encode strings
            return "";
        }

        // Use the DOM to encode the input text into html escaped text (such as & < > into &amp; &lt; &gt; etc)
        var htmlEscaped = $("<div/>").text(input).html();
        
        // Getting the html from the dom element leaves unicode characters in their un-encoded state, so we need to
        // go through and encode any unicode chars into their &#x0000 equivalent.
        var unicodeHex = "";
        for (var i = 0; i < htmlEscaped.length; i++) {
            var character = htmlEscaped.charAt(i);
            if (character < " " || character > "~") {
                // Numerically encode values that are outside the printable ascii range
                unicodeHex += "&#x" + character.charCodeAt(0).toString(16).toUpperCase() + ";";
            } else {
                unicodeHex += htmlEscaped[i];
            }
        }
        
        return unicodeHex;
    },
    
    decodeTextFromHtmlEditing: function (input) {
        /// <summary>
        ///     Decodes text that contains html encoded elements into its raw form.
        ///     Any non html encoded characters will be unchanged.
        /// </summary>
        /// <param name="input" type="String">
        ///     The text to decode into the raw string
        /// </param>
        /// <returns type="String">
        ///     The decoded string
        /// </returns>
        
        if (typeof input !== "string") {
            // We only decode strings
            return "";
        }
        
        // Before we can get the use the DOM to decode the edited value, we need to make sure that no html
        // elements can be created from the input text, we do this be ensuring < and > are fully encoded.
        var safeValue = input.replace(/\'/g, "&#39;").replace(/\"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    
        // Now that we know no extra html elements can be created, we can use the DOM to get the decoded value
        // (such as &amp; &lt; &gt; &#x0203; to & < > Ë).
        var decoded = $("<div/>").html(safeValue).text();
        
        return decoded;
    },

    refreshCSSView: function (refreshStyles, refreshTrace, ruleId, propertyName) {
        /// <summary>
        ///     Causes either the styles or traceStyles tab to refresh it data if it is the active tab
        /// </summary>
        /// <param name="refreshStyles" type="Boolean">
        ///     True to allow refreshing the styles tab if it is active
        /// </param>
        /// <param name="refreshTrace" type="Boolean">
        ///     True to allow refreshing the trace styles tab if it is active
        /// </param>
        /// <param name="ruleId" type="String" optional="true">
        ///     The data-id of the rule to scroll to
        /// </param>
        /// <param name="propertyName" type="String" optional="true">
        ///     The property name of the style that was added
        /// </param>
        
        var isStylesActive = refreshStyles && $("#stylesTabButton").tabItem("isActive");
        var isTraceActive = refreshTrace && $("#traceStylesTabButton").tabItem("isActive");
        
        if (isStylesActive || isTraceActive) {
            // Refresh the view
            TabPanes.clearState();
            var selected = $("#tree").htmlTreeView("getSelected");
            if (selected.length > 0) {
                var uid = selected.attr("data-id");
                var tag = selected.attr("data-tag");
                if (isStylesActive) {
                    TabPanes.showStyles(uid, tag, ruleId, propertyName);
                } else {
                    TabPanes.showTraceStyles(uid, tag);
                }
            }  
        }
    },
    
    isColorProperty: function (propertyName) {
        /// <summary>
        ///     Gets whether a property name represents a color
        /// </summary>
        /// <param name="propertyName" type="String">
        ///     The name of the property to check
        /// </param>
        /// <returns type="Boolean">
        ///     True if the property name is known to represent a color, False if not
        /// </returns>
        
        switch (propertyName.toLowerCase()) {
            case "background-color":
            case "border-bottom-color":
            case "border-left-color":
            case "border-right-color":
            case "border-top-color":
            case "color":
            case "column-rule-color":
            case "layout-border-bottom-color":
            case "layout-border-left-color":
            case "layout-border-right-color":
            case "layout-border-top-color":
            case "outline-color":
            case "stop-color":
            case "flood-color":
            case "lighting-color":
            case "scrollbar-3dlight-color":
            case "scrollbar-arrow-color":
            case "scrollbar-base-color":
            case "scrollbar-darkshadow-color":
            case "scrollbar-face-color":
            case "scrollbar-highlight-color":
            case "scrollbar-shadow-color":
            case "scrollbar-track-color":
                return true;
        }
        
        return false;
    }
};

window.DomTree = {

    expandToRemoteSelectedElement: function () {
        /// <summary>
        ///     Expands the dom tree to show the current remotely selected element
        /// </summary>
        
        callProxy("getParentChainForSelectedElement", [], function (chain) {
            var elements = [];
            
            // Populate the tree using the chain of parents
            for (var i = 0; i < chain.length; i++) {
                if (chain[i].children) {
                    // Find this element in the tree
                    var element = $("div[data-id=" + chain[i].uid + "]");
                    
                    // Expand it
                    DomTree.createHtmlTreeItems(element, chain[i].children, true);
                    element.removeClass("BPT-HtmlTreeItem-Collapsed").addClass("BPT-HtmlTreeItem-Expanded");
                    
                    elements.push({element: element, children: chain[i].children});
                }
            }
            
            // Now we have finished expanding the tree, add the mutation handlers
            for (var index = 0; index < elements.length; index++) {               
                for (var j = 0; j < elements[index].children.length; j++) { 
                    DomTree.addEventHandlers(elements[index].element, elements[index].children[j]);
                }
            }
            
            // Select the element and perform an immediate refresh of the tab information
            DomTree.immediateTabRefresh = true;
            var selectedElement = $("div[data-id=" + chain.pop().uid + "]");
            selectedElement.click();
            
            // Scroll the new element into view
            toolwindowHelpers.scrollIntoView(selectedElement[0], selectedElement.closest(".BPT-HtmlTree-ScrollContainer")[0]);
        });    
    },

    createHtmlTreeItems: function (parentElement, children, skipHandlers) {
        /// <summary>
        ///     Creates the HtmlTreeView items and adds them to the parent element
        /// </summary>
        /// <param name="parentElement" type="Object">
        ///     The javascript string that is to be HTML escaped
        /// </param>
        /// <param name="children" type="Object">
        ///     The children object to add to the parent element
        /// </param>
        /// <param name="skipHandlers" type="Boolean" optional="true">
        ///     Optional parameter that specifies if we should not add the dom mutation handlers
        /// </param>
        /// <returns type="Object">
        ///     The children group that was created
        /// </returns>
        
        // Generate a map of the existing element id's, so we can remove ones that are no longer here
        var existingIdMap = {};
        var existingElements = parentElement.children(".BPT-HtmlTree-ChildCollection").children();
        for (var elementIndex = 0; elementIndex < existingElements.length; elementIndex++) {
            var uid = $(existingElements[elementIndex]).attr("data-id");
            existingIdMap[uid] = true;
        }
        
        // Initialize each child
        for (var i = 0; i < children.length; i++) {               
            // Format the text
            children[i].text = toolwindowHelpers.formatMultilineString(children[i].text);
            
            // Add event handlers
            if (!skipHandlers) {
                DomTree.addEventHandlers(parentElement, children[i]);
            }
            
            // Remove this uid from the map of existing ones, so we can see which ones are left over and need to be removed
            var id = children[i].uid;
            if (existingIdMap[id]) {
                existingIdMap[id] = false;
            }
        }
        
        // Remove the mapping from any node that has been deleted
        for (var removed in existingIdMap) {
            if (existingIdMap[removed]) {
                callProxy("removeChildMappings", [removed]);
            }
        }
        
        // If we are not adding event handlers, then we should show all child nodes, this also allows selectElementByClick to expand correctly
        if (skipHandlers) {
            parentElement.data("forceShowAll", true);
        }
        
        return parentElement.htmlTreeView("addElements", children, DomTree.expandCallback, DomTree.valueEditCallback, DomTree.selectCallback, true, true);
    },
        
    addEventHandlers: function (parentElement, child) {
        /// <summary>
        ///     Add dom mutation handlers to the child element
        /// </summary>
        /// <param name="parentElement" type="Object">
        ///     The parent element of the child
        /// </param>
        /// <param name="child" type="Object">
        ///     The child to add the dom mutation handlers to
        /// </param>
        
        callProxy("addTreeModifiedEvent", [child.uid, function (obj) {

            var gleamTextChange = function (node) {
                // Highlight the change for a short period of time
                node.addClass("BPT-HTML-Attribute-Changed").delay(1000).queue(function () {
                    var element = $(this);
                    element.removeClass("BPT-HTML-Attribute-Changed");
                    element.dequeue();
                });          
            };
            
            var directParent = parentElement.find(".BPT-HtmlTreeItem[data-id='" + child.uid + "']");
            
            if (directParent.length > 0) {
                if (directParent.htmlTreeView("isExpanded")) {
                    if (obj.children) {
                        // Already expanded, so add the new item into the view
                        DomTree.createHtmlTreeItems(directParent, obj.children);
                    } else {
                        // Was expanded, but now we have no children
                        directParent.htmlTreeView("toggle");
                        directParent.htmlTreeView("changeExpandableState", false);
                    }
                } else if (!directParent.htmlTreeView("isCollapsed")) {
                    // Not expanded and not collapsed either, so update the text
                    var newText = obj.text;
                    if (obj.children && obj.children.length === 1 && !obj.children[0].tag && obj.children[0].text && obj.children[0].text.length < domExplorerCode.maxInlineLength) {
                        // This text is short enough to inline
                        newText = obj.children[0].text;
                        obj.children = null;
                    }
                    
                    // Insert this short text into the node
                    newText = toolwindowHelpers.formatMultilineString(newText);
                    
                    var headerTextElement = directParent.find(".BPT-HTML-Text");
                    if (headerTextElement.length === 1) {
                        headerTextElement.text(newText);
                    } else {
                        headerTextElement = $("<span class='BPT-HTML-Text'></span>").text(newText);
                        directParent.find(".BPT-HtmlTreeItem-Header").children(":first").append(headerTextElement);
                    }
                    gleamTextChange(headerTextElement);
                        
                    // Make this tree item expandable
                    if (obj.children && obj.children.length > 0) {
                        directParent.htmlTreeView("changeExpandableState", true);
                    } else {
                        directParent.htmlTreeView("changeExpandableState", false);
                    }
                }
            }
        }]);

        callProxy("addAttrModifiedEvent", [child.uid, function (obj) {
            
            var gleamAttributeChange = function (attrNode) {
                // Highlight the change for a short period of time
                attrNode.addClass("BPT-HTML-Attribute-Changed").delay(1000).queue(function () {
                    var element = $(this);
                    element.removeClass("BPT-HTML-Attribute-Changed");
                    element.dequeue();
                });           
            };
            
            var directParent = parentElement.find(".BPT-HtmlTreeItem[data-id='" + child.uid + "']");
            
            if (directParent.length > 0) {
                
                var header = directParent.children(".BPT-HtmlTreeItem-Header");
                var editbox = header.find(".BPT-EditBox[data-attrName='" + obj.attrName + "']");
                var attrNode;
                if (obj.attrChange === 3) { 
                    // Attribute removed
                    if (editbox.length > 0) {
                        // We are currently editing the attribute that has been removed
                        editbox.trigger("valueRemoved");
                    } else {    
                        attrNode = header.find(".BPT-HTML-Value[data-attrName='" + obj.attrName + "']").parents(".BPT-HTML-Attribute-Section:first");
                        attrNode.remove();
                    }
                } else { 
                    // Attribute added or changed
                    if (editbox.length > 0) {
                        // We are currently editing the attribute that has changed
                        editbox.trigger("valueChanged", obj.newValue);
                    } else { 
                        attrNode = header.find(".BPT-HTML-Value[data-attrName='" + obj.attrName + "']");
                        if (attrNode.length > 0) {
                            // Attribute changed
                            attrNode.text(obj.newValue);
                            
                             // Gleam the change
                            gleamAttributeChange(attrNode);
                        } else {
                            // Attribute added
                            directParent.htmlTreeView("addAttribute", obj.attrName, toolwindowHelpers.htmlEscape(obj.newValue));
                            
                            // Gleam the change
                            attrNode = header.find(".BPT-HTML-Value[data-attrName='" + obj.attrName + "']");
                            gleamAttributeChange(attrNode);
                        }
                    }
                   
                    if ($("#layoutTabButton").tabItem("isActive")) {
                        // Ensure the update isn't caused by something in the layout view itself
                        if (!document.activeElement || (document.activeElement && !$(document.activeElement).is("#layoutView input"))) {
                            // Update the layout view
                            var focus = document.activeElement;
                            TabPanes.showLayout(child.uid, child.tag);
                            
                            try {
                                focus.setActive();
                            } catch (ex) {
                                // Setting the active element can sometimes cause an 'Incorrect Function' exception in IE9/10,
                                // We should fail gracefully in this situation.
                            }
                        }
                    }
                }
                
                TabPanes.attributeModified(child.uid, child.tag, obj);
            }
            
            toolwindowHelpers.codeMarker(toolwindowHelpers.codeMarkers.perfBrowserTools_DiagnosticsToolWindowsDomExplorerAttributeChanged);
        }]);            
    },
    
    
    valueEditCallback: function (parentElement, editingElement) {
        /// <summary>
        ///     The callback called when an element is edited
        /// </summary>
        /// <param name="parentElement" type="Object">
        ///     The parent element
        /// </param>
        /// <param name="editingElement" type="Object">
        ///     The element that is being edited
        /// </param>
        
        var valueContext = null;
        
        if (editingElement.hasClass("BPT-HTML-Attribute-Section")) {
            // Editing an attribute
            valueContext = editingElement.children(".BPT-HTML-Value");
            var attrName = valueContext.attr("data-attrName");
            valueContext.editTextbox(
                function onChange(newValue, wasCancelled) {
                    if (!wasCancelled) {
                        var uid = parentElement.attr("data-id");
                        
                        // If we are editing the style attribute, we'll need to refresh the tab
                        var refreshStyles = null;
                        if (editingElement.children(".BPT-HTML-Attribute").text() === "style") {
                            refreshStyles = function (succeeded) {
                                if (succeeded) {
                                    // Refresh the css
                                    domExplorerCode.refreshCSSView(true, true);
                                }
                            };
                        }
                        
                        callProxy("editAttribute", [uid, attrName, newValue], refreshStyles);
                    }
                },
                function onClosed(newValue, wasCancelled, wasRemoved) {
                    if (wasCancelled && wasRemoved) {
                        // The attribute was removed while editing
                        valueContext.parents(".BPT-HTML-Attribute-Section:first").remove();
                    }
                },
                [{name: "data-attrName", value: attrName}]
            );
        } else if (editingElement.hasClass("BPT-HTML-Text")){
            // Ensure this is an editable node
            var parentItems = editingElement.parents(".BPT-HtmlTreeItem");
            for (var i = 0; i < parentItems.length && i < 2; i++) {
                var tag = $(parentItems[i]).attr("data-tag");
                if (tag === "script" || tag === "style" || tag === "#comment" || tag === "#doctype") {
                    // We should not allow editing of these nodes
                    return;
                }
            }
            
            // Editing inline text
            valueContext = editingElement;
            valueContext.editTextbox(
                null,
                function onClose(newValue, wasCancelled) {
                    if (!wasCancelled) {
                        var uid = parentElement.attr("data-id");
                        callProxy("editText", [uid, newValue]);
                    }
                },
                true
            );
        }
    },
    
    selectCallback: function (parentElement, id, tag) {
        /// <summary>
        ///     The callback called when an element is selected
        /// </summary>
        /// <param name="parentElement" type="Object">
        ///     The parent element
        /// </param>
        /// <param name="id" type="String">
        ///     The id of the selected element
        /// </param>
        /// <param name="tag" type="String">
        ///     The tag of the selected element
        /// </param>
        
        if (domExplorerCode.currentSelectedId !== id) {
            if (DomTree.tabRefreshTimeout) {
                window.clearTimeout(DomTree.tabRefreshTimeout);
            }
            
            var refreshTab = function () {
                // The selection has changed, so we should refresh the styles
                TabPanes.clearState();
                
                if ($("#stylesTabButton").tabItem("isActive")) {
                    TabPanes.showStyles(id, tag);
                } else if ($("#traceStylesTabButton").tabItem("isActive")) {
                    TabPanes.showTraceStyles(id, tag);
                } else if ($("#layoutTabButton").tabItem("isActive")) {
                    TabPanes.showLayout(id, tag);
                } else if ($("#attributesTabButton").tabItem("isActive")) {
                    TabPanes.showAttributes(id, tag);
                } else if ($("#eventsTabButton").tabItem("isActive")) {
                    TabPanes.showEvents(id, tag);
                }
                
                callProxy("storeElementForConsole", [id]);
                
                callProxy("getSourceLocation", [id], function (url) {
                    // Create a link
                    if (url) {
                        var linkElementText = toolwindowHelpers.createLinkDivText({url: url, line: 1, column: 1}, "BPT-FileLink-Toolbar-Label", true);
                        var linkElement = $(linkElementText).attr("title", toolwindowHelpers.htmlEscape(url));
                        linkElement.attr("tabindex", 1);
                        var text = linkElement.text();
                        if (!text && url) {
                            // Ensure default documents display a forward slash
                            linkElement.text("/");
                        }
                        
                        // Show in the UI
                        $("#elementSourceLabel").show();
                        $("#elementSourceLabelText").empty().append(linkElement);
                    } else {
                        // Nothing to show
                        $("#elementSourceLabel").hide();
                    }
                });
                
                domExplorerCode.currentSelectedId = id;
            };
            
            if (!DomTree.immediateTabRefresh) {
                DomTree.tabRefreshTimeout = window.setTimeout(refreshTab, 100);
            } else {
                refreshTab();
                DomTree.immediateTabRefresh = false;
            }
        }
    },
   
    expandCallback: function (isExpanding, parentElement, id, onExpandComplete) {
        /// <summary>
        ///     The callback called when an element is exapnded
        /// </summary>
        /// <param name="isExpanding" type="Boolean">
        ///     True if the element was being toggled to expansion
        /// </param>        
        /// <param name="parentElement" type="Object">
        ///     The parent element
        /// </param>
        /// <param name="id" type="String">
        ///     The id of the expanding element
        /// </param>
        /// <param name="onExpandComplete" type="Function" optional="true">
        ///     Optional parameter that specifies the callback to trigger when the expansion has completed
        /// </param>
        
        if (isExpanding) {
            callProxy("getChildren", [id], function (children) {
                var childGroup = DomTree.createHtmlTreeItems(parentElement, children);
                
                // Fire the End code marker
                toolwindowHelpers.codeMarker(toolwindowHelpers.codeMarkers.perfBrowserTools_DiagnosticsToolWindowsTreeViewToggleEnd);

                if (onExpandComplete) {
                    onExpandComplete(childGroup);
                }
            });
        } else {
            // Remove any remote mappings
            callProxy("removeChildMappings", [id]);
        }
    }

};

window.StyleViews = {

    cachedStyles: null,
    
    clearState: function () {
        /// <summary>
        ///     Remove the state of the style views because the element has changed
        /// </summary>

        // Forget the styles
        StyleViews.cachedStyles = null;
        
        // Clear the trees
        $("#stylesView, #traceStylesView").each(function (index, item) {
            var container = $(item);
            container.dataTreeView("clear");
            container.unbind("updateStrikethroughs");
        });
    },
    
    getStrikeKey: function (style) {
        /// <summary>
        ///     Generates a unique category key that can be used for strike-through groups
        /// </summary>
        /// <param name="style" type="Object">
        ///     The style object to generate the key for
        /// </param>  
        /// <returns type="String">
        ///     The generated strike key
        /// </returns>
        
        if (style.selector.indexOf("::") >= 0) {
            var pseudoElement = style.selector.match(/::[\w\-]+/);
            if (pseudoElement && pseudoElement.length === 1) {
                return pseudoElement[0] + " " + style.property;
            }
        }
        
        return style.property;
    },
    
    updateView: function (uid, updateTabCallback) {
        /// <summary>
        ///     Fetches new styles from the remote side (if required) and updates the view via the callback parameter
        /// </summary>
        /// <param name="uid" type="String">
        ///     The uid of the Dom Element that the styles should be populated for
        /// </param>        
        /// <param name="updateTabCallback" type="Function">
        ///     The callback used to update the correct style tab
        /// </param>
        
        if (!StyleViews.cachedStyles) {
            // Fetch the new styles
            callProxy("getStyles", [uid], function (allStyles) {
                
                // Process the styles before caching them
                for (var i = 0; i < allStyles.length; i++) {
                    var currentStyle = allStyles[i];
                    
                    // Store the order so we know the precedence of this rule
                    currentStyle.index = i;
                    
                    // Calculate the strike-through group key to ensure pseudo element selectors are taken into account
                    currentStyle.strikeKey = StyleViews.getStrikeKey(currentStyle);
                    
                    // Safely escape the selector
                    currentStyle.selector = escape(currentStyle.selector);
                }
                
                // Cache the styles
                StyleViews.cachedStyles = allStyles;
                
                // Update the tab
                updateTabCallback(StyleViews.cachedStyles);
            });
        } else {
            // Update the tab
            updateTabCallback(StyleViews.cachedStyles);
        }
    }

};

window.TabPanes = {

    activeTab: null,
    scrollPositions: {},
    
    executeCleanup: function () {
        /// <summary>
        ///     Clean up and hide the current tab
        /// </summary>
        
        // Store the scroll position
        TabPanes.storeScrollPosition();
        
        // Hide tabs
        $(".BPT-HorizontalPane-Right-Tab").hide();
        
        if (TabPanes.cleanup) {
            TabPanes.cleanup();
            TabPanes.cleanup = null;
        }
    },
    
    clearState: function () {
        /// <summary>
        ///     Remove the state of the tabs because the element has changed
        /// </summary>
        
        // Forget the previous uid
        $(".BPT-HorizontalPane-Right-Content > .BPT-DataTree-Container").data("previousUid", "");
        
        StyleViews.clearState();
    },
    
    storeScrollPosition: function () {
        /// <summary>
        ///     Store the position of the scrollbar for the active tab so that it can be restored later
        /// </summary>
        
        // Use the attributesView container if it is visible, otherwise use the pane
        var scrollContainer = $("#attributesView");
        if (scrollContainer.is(":hidden")) {
            scrollContainer = $("#pane-right");
        }
        TabPanes.scrollPositions[TabPanes.activeTab] = {left: scrollContainer.scrollLeft(), top: scrollContainer.scrollTop()};
    },
    
    restoreScrollPosition: function () {
        /// <summary>
        ///     Restore the position of the scrollbar for the active tab
        /// </summary>
        
        var scrollPosition = TabPanes.scrollPositions[TabPanes.activeTab];
        if (!scrollPosition) {
            // Default to 0,0
            scrollPosition = {left: 0, top: 0};
            TabPanes.scrollPositions[TabPanes.activeTab] = scrollPosition;
        }
        
        // Use the attributesView container if it is visible, otherwise use the pane
        var scrollContainer = $("#attributesView");
        if (scrollContainer.is(":hidden")) {
            scrollContainer = $("#pane-right");
        }

        scrollContainer.scrollLeft(scrollPosition.left);
        scrollContainer.scrollTop(scrollPosition.top);
    },
       
    // Shows the styles of the current selected DOM Element in the styles pane
    showStyles: function (uid, tagName, ruleId, propertyName) {
        /// <summary>
        ///     Shows the styles tab and populate it with info about the corrisponding dom element
        /// </summary>
        /// <param name="uid" type="String" optional="true">
        ///     The uid of the Dom Element that the styles should be populated for
        /// </param>        
        /// <param name="tagName" type="String" optional="true">
        ///     The tag of the Dom Element that the styles should be populated for
        /// </param>
        /// <param name="ruleId" type="String" optional="true">
        ///     The data-id of the rule to scroll to
        /// </param>
        /// <param name="propertyName" type="String" optional="true">
        ///     The property name of the style that was added
        /// </param>
        
        TabPanes.executeCleanup();
        
        TabPanes.activeTab = "stylesView";
        
        // Clear the view if we have no active element
        var container = $("#stylesView").show();
        if (!uid || (/^#/).test(tagName)) {
            container.dataTreeView("clear");
            return;
        }

        // If the uid hasn't changed, then we don't need to re-grab the styles
        if (container.data("previousUid") === uid) {
            TabPanes.restoreScrollPosition();
            return;
        }
        container.data("previousUid", uid);
        
        // Update the styles pane
        StyleViews.updateView(uid, function (allStyles) {
            
            // Clear the tree ready for the new styles
            container.dataTreeView("clear");
            container.unbind("updateStrikethroughs");

            // Create a collection of styles using the correct groupings
            var styleRows = {};
            var styleGroups = {inherited: {}, declared: {}, inheritedSortedSelectors: [], declaredSortedSelectors: []};
            var i;
            var setScrollRule = true;
            for (i = 0; i < allStyles.length; i++) {
                var currentStyle = allStyles[i];
                
                var styleDeclarationType = (currentStyle.inherited ? styleGroups.inherited : styleGroups.declared);
                var styleSortType = (currentStyle.inherited ? styleGroups.inheritedSortedSelectors : styleGroups.declaredSortedSelectors);     

                // Group by the selector
                var groupId = currentStyle.selector + escape((currentStyle.inherited ? "|" + currentStyle.inherited : "") + (currentStyle.styleHref ? "|" + currentStyle.styleHref : ""));
                if (!styleDeclarationType[groupId]) {
                    styleDeclarationType[groupId] = [];
                    styleSortType.unshift(groupId);
                }
                styleDeclarationType[groupId].push(currentStyle);

                // For new properties and rules set the rule selector for scrolling 
                if (ruleId && propertyName) {
                    // Split the rule id into individual parts 
                    var ruleSelector = null;
                    var ruleInherited = false;
                    var ruleStyleHref = null;
                    var ruleIdParts = ruleId.split("%7C");
                    switch (ruleIdParts.length) {
                        case 1:
                            ruleSelector = ruleIdParts[0];
                            break;
                        case 2:
                            ruleSelector = ruleIdParts[0];
                            ruleStyleHref = unescape(ruleIdParts[1]);
                            break;
                        case 3:
                            ruleSelector = ruleIdParts[0];
                            ruleInherited = unescape(ruleIdParts[1]);
                            ruleStyleHref = unescape(ruleIdParts[2]);
                            break;
                        default:
                            // Do nothing
                            break;
                    }
                    // Compare rule id parts 
                    if (setScrollRule && currentStyle.selector === ruleSelector && currentStyle.property === propertyName && currentStyle.styleHref === ruleStyleHref) {
                        // If the current style and rule both have the same inherited value use this group id 
                        if (currentStyle.inherited === ruleInherited) {
                            setScrollRule = false;
                        }
                        ruleId = groupId;
                    }
                }
                
                // Add this style to a collection of rows we can use for updating 'strikethroughs'
                if (!styleRows[currentStyle.strikeKey]) {
                    styleRows[currentStyle.strikeKey] = [];
                    styleRows[currentStyle.strikeKey].activeUid = null;
                }
                styleRows[currentStyle.strikeKey].push({
                        index: i,
                        uid: currentStyle.uid,
                        style: currentStyle
                    }
                );
            }
           
            // Sort the style rows by precedence
            var sortPropertyFunc = function (a, b) {
                return a.index - b.index;
            };
            
            for (var property in styleRows) {
                styleRows[property] = styleRows[property].sort(sortPropertyFunc);
                
                // Find the first usable style and set it as the active one 
                for (i = 0; i < styleRows[property].length; i++) {
                    var group = styleRows[property];
                    if (group[i].style.enabled) {
                        group.activeUid = group[0].uid;
                        break;
                    }
                }
            }

            // Update the active styles
            var updateStrikethroughs = function (event, newStyle) {
                var group = styleRows[newStyle.strikeKey];
                group.activeUid = null;
                var row;
                for (var i = 0; i < group.length; i++) {
                    row = group[i];
                    
                    // Update all the matching rows to have the same value
                    if (newStyle) {
                        if (row.uid === newStyle.uid) {
                            row.style.value = newStyle.value;
                        }
                    }

                    // Find the active style for this group
                    if (row.style.enabled && !group.activeUid) {
                        group.activeUid = row.uid;
                    }
                }
                
                // Disable all the styles in this property
                var rows = container.find(".BPT-DataTreeItem .BPT-HTML-CSS-Value[data-prop='" + newStyle.strikeKey + "']");
                rows.closest(".BPT-DataTreeItem").addClass("BPT-Style-Disabled");
                
                // Now enable the active one
                var uid = group.activeUid;
                if (uid) {
                    row = rows.filter(".BPT-DataTreeItem .BPT-HTML-CSS-Value[data-uid='" + uid + "']");
                    row.closest(".BPT-DataTreeItem").removeClass("BPT-Style-Disabled");
                }
            };
            container.bind("updateStrikethroughs", updateStrikethroughs);
            
            // Don't auto scroll to the bottom while we are populating the tree
            var stopAutoScroll = true;
            
            // Callback for the expansion of a style group
            var styleGroupExpandCallback = function (isExpanding, parentElement, id, onExpandComplete, stylesInGroup) {
                if (isExpanding) {
                    // Sort the properties if we haven't already
                    if (!stylesInGroup.sortedProps) {
                        stylesInGroup.sortedProps = toolwindowHelpers.getSortedArrayProperties(stylesInGroup, "property");
                    }
                    
                    // Build up the children
                    var items = [];
                    for (var i = 0; i < stylesInGroup.sortedProps.length; i++) {
                        var index = stylesInGroup.sortedProps[i];
                        var style = stylesInGroup[index];
                    
                        // Check for a color thumbnail
                        var colorThumbnail = (domExplorerCode.isColorProperty(style.property) ? "<span class='BPT-ColorThumbnail' style='background-color: " + style.value + "' title='" + style.value + "'></span>" : "");
                        
                        // Add this child to the array of items
                        var nameText = style.property.toLowerCase();
                        var nameColumn = "<input tabindex='-1' type='checkbox' " + (style.enabled ? "checked" : "") + "/>" + "<span class='BPT-HTML-CSS-Name' title='" + nameText + "'>" + nameText + "</span>";
                        var valueColumn = colorThumbnail + "<span class='BPT-HTML-CSS-Value' data-prop='" + style.strikeKey + "' data-uid='" + style.uid + "'>" + style.value + "</span>";
                        items.push({uid: index, name: nameColumn, value: valueColumn, hasChildren: false, blockOpenText: ":", blockCloseText: ";", blockIsInline: true});                    
                    }
                    
                    // Add the new rows to the group
                    var childrenGroup = parentElement.dataTreeView("addItems", items, null, null, null, stopAutoScroll);
                    
                    // Add handlers
                    childrenGroup.children().each(function (index, item) {
                        var element = $(item);
                        var id = element.attr("data-id");
                        var style = stylesInGroup[id];
                        
                        if (styleRows[style.strikeKey].activeUid !== style.uid) {
                            element.addClass("BPT-Style-Disabled");
                        }
                    });

                    // Handler for clicking the checkbox
                    var checkboxHandler = function () {
                        var element = $(this);
                        var id = element.closest(".BPT-DataTreeItem").attr("data-id");
                        var style = stylesInGroup[id];
                        
                        style.enabled = this.checked;
                        callProxy("toggleStyles", [uid, style.uid, style.property, style.enabled]);
                        
                        // Find the style rows with our 'uid' and set the usable property
                        for (var j = 0; j < styleRows[style.strikeKey].length; j++) {
                            var row = styleRows[style.strikeKey][j];
                            if (row.uid === style.uid) {
                                row.style.enabled = style.enabled;
                            }
                        }                       
                        
                        // Uncheck any styles that have the same 'uid'
                        var views = $("#stylesView, #traceStylesView");
                        var items = views.find(".BPT-DataTreeItem .BPT-HTML-CSS-Value[data-uid='" + style.uid + "']").closest(".BPT-DataTreeItem");
                        items.find(".BPT-DataTreeItem-Name input").attr("checked", this.checked);
                        
                        // Now update the strikethroughs for this property
                        views.trigger("updateStrikethroughs", style);
                    };
                    childrenGroup.children().find("input").bind("click", checkboxHandler);

                    // Handler for editing the value by double click
                    var valueDblClickHandler = function () {
                        var element = $(this);
                        var id = element.closest(".BPT-DataTreeItem").attr("data-id");
                        var style = stylesInGroup[id];
                        
                        var valueContext = $(this).children(".BPT-HTML-CSS-Value:first");
                        
                        valueContext.editTextbox(
                            function onChange(newValue) {
                                // We need to change the value on the remote side
                                callProxy("editStyles", [style.uid, style.property, newValue], function (newStyleValue) {
                                    // If the edit succeeds we need to update our local representation
                                    var views = $("#stylesView, #traceStylesView");
                                    var items = views.find(".BPT-DataTreeItem .BPT-HTML-CSS-Value[data-uid='" + style.uid + "']");
                                    
                                    items.text(newStyleValue);
                                    style.value = newStyleValue;
                                    
                                    if (domExplorerCode.isColorProperty(style.property)) {
                                        // We need to update the color thumbnail
                                        var colorThumbnail = items.prev(".BPT-ColorThumbnail");
                                        if (colorThumbnail.length > 0) {
                                            colorThumbnail.css("background-color", newStyleValue);
                                            colorThumbnail.attr("title", newStyleValue);
                                        }
                                    }
                                
                                    // Now update the strikethroughs for this property
                                    views.trigger("updateStrikethroughs", style);
                                });
                            }
                        );
                    };
                    childrenGroup.children().find(".BPT-DataTreeItem-Value").bind("dblclick", valueDblClickHandler);
                    
                    var colorThumbnailClickHandler = function () {
                        // Edit the value
                        var element = $(this);
                        element.closest(".BPT-DataTreeItem-Value").dblclick();
                    };
                    childrenGroup.children().find(".BPT-ColorThumbnail").bind("click", colorThumbnailClickHandler);
                    childrenGroup = null;
                    
                    // Fire the expand complete callback if it exists
                    if (onExpandComplete) {
                        onExpandComplete();
                    }
                    
                    // Fire the End code marker
                    toolwindowHelpers.codeMarker(toolwindowHelpers.codeMarkers.perfBrowserTools_DiagnosticsToolWindowsDataTreeToggleEnd);
                }
                
            };

            // Callback for the expansion of a style group container
            var styleGroupContainerExpandCallback = function (isExpanding, parentElement, id, onExpandComplete, stylesInGroup) {
                if (isExpanding) {
                    var items = [];                    
                    for (var i = 0; i < styleGroups.inheritedSortedSelectors.length; i++) {
                        var styleInGroup = styleGroups.inherited[styleGroups.inheritedSortedSelectors[i]];
                        
                        var safeStyleSelector = toolwindowHelpers.htmlEscape(unescape(styleInGroup[0].selector));
                        var styleSelector = (styleInGroup[0].inlined ? "<span class='BPT-HTML-CSS-InlinedSelector'>" + safeStyleSelector + "</span>" : safeStyleSelector);
                        
                        var nameColumn = "<span class='BPT-HTML-CSS-Selector' title='" + safeStyleSelector + "'> <span class='BPT-HTML-CSS-SelectorTag'>&lt;" + styleInGroup[0].inherited.toLowerCase() + "&gt; </span>" + styleSelector + "</span>";
                        var valueColumn = "&nbsp;";
                        
                        items.push({uid: styleGroups.inheritedSortedSelectors[i], name: nameColumn, value: valueColumn, hasChildren: true, link: {url: styleInGroup[0].styleHref, search: safeStyleSelector}, blockOpenText: "{", blockCloseText: "}"});
                    }
            
                    var newGroup = parentElement.dataTreeView("addItems", items, function (isExpanding, parentElement, id, onExpandComplete) {
                        styleGroupExpandCallback(isExpanding, parentElement, id, onExpandComplete, styleGroups.inherited[id]);
                    });
                    newGroup.children().each(function (index, item) {
                        $(item).dataTreeView("toggle");
                    });
                    
                    // Fire the End code marker
                    toolwindowHelpers.codeMarker(toolwindowHelpers.codeMarkers.perfBrowserTools_DiagnosticsToolWindowsDataTreeToggleEnd);
                }
            };
            
            // Build up the root groups into a data tree
            var items = [];
            
            // First add the inherited styles as their own group container
            var nameColumn, valueColumn;
            if (styleGroups.inheritedSortedSelectors.length > 0) {
                nameColumn = "<span class=\"BPT-HTML-CSS-Selector BPT-HTML-CSS-InlinedSelector BPT-HTML-InheritedGroup\">inherited</span>";
                valueColumn = "&nbsp;";
                
                items.push({uid: "__inheritedGroup", name: nameColumn, value: valueColumn, hasChildren: true});            
            }
            
            // Now add the declared style groups
            for (i = 0; i < styleGroups.declaredSortedSelectors.length; i++) {
                var styleInGroup = styleGroups.declared[styleGroups.declaredSortedSelectors[i]];
                
                var safeStyleSelector = toolwindowHelpers.htmlEscape(unescape(styleInGroup[0].selector));
                        
                nameColumn = "<span class='BPT-HTML-CSS-Selector" + (styleInGroup[0].inlined ? " BPT-HTML-CSS-InlinedSelector" : "") + "' title='" + safeStyleSelector + "'>" + safeStyleSelector + "</span>";
                valueColumn = "&nbsp;";

                items.push({uid: styleGroups.declaredSortedSelectors[i], name: nameColumn, value: valueColumn, hasChildren: true, link: {url: styleInGroup[0].styleHref, search: safeStyleSelector}, blockOpenText: "{", blockCloseText: "}"});
            }

            // Create the tree and start with it expanded
            var newGroup = container.dataTreeView("addItems", items, function (isExpanding, parentElement, id, onExpandComplete) {
                if (id === "__inheritedGroup") {
                    styleGroupContainerExpandCallback(isExpanding, parentElement, id, onExpandComplete, styleGroups.declared[id]);
                } else {
                    styleGroupExpandCallback(isExpanding, parentElement, id, onExpandComplete, styleGroups.declared[id]);
                }
            });
            newGroup.children().each(function (index, item) {
                $(item).dataTreeView("toggle");
            });

            // Update all the strikethroughs on each property
            for (var prop in styleRows) {
                container.trigger("updateStrikethroughs", styleRows[prop][0].style);
            }
            
            // Turn auto scrolling back on now that we have populated the initial tree
            stopAutoScroll = false;

            // Fire the loaded code marker
            toolwindowHelpers.codeMarker(toolwindowHelpers.codeMarkers.perfBrowserTools_DiagnosticsToolWindowsDomExplorerTabChanged);

            // Scroll to and select new element
            if (ruleId) {
                // Set scroll to element to be the last added property of a rule or to the parent (or parent's previous sibling) rule for a deletion
                var scrollToElement = (propertyName ? container.find("[data-id='" + ruleId + "'] [title='" + propertyName + "']:last").closest(".BPT-DataTreeItem") : container.find("[data-id='" + ruleId + "']"));
                var scrollContainer = container.closest(".BPT-DataTree-ScrollContainer");

                if (scrollToElement.length > 0 && scrollContainer.length > 0) {
                    window.setTimeout(function () {
                        toolwindowHelpers.scrollIntoView(scrollToElement[0], scrollContainer[0]);
                        scrollToElement.click();
                    }, 0);
                }
            }
        });
    },    
        
    // Show the trace styles tab
    showTraceStyles: function (uid, tagName) {
        /// <summary>
        ///     Shows the trace styles tab and populate it with info about the corrisponding dom element
        /// </summary>
        /// <param name="uid" type="String" optional="true">
        ///     The uid of the Dom Element that the styles should be populated for
        /// </param>        
        /// <param name="tagName" type="String" optional="true">
        ///     The tag of the Dom Element that the styles should be populated for
        /// </param>
        
        TabPanes.executeCleanup();
        
        TabPanes.activeTab = "traceStylesView";
        
        // Clear the view if we have no active element
        var container = $("#traceStylesView").show();
        if (!uid || (/^#/).test(tagName)) {
            container.dataTreeView("clear");
            return;
        }

        // If the uid hasn't changed, then we don't need to re-grab the styles
        if (container.data("previousUid") === uid) {
            TabPanes.restoreScrollPosition();
            return;
        }
        container.data("previousUid", uid);
        
        // Update the trace styles pane
        StyleViews.updateView(uid, function (allStyles) {
            
            // Clear the tree ready for the new styles
            container.dataTreeView("clear");
            container.unbind("updateStrikethroughs");
            
            // Create a collection of styles using the correct groupings
            var styleGroups = {};
            for (var i = 0; i < allStyles.length; i++) {
                var currentStyle = allStyles[i];
                
                if (!styleGroups[currentStyle.strikeKey]) {
                    styleGroups[currentStyle.strikeKey] = [];
                    styleGroups[currentStyle.strikeKey].activeUid = currentStyle.uid;
                }
                styleGroups[currentStyle.strikeKey].unshift(currentStyle);
            }
       
            // Update the active styles
            var updateStrikethroughs = function (event, newStyle) {
                var group = styleGroups[newStyle.strikeKey];
                var activeValue = "";
                group.activeUid = null;
                for (var i = group.length - 1; i >= 0; i--) {

                    // Update all the matching rows to have the same value
                    if (newStyle) {
                        if (group[i].uid === newStyle.uid) {
                            group[i].value = newStyle.value;
                        }
                    }
                    
                    // Find the active style for this group
                    if (group[i].enabled && !group.activeUid) {
                        group.activeUid = group[i].uid;
                        activeValue = group[i].value;
                    }
                }
                
                // Disable all the styles in this property
                var values = container.find(".BPT-DataTreeItem .BPT-HTML-CSS-Value[data-prop='" + newStyle.strikeKey + "']");
                var rows = values.closest(".BPT-DataTreeItem");
                rows.slice(1).addClass("BPT-Style-Disabled");

                // Now enable the active one
                var uid = group.activeUid;
                if (uid) {
                    var row = rows.find(".BPT-HTML-CSS-Value[data-uid='" + uid + "']");
                    row.closest(".BPT-DataTreeItem").removeClass("BPT-Style-Disabled");
                }

                // Update the group header value to the active one
                var headerValue = rows.first().find(".BPT-DataTreeItem-Value:first .BPT-HTML-CSS-Value");
                headerValue.text(activeValue);
                
                if (domExplorerCode.isColorProperty(newStyle.strikeKey)) {
                    // We need to update the color thumbnail
                    var colorThumbnail = headerValue.prev(".BPT-ColorThumbnail:first");
                    if (colorThumbnail.length > 0) {
                        colorThumbnail.css("background-color", activeValue);
                        colorThumbnail.attr("title", activeValue);
                    }
                }
            };
            container.bind("updateStrikethroughs", updateStrikethroughs);
            
            // Don't auto scroll to the bottom while we are populating the tree
            var stopAutoScroll = true;
            
            // Callback for the expansion of the group
            var expandCallback = function (isExpanding, parentElement, id, onExpandComplete, stylesInGroup) {
                if (isExpanding) {
                    
                    // Build up the children
                    var items = [];
                    for (var i = 0; i < stylesInGroup.length; i++) {
                        var style = stylesInGroup[i];
                    
                        var safeStyleSelector = toolwindowHelpers.htmlEscape(unescape(style.selector));
                        var styleSelector = (style.inlined ? "<span class='BPT-HTML-CSS-InlinedSelector'>" + safeStyleSelector + "</span>" : safeStyleSelector);
                        var styleName = (style.inherited ? "<span class='BPT-HTML-CSS-SelectorTag'>&lt;" + style.inherited.toLowerCase() + "&gt; </span>" + styleSelector : styleSelector);
                    
                        // Check for a color thumbnail
                        var colorThumbnail = (domExplorerCode.isColorProperty(style.property) ? "<span class='BPT-ColorThumbnail' style='background-color: " + style.value + "' title='" + style.value + "'></span>" : "");
                        
                        // Add this child to the array of items
                        var nameColumn = "<input tabindex='-1' type='checkbox'" + (style.enabled ? "checked" : "") + "/>" + "<span class='BPT-HTML-CSS-Selector' title='" + safeStyleSelector + "'>" + styleName + "</span>";
                        var valueColumn = colorThumbnail + "<span class='BPT-HTML-CSS-Value' data-prop='" + style.strikeKey + "' data-uid='" + style.uid + "'>" + style.value + "</span>";
                        items.push({uid: i, name: nameColumn, value: valueColumn, hasChildren: false, link: {url: style.styleHref, search: safeStyleSelector}});
                    }
                    
                    // Add the new rows to the group
                    var childrenGroup = parentElement.dataTreeView("addItems", items, null, null, null, stopAutoScroll);
            
                    // Add handlers
                    childrenGroup.children().each(function (index, item) {
                        var element = $(item);
                        var id = element.attr("data-id");
                        var style = stylesInGroup[id];
                        
                        if (styleGroups[style.strikeKey].activeUid !== style.uid) {
                            element.addClass("BPT-Style-Disabled");
                        }
                    });
                    
                    // Handler for clicking the checkbox
                    var checkboxHandler = function () {
                        var element = $(this);
                        var id = parseInt(element.closest(".BPT-DataTreeItem").attr("data-id"), 10);
                        var style = stylesInGroup[id];
                        
                        style.enabled = this.checked;
                        callProxy("toggleStyles", [uid, style.uid, style.property, style.enabled]);
            
                        // Find the styles with our 'uid' and set the enabled property
                        for (var j = 0; j < stylesInGroup.length; j++) {
                            if (j !== id) {
                                if (stylesInGroup[j].uid === style.uid) {
                                    stylesInGroup[j].enabled = style.enabled;
                                }
                            }
                        }
                        
                        // Uncheck any styles that have the same 'uid'
                        var views = $("#traceStylesView, #stylesView");
                        var items = views.find(".BPT-DataTreeItem .BPT-HTML-CSS-Value[data-uid='" + style.uid + "']").closest(".BPT-DataTreeItem");
                        items.find(".BPT-DataTreeItem-Name input").attr("checked", this.checked);
                        
                        // Now update the strikethroughs for this property
                        views.trigger("updateStrikethroughs", style);
                    };
                    childrenGroup.children().find("input").bind("click", checkboxHandler);
            
                    // Handler for editing the value by double click
                    var valueDblClickHandler = function () {
                        var element = $(this);
                        var id = element.closest(".BPT-DataTreeItem").attr("data-id");
                        var style = stylesInGroup[id];
                        
                        var valueContext = $(this).children(".BPT-HTML-CSS-Value:first");
                        
                        valueContext.editTextbox(
                            function onChange(newValue) {
                                // We need to change the value on the remote side
                                callProxy("editStyles", [style.uid, style.property, newValue], function (newStyleValue) {
                                    // If the edit succeeds we need to update our local representation
                                    var views = $("#traceStylesView, #stylesView");                                    
                                    var items = views.find(".BPT-DataTreeItem .BPT-HTML-CSS-Value[data-uid='" + style.uid + "']");
                                    
                                    items.text(newStyleValue);
                                    style.value = newStyleValue;
                                    
                                    if (domExplorerCode.isColorProperty(style.property)) {
                                        // We need to update the color thumbnail
                                        var colorThumbnail = items.prev(".BPT-ColorThumbnail");
                                        if (colorThumbnail.length > 0) {
                                            colorThumbnail.css("background-color", newStyleValue);
                                            colorThumbnail.attr("title", newStyleValue);
                                        }
                                    }                                    
                                
                                    // Now update the strikethroughs for this property
                                    views.trigger("updateStrikethroughs", style);
                                });
                            }
                        );
                    };
                    childrenGroup.children().find(".BPT-DataTreeItem-Value").bind("dblclick", valueDblClickHandler);
                    
                    var colorThumbnailClickHandler = function () {
                        // Edit the value
                        var element = $(this);
                        element.closest(".BPT-DataTreeItem-Value").dblclick();
                    };
                    childrenGroup.children().find(".BPT-ColorThumbnail").bind("click", colorThumbnailClickHandler);
                    childrenGroup = null;
                    
                    // Fire the End code marker
                    toolwindowHelpers.codeMarker(toolwindowHelpers.codeMarkers.perfBrowserTools_DiagnosticsToolWindowsDataTreeToggleEnd);
                }
            };

            // Build up the root groups into a data tree
            var items = [];
            var sortedPropNames = toolwindowHelpers.getSortedObjectProperties(styleGroups);
            for (i = 0; i < sortedPropNames.length; i++) {
                var property = sortedPropNames[i];
                
                // Find the active value
                var stylesInGroup = styleGroups[property];
                var activeValue = "";
                for (var j = 0; j < stylesInGroup.length; j++) {
                    if (stylesInGroup[j].enabled) {
                        activeValue = stylesInGroup[j].value;
                        break;
                    }
                }
                
                // Check for a color thumbnail
                var colorThumbnail = (domExplorerCode.isColorProperty(property) ? "<span class='BPT-ColorThumbnail' style='background-color: " + activeValue + "' title='" + activeValue + "'></span>" : "");                
                
                var nameColumn = "<span class='BPT-HTML-CSS-Name' title='" + property + "'>" + property + "</span>";
                var valueColumn = colorThumbnail + "<span class='BPT-HTML-CSS-Value' data-prop='" + property + "'>" + activeValue + "</span>";
                
                items.push({uid: property, name: nameColumn, value: valueColumn, hasChildren: true});
            }

            // Create the group and start with it collapsed
            container.dataTreeView("addItems", items, function (isExpanding, parentElement, id, onExpandComplete) {
                expandCallback(isExpanding, parentElement, id, onExpandComplete, styleGroups[id]);
            });
            
            // Update all the strikethroughs on each property
            for (var prop in styleGroups) {
                container.trigger("updateStrikethroughs", styleGroups[prop][0]);
            }            

            var previousUid = container.data("previousUid");
            var previouslyExpandedStyles = container.data("previouslyExpandedStyles");
            if (previousUid && previouslyExpandedStyles) {
                // If we previously had this item activated, toggle them on.
                if (previousUid === uid) {
                    var children = container.dataTreeView("getChildren");

                    for (var childIndex = 0; childIndex < children.length; childIndex++) {
                        var jQueryChild = $(children[childIndex]);
                        var childName = jQueryChild.dataTreeView("getName");

                        if (previouslyExpandedStyles[childName.text()]) {
                            jQueryChild.dataTreeView("toggle");
                        }
                    }
                }
            }
            
            // Turn auto scrolling back on now that we have populated the initial tree
            stopAutoScroll = false;

            // Fire the loaded code marker
            toolwindowHelpers.codeMarker(toolwindowHelpers.codeMarkers.perfBrowserTools_DiagnosticsToolWindowsDomExplorerTabChanged);
        });
    },
    
    showLayout: function (uid, tagName) {
        /// <summary>
        ///     Shows the layout tab and populate it with info about the corrisponding dom element
        /// </summary>
        /// <param name="uid" type="String" optional="true">
        ///     The uid of the Dom Element that the layout should be populated for
        /// </param>        
        /// <param name="tagName" type="String" optional="true">
        ///     The tag of the Dom Element that the layout should be populated for
        /// </param>   
        
        TabPanes.executeCleanup();
        
        TabPanes.activeTab = "layoutView";
        
        // Hide the tree view and show the layout view.
        $("#layoutView").show();
        TabPanes.restoreScrollPosition();

        // When this tab closes we want the layout view to be hidden.
        TabPanes.cleanup = function () {
            $("#layoutView").attr("data-uid", "");
            $("#layoutView").attr("data-tag", "");
        };
        
        // If we are showing the tab without an element
        if (!uid || !tagName || (/^#/).test(tagName)) {
            // Clear the layout view
            $(".BPT-Layout-Top,.BPT-Layout-Bottom,.BPT-Layout-Left,.BPT-Layout-Right").find(".BPT-EditContainer > span").text("");
            var sizeChildren = $("#Layout-Size").children();
            sizeChildren.first().find(".BPT-EditContainer > span").text("");
            sizeChildren.last().find(".BPT-EditContainer > span").text("");
            
            // Remove the tab stops
            $("#layoutView").find(".BPT-EditContainer").attr("tabindex", -1);
            
            return;
        } else {
            // Add the tab stops
            $("#layoutView").find(".BPT-EditContainer:not(.BPT-NoTabStop)").attr("tabindex", 1);
        }
        
        var gleamRequired = false;
        if (uid === $("#layoutView").attr("data-uid")) {
            // The 'uid' is the same as last time, so any new values should be highlighted
            gleamRequired = true;
        }
        
        $("#layoutView").attr("data-uid", uid);
        $("#layoutView").attr("data-tag", tagName);
        
        var gleamLayoutChange = function (node) {
            // Highlight the change for a short period of time
            node.addClass("BPT-HTML-Attribute-Changed");
            window.setTimeout(function () {
                node.removeClass("BPT-HTML-Attribute-Changed");
            }, 1000);            
        };
        
        callProxy("getComputedBox", [uid], function (obj) {
            if (obj) {
                
                // Update the view of the top, left, right, and bottom properties
                $(".BPT-Layout-Top, .BPT-Layout-Left, .BPT-Layout-Right, .BPT-Layout-Bottom").each(function (index) {
                    var element = $(this);
                    var prop = element.attr("data-layoutProperty");
                    if (prop) {
                        var item = element.find(".BPT-EditContainer > span");
                        if (gleamRequired && item.text() !== obj[prop] + "") {
                            gleamLayoutChange(item);
                        }
                        item.text(obj[prop]);
                    }
                });
                
                $(".BPT-Layout-Left").each(function (index) {
                    var left = $(this);
                    var right = left.siblings(".BPT-Layout-Right");
                    if (left[0] && right[0]) {
                        var l = Math.max(left.children(":first").width(), 30);
                        var r = Math.max(right.children(":first").width(), 30);
                        if (l >= r) {
                            right.css("min-width", l + 10 + "px");
                        }
                        if (r >= l) {
                            left.css("min-width", r + 10 + "px");
                        }
                    }
                });
                
                // Update the view of size
                var sizeChildren = $("#Layout-Size").children();
                var width = sizeChildren.first().find(".BPT-EditContainer > span");
                var height = sizeChildren.last().find(".BPT-EditContainer > span");
                
                if (gleamRequired && width.text() !== obj.width + "") {
                    gleamLayoutChange(width);
                }
                width.text(obj.width);
                
                if (gleamRequired && height.text() !== obj.height + "") {
                    gleamLayoutChange(height);
                }
                height.text(obj.height);
            }
            
            // Fire the loaded code marker
            toolwindowHelpers.codeMarker(toolwindowHelpers.codeMarkers.perfBrowserTools_DiagnosticsToolWindowsDomExplorerTabChanged);
        });
    },    
    
    showAttributes: function (uid, tagName) {
        /// <summary>
        ///     Shows the attributes tab and populate it with info about the corrisponding dom element
        /// </summary>
        /// <param name="uid" type="String" optional="true">
        ///     The uid of the Dom Element that the attributes should be populated for
        /// </param>        
        /// <param name="tagName" type="String" optional="true">
        ///     The tag of the Dom Element that the attributes should be populated for
        /// </param>
        
        TabPanes.executeCleanup();

        TabPanes.activeTab = "attributesView";
        
        TabPanes.cleanup = function () {
            var container = $("#attributesView").find(".BPT-DataTree-Container:first");
            container.attr("data-uid", "");
            container.attr("data-tag", "");
            
            $("#attributeNodeLabelText").text(": ");
            
            // Disable the buttons until something is selected
            domExplorerCode.updateAttributeButtons(false, false);
        };
        
        // Clear the view if we have no active element
        var container = $("#attributesView").show().find(".BPT-DataTree-Container:first");
        container.dataTreeView("clear");
        if (!uid) {
            return;
        }
        
        // Show the tag name in the label
        $("#attributeNodeLabelText").text(": " + (tagName ? tagName : ""));
        
        // Setup the container
        container.attr("data-uid", uid);
        container.attr("data-tag", tagName);
        
        
        // Handler for editing the value by double click
        var valueDblClickHandler = function (event) {
            var valueContext = $(this).children(".BPT-HTML-Value:first");
            var uid = valueContext.attr("data-uid");
            var attrName = valueContext.attr("data-attrName");
            
            valueContext.editTextbox(
                function onChange(newValue) {
                    // We need to change the value on the remote side
                    callProxy("editAttribute", [uid, attrName, newValue]);
                },
                function onClosed(newValue, wasCancelled, wasRemoved) {
                    if (wasCancelled && wasRemoved) {
                        // The attribute was removed while editing
                        valueContext.parents(".BPT-DataTreeItem:first").remove();
                    }
                },
                [{name: "data-attrName", value: attrName}]
            );
        };
    
        // Populate the attributes data tree
        var items = [];
        var element = $("#tree").find(".BPT-HtmlTreeItem[data-id='" + uid + "']");
        if (element.length === 1) {
            
            // Batch up the attributes
            element.find(".BPT-HtmlTreeItem-Header .BPT-HTML:first").children(".BPT-HTML-Attribute-Section").each(function (index, child) {
                var attribute = $(child).children(".BPT-HTML-Value");
                var name = attribute.attr("data-attrName");
                var val = attribute.text();
                
                var nameColumn = "<span class='BPT-HTML-Attribute'>" + name + "</span>";
                var valueColumn = "<span class='BPT-HTML-Value' data-attrName='" + name + "' data-uid='" + uid + "'>" + toolwindowHelpers.htmlEscape(val) + "</span>";
                items.push({uid: uid, name: nameColumn, value: valueColumn, hasChildren: false});
            });
            
            // Add the attributes to the data tree (without auto scrolling)
            var childrenGroup = container.dataTreeView("addItems", items, null, null, null, true);
            
            // Add the double click handler
            childrenGroup.children().find(".BPT-DataTreeItem-Value").bind("dblclick", valueDblClickHandler);            
            
        }
        
        var hasTagName = (tagName && !(/^#/).test(tagName));
        domExplorerCode.updateAttributeButtons(hasTagName, items.length > 0);

        // Restore the scroll positions
        TabPanes.restoreScrollPosition();

        // Fire the loaded code marker
        toolwindowHelpers.codeMarker(toolwindowHelpers.codeMarkers.perfBrowserTools_DiagnosticsToolWindowsDomExplorerTabChanged);
    },

    showEvents: function (uid, tagName) {
        /// <summary>
        ///     Shows the events tab and populate it with info about the selected dom element
        /// </summary>
        /// <param name="uid" type="String" optional="true">
        ///     The uid of the Dom Element that the attributes should be populated for
        /// </param>
        /// <param name="tagName" type="String" optional="true">
        ///     The tag of the Dom Element that the attributes should be populated for
        /// </param>

        TabPanes.executeCleanup();

        TabPanes.activeTab = "eventsView";

        // Clear the view if we have no active element
        var container = $("#eventsView").show();
        container.dataTreeView("clear");

        TabPanes.cleanup = function () {
            container.dataTreeView("clear");
            callProxy("clearCurrentEventProxy", []);
        };

        // Update the events pane
        var eventsData = {};
        var isInitialPopulation = true;

        var dataTreeItemFromEventListener = function (eventListener) {
            var safeHandlerName = toolwindowHelpers.htmlEscape(unescape(eventListener.functionName));
            var nameColumn = "<span class='BPT-HTML-Value'>" + safeHandlerName + "</span>";

            var tooltip = "";
            var linkColumn = "";
            if (eventListener.documentUrl !== undefined) {
                // Increment eventListener.line and .column by 1 since they come back from IE as 0 indexed, but VS is 1 indexed.
                linkColumn = toolwindowHelpers.createLinkDivText({ url: eventListener.documentUrl, line: eventListener.line + 1, column: eventListener.column + 1 }, "BPT-DataTreeItem-FileLink-Value", true);
                tooltip = toolwindowHelpers.loadString("EventHandlerTooltip", [toolwindowHelpers.htmlEscape(eventListener.eventName), eventListener.usesCapture.toString(), toolwindowHelpers.htmlEscape(eventListener.documentUrl), eventListener.line + 1, eventListener.column + 1]);
            } else if (eventListener.documentNode !== undefined) {
                var fileName;
                switch (eventListener.documentNode) {
                    case "eval code" :
                        fileName = toolwindowHelpers.loadString("EvalCodeEventHandlerToolTip");
                        break;
                    case "Function code" :
                        fileName = toolwindowHelpers.loadString("FunctionCodeEventHandlerToolTip");
                        break;
                    case "script block" :
                        fileName = toolwindowHelpers.loadString("DynamicScriptBlockEventHandlerToolTip");
                        break;
                    default:
                        fileName = eventListener.documentNode;
                        break;
                }

                // Increment eventListener.line and .column by 1 since they come back from IE as 0 indexed, but VS is 1 indexed.
                linkColumn = "<div>" + toolwindowHelpers.htmlEscape(eventListener.documentNode) + "</div>";
                tooltip = toolwindowHelpers.loadString("EventHandlerTooltip", [toolwindowHelpers.htmlEscape(eventListener.eventName), eventListener.usesCapture.toString(), toolwindowHelpers.htmlEscape(fileName), eventListener.line + 1, eventListener.column + 1]);
            } else {
                tooltip = toolwindowHelpers.loadString("ExternalEventHandlerTooltip", [toolwindowHelpers.htmlEscape(eventListener.eventName), eventListener.usesCapture.toString()]);
            }
            
            
            // These numbers are 0 indexed from jscript9 but 1 indexed in VS:
            eventListener.column++; 
            eventListener.line++;
            return { uid: eventListener.cookie, name: nameColumn, value: linkColumn, hasChildren: false, alreadyEncodedTooltip: tooltip };
        };

        var onEventHandlerAdded = function (e) {
            // Event properties:
            //// e.cookie, e.eventName, e.functionName, e.documentUrl, e.line, e.column
            var children = container.dataTreeView("getChildren");

            var safeName = escape(e.eventName);

            // If there are no events listed for that event name, add one.
            var eventListenerList = eventsData[safeName] ? eventsData[safeName] : (eventsData[safeName] = []);

            eventListenerList.push(e);

            var addToNode;

            for (var childIndex = 0; childIndex < children.length; childIndex++) {
                var child = children[childIndex];

                if (child.getAttribute("data-id") === safeName) {
                    addToNode = $(child);
                    break;
                }
            }           

            var eventExpandCallback = function (isExpanding, parentElement, id, onExpandComplete, stylesInGroup) {
                if (isExpanding) {
                    var itemList = [];
                    var listeners = eventsData[parentElement.first().data("id")];

                    for (var i = 0; i < listeners.length; i++) {
                        itemList.push(dataTreeItemFromEventListener(listeners[i]));
                    }
                    
                    var childrenGroup = parentElement.dataTreeView("addItems", itemList);
                }
            };
            if (addToNode === undefined) {
                // TODO: create a new class for event names
                var nameColumn = "<span class='BPT-HTML-Attribute' title='" + safeName + "'>" + safeName + "</span>";
                
                addToNode = container.dataTreeView("addItems", [{ uid: safeName, name: nameColumn, value: "", hasChildren: true }], eventExpandCallback).children(":last");
            }

            if (addToNode.dataTreeView("isCollapsed")) {
                addToNode.dataTreeView("toggle");
            } else {
                var dataTreeItem = dataTreeItemFromEventListener(e);
                addToNode.dataTreeView("addItems", [dataTreeItem]);
            }

            // Restore the scroll positions on the first population of the events tab
            if (isInitialPopulation) {
                isInitialPopulation = false;
                TabPanes.restoreScrollPosition();
            }
        };
        
        var onEventHandlerRemoved = function (e) {
            var safeName = escape(e.eventName);

            // First, remove it from our data:
            var listenersData = eventsData[safeName];
            if (listenersData) {
                for (var listenersIndex = 0; listenersIndex < listenersData.length; listenersIndex++) {
                    if (listenersData[listenersIndex].cookie === e.cookie) {
                        listenersData.splice(listenersIndex, 1);
                        break;
                    }
                }
            }

            // Then remove it from the UI if it's present:
            var removeFromNode;
            var children = container.dataTreeView("getChildren");
            for (var childIndex = 0; childIndex < children.length; childIndex++) {
                var child = children[childIndex];

                if (child.getAttribute("data-id") === safeName) {
                    removeFromNode = $(child);
                    break;
                }
            }  

            if (removeFromNode) {
                var cookie = e.cookie;
                var listeners = removeFromNode.dataTreeView("getChildren");
                for (var listenerIndex = 0; listenerIndex < listeners.length; listenerIndex++) {
                    var listener = listeners[listenerIndex];

                    if (listener.getAttribute("data-id") === cookie) {
                        $(listener).remove();
                        break;
                    }
                }
            }
        };

        callProxy("collectEvents", [uid, onEventHandlerAdded, onEventHandlerRemoved]);
    },

    addAttribute: function (name, value) {
    
        var container = $("#attributesView").find(".BPT-DataTree-Container:first");
    
        if (container.is(":visible")) {
        
            // Handler for editing the value by double click
            var valueDblClickHandler = function (event) {
                var valueContext = $(this).children(".BPT-HTML-Value:first");
                var uid = valueContext.attr("data-uid");
                var attrName = valueContext.attr("data-attrName");
                
                valueContext.editTextbox(
                    function onChange(newValue) {
                        // We need to change the value on the remote side
                        callProxy("editAttribute", [uid, attrName, newValue]);
                    },
                    function onClosed(newValue, wasCancelled, wasRemoved) {
                        if (wasCancelled && wasRemoved) {
                            // The attribute was removed while editing
                            valueContext.parents(".BPT-DataTreeItem:first").remove();
                        }
                    },
                    [{name: "data-attrName", value: attrName}]
                );
            };
            
            var uid = container.attr("data-uid");
       
            // Check if there is an existing row with this value already
            var newRow = null;
            var dataTreeValueNode = container.find(".BPT-HTML-Value[data-attrName='" + name + "']");
            if (dataTreeValueNode.length === 0) {
                // Create the nodes for the new row
                var nameColumn = "<span class='BPT-HTML-Attribute'>" + name + "</span>";
                var valueColumn = "<span class='BPT-HTML-Value' data-attrName='" + name + "' data-uid='" + uid + "'>" + toolwindowHelpers.htmlEscape(value) + "</span>";
                newRow = container.dataTreeView("addSingleItem", name, nameColumn, valueColumn);

                dataTreeValueNode = newRow.find(".BPT-DataTreeItem-Value:first");
            } else {
                // We already have the value, so set the text and find the row it belongs in
                dataTreeValueNode.text(value);
                newRow = dataTreeValueNode.parents(".BPT-DataTreeItem:first");
            }

            // Attach the edit handler to this row's value part
            dataTreeValueNode.bind("dblclick", valueDblClickHandler);
            dataTreeValueNode = null;

            // Check to see if this added attribute came from the add button
            if (domExplorerCode.newlyCreatedAttributeInfo) {
                if (domExplorerCode.newlyCreatedAttributeInfo.uid === uid &&
                    domExplorerCode.newlyCreatedAttributeInfo.name === name) {
                    // Select the value
                    newRow.click();
                }
                domExplorerCode.newlyCreatedAttributeInfo = null;
            }    
            newRow = null;
        }
    },
    
    attributeModified: function (uid, tag, attributeModifiedEvent) {
    
        var container = $("#attributesView").find(".BPT-DataTree-Container:first");
        
        if (container.is(":visible") && container.attr("data-uid") === uid && container.attr("data-tag") === tag) {
                    
            // Update the attributes tab
            var editbox = container.find(".BPT-EditBox[data-attrName='" + attributeModifiedEvent.attrName + "']");
            var attrNode;
            if (attributeModifiedEvent.attrChange === 3) { 
                // Attribute removed
                if (editbox.length > 0) {
                    // We are currently editing the attribute that has been removed
                    editbox.trigger("valueRemoved");
                } else {
                    attrNode = container.find(".BPT-HTML-Value[data-attrName='" + attributeModifiedEvent.attrName + "']").parents(".BPT-DataTreeItem:first");
                    attrNode.dataTreeView("removeAndSelect");
                }
            } else if (attributeModifiedEvent.attrChange === 2) { 
                // Attribute added
                TabPanes.addAttribute(attributeModifiedEvent.attrName, attributeModifiedEvent.newValue);
            } else { 
                // Attribute modified
                if (editbox.length > 0) {
                    // We are currently editing the attribute that has been changed
                    editbox.trigger("valueChanged", attributeModifiedEvent.attrName);
                } else {
                    attrNode = container.find(".BPT-HTML-Value[data-attrName='" + attributeModifiedEvent.attrName + "']");
                    attrNode.text(attributeModifiedEvent.newValue);
                }
            }
            attrNode = null;
            
            // Check if we need to disable the remove button now
            domExplorerCode.updateAttributeButtons();
            
            // We will need to re-grab the styles when the tabs are next opened
            TabPanes.clearState();
        } else {
            // Refresh the styles if required
            var selectedId = $("#tree").htmlTreeView("getSelected").attr("data-id");
            if (selectedId === uid) {
                domExplorerCode.refreshCSSView(true, true);        
            }
        }
    },
    
    // Function that each tab can add, it provides a callback for any cleaning up the tab needs to do when the current active
    // tab or current active element gets replaced.
    cleanup: null
};

function selectElementFromConsole() {
    /// <summary>
    ///     Selects an element in the dom explorer tree, that has already been set on the remote side by console.select()
    /// </summary>
    
    callProxy("selectElementFromConsole", [], function (succeeded) {
    
        if (succeeded) {
            // Expand the tree
            DomTree.expandToRemoteSelectedElement();
        }
    });
}

function switchTab(tabIndex) {
    /// <summary>
    ///     Changes to a specified tab in the dom explorer right pane
    /// </summary>
    /// <param name="tabIndex" type="Number">
    ///     The index of the tab that we should switch to
    /// </param>
    
    switch (tabIndex) {
        case 0:
            $("#stylesTabButton").click();
            break;
        case 1:
            $("#traceStylesTabButton").click();
            break;
        case 2:
            $("#layoutTabButton").click();
            break;
        case 3:
            $("#attributesTabButton").click();
            break;
        case 4:
            $("#eventsTabButton").click();
            break;
    }            

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
toolwindowHelpers.registerErrorComponent("DomExplorer", domExplorerCode.onError);

// Setup the theme before the window has loaded
window.setTimeout(function () {
    toolwindowHelpers.registerThemeChange(externalObj, ["domExplorer.css", "layout.css"]);
}, 0);

window.onload = function () {
    // Setup the dom explorer now that the window has loaded
    domExplorerCode.initialize(externalObj);
};


// SIG // Begin signature block
// SIG // MIIaPAYJKoZIhvcNAQcCoIIaLTCCGikCAQExCzAJBgUr
// SIG // DgMCGgUAMGcGCisGAQQBgjcCAQSgWTBXMDIGCisGAQQB
// SIG // gjcCAR4wJAIBAQQQEODJBs441BGiowAQS9NQkAIBAAIB
// SIG // AAIBAAIBAAIBADAhMAkGBSsOAwIaBQAEFHC5gvoxfa5O
// SIG // z5ThfFbGBNaQwt9noIIVLTCCBKAwggOIoAMCAQICCmEZ
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
// SIG // zjEp/w7FW1zYTRuh2Povnj8uVRZryROj/TGCBHswggR3
// SIG // AgEBMIGHMHkxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpX
// SIG // YXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYD
// SIG // VQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xIzAhBgNV
// SIG // BAMTGk1pY3Jvc29mdCBDb2RlIFNpZ25pbmcgUENBAgph
// SIG // GcyTAAEAAABmMAkGBSsOAwIaBQCggagwGQYJKoZIhvcN
// SIG // AQkDMQwGCisGAQQBgjcCAQQwHAYKKwYBBAGCNwIBCzEO
// SIG // MAwGCisGAQQBgjcCARUwIwYJKoZIhvcNAQkEMRYEFIhu
// SIG // 0GtMXrfa5QbLqiOPXonrl9KbMEgGCisGAQQBgjcCAQwx
// SIG // OjA4oB6AHABkAG8AbQBFAHgAcABsAG8AcgBlAHIALgBq
// SIG // AHOhFoAUaHR0cDovL21pY3Jvc29mdC5jb20wDQYJKoZI
// SIG // hvcNAQEBBQAEggEAnOz3QxVhyLgYkn/bqjYT5wEQoTzv
// SIG // x7xA4/rR2I8bPI5HfK4jjyA18/UN0VPYnXKA7tFqd0NU
// SIG // uloyY/dZFrzoVStdpqN26i17lrtdiHPtqMgRCAi4txSF
// SIG // jAeCWZwZhPXljcuh9Xd8PvgosmdJBDGaHM2DiEunfuGw
// SIG // j8rEGzrT96oPdNCDUdIP4IfRxsTgwKoTRyesim/NPG3x
// SIG // Sa8jC4Z7++uXr+oGN0wVUFPrnOe2cAe9CKj/OixZHTdF
// SIG // d0VHaMDrSdn+3o3yw5ksu0KF2UIpplTb6og4DmesHgVB
// SIG // riHcgqf33LV5xSw7f6Kmg+lvqlxFeQLxAIpkJwapd8Ae
// SIG // bxdXYaGCAh0wggIZBgkqhkiG9w0BCQYxggIKMIICBgIB
// SIG // ATCBhTB3MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2Fz
// SIG // aGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UE
// SIG // ChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMSEwHwYDVQQD
// SIG // ExhNaWNyb3NvZnQgVGltZS1TdGFtcCBQQ0ECCmEFGZYA
// SIG // AAAAABswBwYFKw4DAhqgXTAYBgkqhkiG9w0BCQMxCwYJ
// SIG // KoZIhvcNAQcBMBwGCSqGSIb3DQEJBTEPFw0xMjA3Mjcw
// SIG // MTQ2MjZaMCMGCSqGSIb3DQEJBDEWBBQPCoEfoDRXf82s
// SIG // wo4PsghNm1JqlzANBgkqhkiG9w0BAQUFAASCAQC8mvMm
// SIG // lwTsm/5Lcn4HWFhP24tt4jn2a7NUS/9sU1ZqIwNvSG7a
// SIG // DQ8oohcCQpe28WjYIc3KuVKlEmkEG/DYtX4XAuuxlyrq
// SIG // C/Cg6ACKstK1mweeIkBe8V+Uivoq/ixg81PsdB+AMHhZ
// SIG // Ni92RPSRn3RIRtSMCWnPcVwq62bLLlEcvzcS6ATreUkX
// SIG // GFb+yFICqdbc495KwqL7OZmaM8kx/uAhpiWmMs48ou/B
// SIG // Fgtst3QuxtrfRwJko5DLJkuXZOgQ1fZgMIfv5b9Zsqv8
// SIG // b/w7nZMzfaDyEUOtXkKAkdDEq0mQE2d4+Bhlt65ux5pT
// SIG // TjyEVI4XfOVB9b2kRT734y0GhGbT
// SIG // End signature block
