// Expected global variables:
/*global $ clipboardData*/

var toolwindowHelpers = {
    
    // A set of types used in the console for different output items
    codeMarkers: {
        perfBrowserTools_DiagnosticsToolWindowsConsoleReady: 23609,
        perfBrowserTools_DiagnosticsToolWindowsDomExplorerReady: 23610,
        perfBrowserTools_DiagnosticsToolWindowsExpandConsoleObjectBegin: 23611,
        perfBrowserTools_DiagnosticsToolWindowsExpandConsoleObjectEnd: 23612,
        perfBrowserTools_DiagnosticsToolWindowsExpandConsoleObjectInteractive: 23613,
        perfBrowserTools_DiagnosticsToolWindowsConsoleEvalBegin: 23614,
        perfBrowserTools_DiagnosticsToolWindowsConsoleEvalEnd: 23615,
        perfBrowserTools_DiagnosticsToolWindowsDataTreeToggleBegin: 23616,
        perfBrowserTools_DiagnosticsToolWindowsDataTreeToggleEnd: 23617,
        perfBrowserTools_DiagnosticsToolWindowsTreeViewToggleBegin: 23618,
        perfBrowserTools_DiagnosticsToolWindowsTreeViewToggleEnd: 23619,
        perfBrowserTools_DiagnosticsToolWindowsDomExplorerRefreshBegin: 23620,
        perfBrowserTools_DiagnosticsToolWindowsDomExplorerRefreshEnd: 23621,
        perfBrowserTools_DiagnosticsToolWindowsDomExplorerAttributeChanged: 23622,
        perfBrowserTools_DiagnosticsToolWindowsDomExplorerTabChanged: 23623
    },
    
    // Number of times to re-send a break mode evaluation message
    maxBreakModeRetries: 5,
    
    // The VSBridge apis
    externalApis: null,
    
    // Communication callbacks
    onMessageCallback: null,
    onAttachCallback: null,
    onDetachCallback: null,
    
    // The current unique id used for identifying callbacks
    uid: 0,
    
    // The communication port that is talking to the remote script engine
    remotePort: null,
    
    // A queue of messages waiting to be sent to the remote side for processing
    pendingMessages: [],
    
    // The current timeout used for batching messages to the remote side
    pendingTimeout: null,
    
    // Queued callbacks waiting to be executed
    callbacks: {},
    
    // Should we be firing code markers to the VSBridge
    areCodeMarkersEnabled: false,
    
    // The state of the program in the debugger
    atBreakpoint: false,

    // Whether we should use VS Evaluation to send messages while at a breakpoint
    useBreakpointEval : false,
    
    initializeToolWindow: function (externalApis, useBreakpointEval, onMessageCallback, onAttachCallback, onDetachCallback, onShowCallback, onBreakCallback, onRunCallback) {
        /// <summary>
        ///     Initializes common functionality of the tool windows
        ///     This includes adding event handlers and styling for buttons and togglebuttons, and
        ///     adding common keyboard navigation functionality
        /// </summary>
        /// <param name="externalApis" type="Object">
        ///     The window.external object that will be used to set up the communication channel
        /// </param>
        /// <param name="onMessageCallback" type="Function">
        ///     The function to call when a message returns from the remote side
        /// </param>
        /// <param name="onAttachCallback" type="Function">
        ///     The function to call when the diagnostics attach to a process
        /// </param>
        /// <param name="onDetachCallback" type="Function">
        ///     The function to call when the diagnostics detach from a process
        /// </param>
        /// <param name="onShowCallback" type="Function" optional="true">
        ///     The function to call when the toolwindow is shown
        /// </param>
        /// <param name="onBreakCallback" type="Function" optional="true">
        ///     The function to call when the debugger goes into break mode
        /// </param>
        /// <param name="onRunCallback" type="Function" optional="true">
        ///     The function to call when the debugger resumes from break mode
        /// </param>
        
        toolwindowHelpers.externalApis = externalApis;
        toolwindowHelpers.useBreakpointEval = useBreakpointEval;
        toolwindowHelpers.onMessageCallback = onMessageCallback;
        toolwindowHelpers.onAttachCallback = onAttachCallback;
        toolwindowHelpers.onDetachCallback = onDetachCallback;
        toolwindowHelpers.onShowCallback = onShowCallback;
        toolwindowHelpers.onBreakCallback = onBreakCallback;
        toolwindowHelpers.onRunCallback = onRunCallback;
        
        // Add the handler that will activate our tool window in VS
        document.addEventListener("mousedown", function () { 
/*+VWD
            externalApis.vsBridge.notifyOnBrowserActivate(); 
-VWD*/
            externalApis.resources.notifyOnBrowserActivate();  
            $(document.body).removeClass("showFocus");
        }, true);
        
        // Prevent the default context menu
        $(document).bind("contextmenu", function () { 
            return false; 
        });
        
        // Prevent the default F5 refresh and shift F10 WPF context menu (the jquery 'contextmenu' event will fire when desired)
        $(document).bind("keydown", function (event) { 
            if (event.keyCode === 116 ||                    
                (event.keyCode === 121 && event.shiftKey)) { // F5(116) and F10(121)
                event.preventDefault();
                event.stopPropagation();
                return false;
            } else if (event.keyCode === 9) { // Tab(9)
                $(document.body).addClass("showFocus");
            }
        });

        // Create focus handlers for css changes
        var focusOut = function () {
            $(document.body).addClass("BPT-ToolWindow-NoFocus");
        };
        var focusIn = function () {
            $(document.body).removeClass("BPT-ToolWindow-NoFocus");
        };
//      if (externalApis.vsBridge.getIsToolWindowActive()) {
        if (externalApis.resources.getIsToolWindowActive()) {
            focusIn(); // Default to focused
        } else {
            focusOut(); // Default to no focus
        }
        
        // Add the focus handlers
/*+VWD
        externalApis.vsBridge.addEventListener("toolwindowShow", toolwindowHelpers.onShow);
        externalApis.vsBridge.addEventListener("toolwindowActivate", focusIn);
        externalApis.vsBridge.addEventListener("toolwindowDeactivate", focusOut);
        externalApis.vsBridge.addEventListener("browserDeactivate", function () {
*/
        externalApis.resources.addEventListener("toolwindowShow", toolwindowHelpers.onShow);
        externalApis.resources.addEventListener("toolwindowActivate", focusIn);
        externalApis.resources.addEventListener("toolwindowDeactivate", focusOut);
        externalApis.resources.addEventListener("browserDeactivate", function () {

            // When the user clicks outside the browser but remains in the same tool window
            // we need to remove focus from the current element, so we set it to the
            // body which is tab index -1.
            document.body.setActive();
            $(document.body).removeClass("showFocus");
        });

        // Setup the buttons and toggle buttons
        $(".BPT-ToolbarButton").bind("mousedown", function (event) {
            var element = $(this);
            if (!element.hasClass("BPT-ToolbarButton-StateDisabled")) {
                element.addClass("BPT-ToolbarButton-MouseDown");
            } else {
                event.stopImmediatePropagation();
            }
        });
        $(".BPT-ToolbarButton").bind("mouseup", function () {
            $(this).removeClass("BPT-ToolbarButton-MouseDown");
        });
        $(".BPT-ToolbarButton").bind("mouseleave", function () {
            $(this).removeClass("BPT-ToolbarButton-MouseDown BPT-ToolbarButton-MouseHover");
        });
        $(".BPT-ToolbarButton").bind("mouseenter", function (event) {
            var element = $(this);
            if (!element.hasClass("BPT-ToolbarButton-StateDisabled")) {
                element.addClass("BPT-ToolbarButton-MouseHover");
            } else {
                event.preventDefault();
                event.stopImmediatePropagation();
            }
        });
        $(".BPT-ToolbarButton").bind("click keydown", function (event) {
            if (event.type === "click" || event.keyCode === 13 || event.keyCode === 32) { // Enter(13) and Space(32)
                var element = $(this);
                if (!element.hasClass("BPT-ToolbarButton-StateDisabled")) {
                    if (document.activeElement !== element[0]) {
                        element[0].focus();
                    }
                } else {
                    event.preventDefault();
                    event.stopImmediatePropagation();
                }
            }
        });
        $(".BPT-ToolbarToggleButton").bind("click keydown", function (event) {
            if (event.type === "click" || event.keyCode === 13 || event.keyCode === 32) { // Enter(13) and Space(32)
                var element = $(this);
                if (!element.hasClass("BPT-ToolbarButton-StateDisabled")) {
                    if (document.activeElement !== element[0]) {
                        element[0].focus();
                    }
                    element.toggleClass("BPT-ToolbarToggleButton-StateOn");
                } else {
                    event.preventDefault();
                    event.stopImmediatePropagation();
                }
            }
        });
        
        // Setup keyboard navigation
        $(".BPT-TabCycle-Horizontal, .BPT-TabCycle-Vertical").children(".BPT-TabCycle-Item").bind("keydown", function (event) {
            if (($(this).parent().hasClass("BPT-TabCycle-Horizontal") && (event.keyCode === 37 || event.keyCode === 39)) || // Left(37) and Right(39)
                ($(this).parent().hasClass("BPT-TabCycle-Vertical") && (event.keyCode === 38 || event.keyCode === 40))) {   // Up(38) and Down(4)
                var currentElement = $(this);
                var newElement = ((event.keyCode === 37 || event.keyCode === 38) ? // Left(37) or Up(38)
                                    currentElement.prev(".BPT-TabCycle-Item:first") : 
                                    currentElement.next(".BPT-TabCycle-Item:first"));
                
                // Ensure we are moving to a new element
                if (newElement[0]) {
                    newElement.attr("tabindex", "1");
                    newElement.trigger("focus");
                    newElement.trigger("click");
                    currentElement.removeAttr("tabindex");
                }
            }
        });
        $(".BPT-TabCycle-Horizontal, .BPT-TabCycle-Vertical").children(".BPT-TabCycle-Item").bind("mousedown", function (event) {
            var oldElement = $(this).siblings(".BPT-TabCycle-Item[tabindex='1']");
            var newElement = $(this);
            
            // Replace the tab index from the old element, to the new one
            if (newElement[0]) {
                newElement.attr("tabindex", "1");
                newElement.trigger("focus");
                oldElement.removeAttr("tabindex");
            }
        });
        
//        toolwindowHelpers.areCodeMarkersEnabled = toolwindowHelpers.externalApis.vsBridge.getAreCodeMarkersEnabled();
        toolwindowHelpers.areCodeMarkersEnabled = toolwindowHelpers.externalApis.resources.getAreCodeMarkersEnabled();
        
        // Setup communication channel
        toolwindowHelpers.externalApis.addEventListener("break", toolwindowHelpers.onBreak);
        toolwindowHelpers.externalApis.addEventListener("run", toolwindowHelpers.onRun);
        toolwindowHelpers.externalApis.addEventListener("detach", toolwindowHelpers.onDetach);
        toolwindowHelpers.externalApis.addEventListener("connect", toolwindowHelpers.onConnect);

        if (toolwindowHelpers.externalApis.isAttached) {
            toolwindowHelpers.onAttach();
        } else {
            // Show the diagnostics disabled warning
            $("#warningSection").text(toolwindowHelpers.loadString("DiagnosticsDisabled")).show();
        }
        toolwindowHelpers.externalApis.addEventListener("attach", toolwindowHelpers.onAttach);
    },
    
    onAttach: function () {
        /// <summary>
        ///     The onAttach handler that is called when the diagnostics engine has attached to a process 
        ///     and debugging has started
        /// </summary>
        
        // Hide the diagnostics disabled warning
        $("#warningSection").hide();
        
//        toolwindowHelpers.atBreakpoint = toolwindowHelpers.externalApis.vsBridge.getIsAtBreakpoint();
        toolwindowHelpers.atBreakpoint = toolwindowHelpers.externalApis.resources.getIsAtBreakpoint();
        
        toolwindowHelpers.onAttachCallback();
    },

    onDetach: function () {
        /// <summary>
        ///     The onDetach handler that is called when the diagnostics engine has detached from a process
        ///     and debugging has stopped
        /// </summary>

        // Remove un-needed objects
        toolwindowHelpers.remotePort = null;
        toolwindowHelpers.atBreakpoint = false;
        toolwindowHelpers.callbacks = {};
        toolwindowHelpers.pendingMessages = [];
        toolwindowHelpers.pendingTimeout = null;
        
        toolwindowHelpers.onDetachCallback();
        
        // Show the diagnostics disabled warning
        $("#warningSection").text(toolwindowHelpers.loadString("DiagnosticsDisabled")).show();
    }, 

    onShow: function () {
        /// <summary>
        ///     The onShow handler that is called when the toolwindow has been shown
        /// </summary>    
        
        if (toolwindowHelpers.onShowCallback) {
            toolwindowHelpers.onShowCallback();
        }
    },
    
    onBreak: function () {
        /// <summary>
        ///     The onBreak handler that is called when the diagnostics debugging is paused at a breakpoint
        /// </summary>
        
        // We may have detached and then attached to a non diagnostic enabled debug session,
        // So check that we have a active port connection.
        if (toolwindowHelpers.remotePort) {
            toolwindowHelpers.atBreakpoint = true;
        }
        
        if (toolwindowHelpers.onBreakCallback) {
            toolwindowHelpers.onBreakCallback();
        }
    },

    onRun: function () {
        /// <summary>
        ///     The onRun handler that is called when the diagnostics debugging has resumed from a breakpoint
        /// </summary>
        
        // We may have detached and then attached to a non diagnostic enabled debug session,
        // So check that we have a active port connection.
        if (toolwindowHelpers.remotePort) {
            toolwindowHelpers.atBreakpoint = false;
        }
        
        if (toolwindowHelpers.onRunCallback) {
            toolwindowHelpers.onRunCallback();
        }
    },  

    onConnect: function (port) {
        /// <summary>
        ///     This method is called back when the remote side has connected and is ready for use
        /// </summary>
        /// <param name="port" type="Object">
        ///     The communication object that will be used to post messages
        /// </param>

        toolwindowHelpers.remotePort = port;
        toolwindowHelpers.remotePort.addEventListener("message", toolwindowHelpers.onMessageCallback);
//        toolwindowHelpers.atBreakpoint = toolwindowHelpers.externalApis.vsBridge.getIsAtBreakpoint();
        toolwindowHelpers.atBreakpoint = toolwindowHelpers.externalApis.resources.getIsAtBreakpoint();
    },

    registerErrorComponent: function (component, errorDisplayHandler) {
        /// <summary>
        ///     Stores the component name and error handler function for non-fatal
        ///     error reporting    
        /// </summary>
        /// <param name="component" type="String">
        ///     The identifying name of the component
        /// </param>
        /// <param name="errorDisplayHandler" type="Function">
        ///     The function that should be called to display an error message to the
        ///     user
        /// </param>   
        
        window.errorComponent = component;
        window.errorDisplayHandler = errorDisplayHandler;
    },
    
    registerThemeChange: function (externalApis, cssFiles) {
        /// <summary>
        ///     Adds an event listener to the themeChange event in Visual Studio and 
        ///     processes the css files when a theme change occurs    
        /// </summary>
        /// <param name="externalApis" type="Object">
        ///     The window.external object that will be used to set up the communication channel
        /// </param>
        /// <param name="cssFiles" type="Array">
        ///     Array of strings containing the name of the css files required for the toolwindow
        /// </param>
     
        function onThemeChange() {
            var cssThemeFiles = ["toolwindow.css", "datatree.css", "htmltree.css"].concat(cssFiles);
            for (var i = 0; i < cssThemeFiles.length; i++) {

                var id = cssThemeFiles[i];
//                var contents = externalApis.vsBridge.loadCssFile(cssThemeFiles[i], i < 3);
                var contents = externalApis.resources.loadCssFile(cssThemeFiles[i], i < 3);

                // Remove any previous style with this id
                var oldStyle = document.getElementById(id);
                if (oldStyle) {
                    document.head.removeChild(oldStyle);
                }

                // Add the new ones
                var styleNode = document.createElement("style");
                styleNode.id = id;
                styleNode.type = "text/css";
                styleNode.innerHTML = contents;
                document.head.appendChild(styleNode);
            }
            
            // Check the tree expand icons
            var trees = $(".BPT-HtmlTree, .BPT-DataTree");
            for (var j = 0; j < trees.length; j++) {
                var element = $(trees[j]);
                var useDarkTheme = toolwindowHelpers.isDarkThemeBackground(element);
                if (useDarkTheme) {
                    element.addClass("BPT-Tree-DarkTheme");
                } else {
                    element.removeClass("BPT-Tree-DarkTheme");
            }
        }
        }
        
        // Ensure the WebOC version is supported
        if (document.documentMode >= 9) {
/*+VWD
        if (document.documentMode >= 10 || (window.parent.getExternalObj && document.documentMode >= 9)) {
            externalApis.vsBridge.addEventListener("themeChange", onThemeChange);
-VWD*/
            externalApis.resources.addEventListener("themeChange", onThemeChange);
            
            // Fire an initial theme change event
            if (!window.parent.getExternalObj) {
                onThemeChange();
            }
        } else {
            // This browser version is not supported
//            externalApis.vsBridge.notifyUnsupportedBrowser(document.documentMode);
            externalApis.resources.notifyUnsupportedBrowser(document.documentMode);
            window.navigate("about:blank");
        }
    },
    
    loadString: function (resourceId, params) {
        /// <summary>
        ///     Gets a localized string for the resourceId
        /// </summary>
        /// <param name="resourceId" type="String">
        ///     The resource identifier of the string to retrieve
        /// </param>
        /// <param name="params" type="Array" optional="true">
        ///     Optional array of objects to be used in any format specifiers in the string
        /// </param>
        /// <returns type="String">
        ///     The loaded localized string
        /// </returns>    

        if (params !== undefined) {
            // Use the format function
//            return toolwindowHelpers.externalApis.vsBridge.loadFormattedString(resourceId, params);
            return toolwindowHelpers.externalApis.resources.loadFormattedString(resourceId, params);
        } else {
            // Use no formatting
//            return toolwindowHelpers.externalApis.vsBridge.loadString(resourceId);
            return toolwindowHelpers.externalApis.resources.loadString(resourceId);
        }
    },
    
    codeMarker: function (codeMarker) {
        /// <summary>
        ///     Fire a VS perf code marker with a specified identifier
        /// </summary>
        /// <param name="codeMarker" type="Number">
        ///     The value of the code marker
        /// </param>
        
        if (toolwindowHelpers.areCodeMarkersEnabled) {
//            toolwindowHelpers.externalApis.vsBridge.fireCodeMarker(codeMarker);
            toolwindowHelpers.externalApis.resources.fireCodeMarker(codeMarker);
        }
    },

    executeBreakModeCommand: function (remoteFunction, id, input, callback) {
        /// <summary>
        ///     Executes a command at breakmode using VS instead of the remote code,
        ///     This is used by the console to evaluate input in the context of the current breakpoint.
        /// </summary>
        /// <param name="remoteFunction" type="String">
        ///     The function to call on the remote side 
        /// </param>
        /// <param name="id" type="String">
        ///     The id to give to this command so that it can be identifed on the remote side
        /// </param>        
        /// <param name="input" type="String">
        ///     The input to execute
        /// </param>
        /// <param name="callback" type="Function">
        ///     The function to execute when the result is returned from the remote side
        /// </param>
        
        var uidString = toolwindowHelpers.getUid();
        toolwindowHelpers.callbacks[uidString] = { synced: true, callback: callback || $.noop };
    
        var sendBreakCommand = function (remoteFunction, id, uidString, input) {
            if (toolwindowHelpers.atBreakpoint) {
                // Send the message using the break mode command evaluator
//                var succeeded = toolwindowHelpers.externalApis.vsBridge.executeBreakModeCommand(remoteFunction + ":" + id + ":" + uidString, input);
                var succeeded = toolwindowHelpers.externalApis.resources.executeBreakModeCommand(remoteFunction + ":" + id + ":" + uidString, input);
                if (!succeeded) {
                    // We failed to send the break mode command because it is no longer in break mode,
                    // so send the message via the run time remote port.
                    if (toolwindowHelpers.remotePort) {
                        var jsonObj = {
                            uid: uidString,
                            command: remoteFunction,
                            args: [id, input]
                        };
                        var message = JSON.stringify([jsonObj]);
                        toolwindowHelpers.remotePort.postMessage(message);
                    }
                }
            }
        };
        
        setTimeout(function () {
            sendBreakCommand(remoteFunction, id, uidString, input);
        }, 0);
    },
    
    scrollIntoView: function (element, scrollContainer) {
        /// <summary>
        ///     Scrolls an element into view in a scroll container if it is currently outside of the view
        /// </summary>
        /// <param name="element" type="Object">
        ///     The DOM element that should be scrolled into the view
        /// </param>
        /// <param name="scrollContainer" type="Object">
        ///     The DOM element that has scrollbars and has the element being scrolled as a decendant
        /// </param>        
        /// <returns type="Boolean">
        ///     True if the view was scrolled, False if the element was already in the view and did not need scrolling
        /// </returns>
        
        // Ensure we have a valid element to scroll
        if (element) {
            var topOfPage = scrollContainer.scrollTop;
            var heightOfPage = scrollContainer.clientHeight;
            var elementTop = 0;
            var elementHeight = 0;

            var currentElement = element;
            while (currentElement && currentElement !== scrollContainer) {
                elementTop += currentElement.offsetTop;
                currentElement = currentElement.offsetParent;
            }
            elementHeight = element.offsetHeight;
            
            var alignPosition;
            if ((topOfPage + heightOfPage) < (elementTop + elementHeight)) {
                alignPosition = "bottom";
            } else if (elementTop < topOfPage) {
                alignPosition = "top";
            }
            
            if (alignPosition) {
                var temp = $("<div style='position:absolute; top:" + elementTop + "px; left: 0; height:" + elementHeight + "px'></div>");
                $(scrollContainer).append(temp);
                temp[0].scrollIntoView(alignPosition === "top");
                temp.remove();
                return true;           
            }
        }
        
        return false;
    },
    
    getSortedObjectProperties: function (objectToSort) {
        /// <summary>
        ///     Sorts an object's property names alphabetically and returns an array of the sorted names
        /// </summary>
        /// <param name="objectToSort" type="Object">
        ///     The javascript object that contains the properties that need to be sorted
        /// </param>
        /// <returns type="Array">
        ///     An array of the sorted property names that can be used as a list of sorted keys into the real object
        /// </returns>
        
        // Sort the property names for display
        var sortedPropNames = [];
        for (var propName in objectToSort) {
            sortedPropNames.push(propName);
        }

        sortedPropNames.sort(toolwindowHelpers.naturalSort);
        
        return sortedPropNames;
    },
    
    getSortedArrayProperties: function (arrayToSort, key, highPriorityValue) {
        /// <summary>
        ///     Sorts an array of objects on a key property names alphabetically and returns an array of the sorted indicies
        /// </summary>
        /// <param name="arrayToSort" type="Array">
        ///     The javascript array that contains the objects that need to be sorted
        /// </param>
        /// <param name="key" type="String">
        ///     The name of the property to sort the array by
        /// </param>
        /// <param name="highPriorityValue" type="String" optional="true">
        ///     Optional parameter to specify a value that should be treated with highest priority in the sort
        /// </param>           
        /// <returns type="Array">
        ///     An array of the sorted indicies that can be used as a list of sorted keys into the real array
        /// </returns>
        
        // Sort the property names for display
        var i;
        var sortedProps = [];
        for (i = 0; i < arrayToSort.length; i++) {
            sortedProps.push({property: arrayToSort[i][key], realIndex: i});
        }
       
        sortedProps.sort(function (a, b) {
            if (highPriorityValue) {
                if (a.property === highPriorityValue && b.property === highPriorityValue) {
                    return 0;
                } else if (a.property === highPriorityValue) {
                    return -1;
                } else if (b.property === highPriorityValue) {
                    return 1;
                }
            }
            return toolwindowHelpers.naturalSort(a.property, b.property);
        });
        
        var sortedList = [];
        for (i = 0; i < sortedProps.length; i++) {
            sortedList.push(sortedProps[i].realIndex);
        }
        
        return sortedList;
    },  
    
    naturalSort: function (a, b) {
        /// <summary>
        ///     Sorts two objects as strings alphabetically and returns a number representing the order
        /// </summary>
        /// <param name="a" type="Object">
        ///     The first string object to compare
        /// </param>
        /// <param name="b" type="Object">
        ///     The second string object to compare
        /// </param>        
        /// <returns type="Number">
        ///     A number representing the sort order
        ///     a &gt; b = 1
        ///     a &lt; b = -1
        ///     a == b = 0
        /// </returns>
        
        // Regular Expression to pick groups of either digits or non digits (eg. 11bc34 - will return [11, bc, 34])
        var regexSortGroup = /(\d+)|(\D+)/g;
        
        // Convert to case insensitive strings and identify the sort groups
        var aGroups = String(a).toLowerCase().match(regexSortGroup);
        var bGroups = String(b).toLowerCase().match(regexSortGroup);

        // Loop through each group
        while (aGroups.length > 0 && bGroups.length > 0) {
            // Take the first group of each string
            var aFront = aGroups.shift();
            var bFront = bGroups.shift();
            
            // Check for digits
            var aAsDigit = parseInt(aFront, 10);
            var bAsDigit = parseInt(bFront, 10);
            
            if (isNaN(aAsDigit) && isNaN(bAsDigit)) {
                // Compare as string characters
                if (aFront !== bFront) {
                    // Chars not the same, so just return the sort value
                    return (aFront > bFront ? 1 : -1);
                }
            } else if (isNaN(aAsDigit)) {
                // Letters come after numbers
                return 1;
            } else if (isNaN(bAsDigit)) {
                // Numbers come before letters
                return -1;
            } else {
                // Compare as numbers
                if (aAsDigit !== bAsDigit) {
                    // Numbers not the same, so just return the sort value
                    return (aAsDigit - bAsDigit);
                }
            }
        }
        
        // If we get here, we know all the groups checked were identical,
        // So we can return the length difference as the sort value.
        return aGroups.length - bGroups.length;
    },
    
    formatMultilineString: function (multilineString) {
        /// <summary>
        ///     Formats a multiline string by trimming whitespace and removing any empty lines
        /// </summary>
        /// <param name="multilineString" type="String">
        ///     The string to format
        /// </param>
        /// <returns type="String">
        ///     The formatted string
        /// </returns>
        
        if (!multilineString) {
            return "";
        }
        
        var text = "";
        
        var finalLines = [];
        // Split into lines, then process each one
        var lines = multilineString.split(/[\r\n]+/);
        for (var lineIndex = 0; lineIndex < lines.length; lineIndex++) {
            if ($.trim(lines[lineIndex]) !== "") {
                finalLines.push(lines[lineIndex]);
            }
        }
        
        // Join up the lines into html with line breaks
        text = finalLines.join("\n");
        
        return text;
    },


    createShortenedUrlText: function (url) {
        /// <summary>
        ///     Returns a short form of the URL for use in displaying file links to the user.  Adapted
        ///     from F12 toolbar code, this method removes any trailing query string or anchor location 
        ///     and attempts to get the last file or directory following a '/'.  
        /// </summary>
        /// <param name="url" type="String">
        ///     The url to shorten.
        /// </param>
        /// <returns type="String">
        ///     A shortened version of the string
        /// </returns>

        var shortenedText = url;
        // Remove a query string if any
        var indexOfHash = shortenedText.indexOf("#");
        var indexOfQuestionMark = shortenedText.indexOf("?");
        var index = -1;
        if (indexOfHash > -1 && indexOfQuestionMark > -1) {
            index = Math.min(indexOfHash, indexOfQuestionMark);
        } else if (indexOfHash > -1) {
            index = indexOfHash;
        } else if (indexOfQuestionMark > -1) {
            index = indexOfQuestionMark;
        }
    
        if (index > -1) {
            shortenedText = shortenedText.substring(0, index);
        }
    
        index = shortenedText.lastIndexOf("/");
    
        // While the last character is '/', truncate it and find the next / or the start of the string
        while (index === (shortenedText.length - 1) ) {
            // Remove last '/'
            shortenedText = shortenedText.substring(0, shortenedText.length - 1);
            index = shortenedText.lastIndexOf("/");
        }
    
        if (index > -1) {
            shortenedText = shortenedText.substring(index + 1);
        }
    
        return shortenedText;
    },

    createLinkDivText: function (link, styles, dontGenerateTooltip) {
        /// <summary>
        ///     Creates a DOM div element string for a link that opens a document in VS
        /// </summary>
        /// <param name="link" type="String">
        ///     The href to turn into a link div.
        /// </param>
        /// <param name="styles" type="String" optional="true">
        ///     A ' ' separated list of styles to add to the div.
        /// </param>
        /// <param name="dontGenerateTooltip" type="Boolean" optional="true">
        ///     No tooltip will be added if set to true.
        /// </param>
        /// <returns type="String">
        ///     The link string of the form <div class='[styles string] BPT-FileLink' data-linkUrl="[link.url]" data-linkSearch="[link.search]" data-linkLine='[link.line]' data-linkCol='[link.column]' tabindex='1'>[shortened link.url]</div>
        /// </returns>
        
        var linker = "";
        if (link && link.url) {
            // Create the url and text
            var url = "\"" + link.url.replace(/\\"/g, "\"") + "\"";
            var linkText = toolwindowHelpers.createShortenedUrlText(link.url);
            
            // Create the search term
            var search = "";
            if (link.search) {
                search = "\"" + link.search.replace(/\\"/g, "\"") + "\"";
            }
            
            linkText = linkText.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;");
            linker = "<div class='" + styles + " BPT-FileLink' data-linkUrl=" + url; 
            if (search) {
               linker += " data-linkSearch=" + search;
            }
            if (link.line) {
                linker += " data-linkLine='" + link.line + "'";
            }
            if (link.column) {
                linker += " data-linkCol='" + link.column + "'";
            }
            if (!dontGenerateTooltip) {
                linker += " title='" + linkText + "'";
            }
            linker += ">" + linkText + "</div>";
        }

        return linker;
    },

    htmlEscape: function (htmlString) {
        /// <summary>
        ///     Escapes a string so that it can be safely displayed in html. 
        /// </summary>
        /// <param name="htmlString" type="String">
        ///     The javascript string that is to be HTML escaped
        /// </param>
        /// <returns type="String">
        ///     The escaped string 
        /// </returns>

        // Ensure we have a string to escape
        if ((typeof htmlString) !== "string") {
            if (htmlString === null || htmlString === undefined) {
                return "";
            }
            htmlString = "" + htmlString;
        }
        
        // Speed up the html escape by using a regular expression to encode html characters
        return htmlString.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    },
    
    copySelectedTextToClipboard: function () {
        /// <summary>
        ///     Gets the highlighted text in the document, compacts multiline text by converting multiple \r\n's to a single one, and then copies the text to the clipboard
        /// </summary>
        /// <returns type="Boolean">
        ///     True if any text was copied, false otherwise
        /// </returns>
        
        var selectedText = document.selection.createRange().text;
        if (selectedText) {
            // Replace multiple white space lines with a single one
            var compactText = selectedText.replace(/[\r\n]+/g, "\r\n");
            // Copy to the clipboard
            clipboardData.setData("Text", compactText);
            return true;
        }
        
        return false;
    },
    
    isDarkThemeBackground: function (element) {
        /// <summary>
        ///     Checks the element's background color to see if it is being displayed in the dark theme
        /// </summary>
        /// <param name="element" type="Object">
        ///     The JQuery element to check the background for
        /// </param>        
        /// <returns type="Boolean">
        ///     True if the background color indicates the dark theme, False if it is light
        /// </returns>

        if (element) {
            var backgroundColor;
            while ((!backgroundColor || backgroundColor === "transparent") && element && element.length > 0) {
                backgroundColor = element.css("background-color");
                
                element = element.parent();
            }
            
            var rgbParts = backgroundColor.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
            if (rgbParts && rgbParts.length === 4) {
                
                // Brightness determined by W3C formula
                var brightness = ((rgbParts[1] * 299) + (rgbParts[2] * 587) + (rgbParts[3] * 114)) / 1000;
                
                return (brightness < 127);
            }
        }
        
        // Default to using light theme
        return false;
    },
    
    getExpandIconSrc : function (element, useExpandedIcon, performThemeCheck) {
        /// <summary>
        ///     Gets the src attribute of an element for either the expanded or collased icon in the current theme
        /// </summary>
        /// <param name="element" type="Object">
        ///     The JQuery element to get the icon for
        /// </param>        
        /// <param name="useExpandedIcon" type="Boolean">
        ///     True to use the expanded icon, False to use the collapsed icon
        /// </param>        
        /// <param name="performThemeCheck" type="Boolean" optional="true">
        ///     True to check the background color of the element to determine the icon theme to use
        /// </param> 

        var useDarkTheme;
        if (performThemeCheck) {
            useDarkTheme = toolwindowHelpers.isDarkThemeBackground(element);
        } else {
            useDarkTheme = (element.attr("src").indexOf("DarkTheme") >= 0);
        }
        
        var newSrc;
        if (useDarkTheme) {
            // Select dark theme icon
            newSrc = (useExpandedIcon ? "../common/itemExpandedDarkThemeIcon.png" : "../common/itemCollapsedDarkThemeIcon.png");
        } else {
            // Select light theme icon
            newSrc = (useExpandedIcon ? "../common/itemExpandedIcon.png" : "../common/itemCollapsedIcon.png") ;   
        }  
        return newSrc;        
    },
    
    getUid: function () {
        /// <summary>
        ///     This function returns a new unique identifier string for the dom explorer window
        /// </summary>
        /// <returns type="String">
        ///     A string representing the unique id
        /// </returns>
        
        return "uid" + (toolwindowHelpers.uid++).toString(36);
    }    
};

// Create the proxy for our communications
window.callProxy = function callProxy(command, args, callback) {
    /// <summary>
    ///     Sends a message to the remote side to execute an async function and optionally
    ///     return a result
    /// </summary>
    /// <param name="command" type="String">
    ///     The remote function command to call
    /// </param>
    /// <param name="args" type="Array" optional="true">
    ///     An optional array of arguments to pass to the remote function
    /// </param>
    /// <param name="callback" type="Function" optional="true">
    ///     An optional callback function to trigger when the async result is recieved
    /// </param>
        
    // Generate a unique id to track this transaction
    var uidString = toolwindowHelpers.getUid();
    
    if (callback) {
        // Only create a callback object if there is something that will be called back
        toolwindowHelpers.callbacks[uidString] = { synced: true, callback: callback || $.noop };
    }
    
    var newArgs = $.map(args || [], function (arg) {
        if (typeof (arg) === "function") {
            var callbackuid = toolwindowHelpers.getUid();
            toolwindowHelpers.callbacks[callbackuid] = { synced: false, callback: arg };

            return { uid: callbackuid,
                type: "callback"
            };

        } else {
            return arg;
        }
    });
    var jsonObj = {
        uid: uidString,
        command: command,
        args: newArgs
    };

    var sendMessageToRemote = function (message) {
        // Ensure that we have a port to send the message to as we may have disconnected
        if (toolwindowHelpers.remotePort) {
            // Send the message via the run time remote port
            toolwindowHelpers.remotePort.postMessage(message);
        }
    };
            
    toolwindowHelpers.pendingMessages.push(jsonObj);
    if (!toolwindowHelpers.pendingTimeout) {
        toolwindowHelpers.pendingTimeout = setTimeout(function () {
            var message = JSON.stringify(toolwindowHelpers.pendingMessages);
            toolwindowHelpers.pendingMessages = [];
            toolwindowHelpers.pendingTimeout = null;
            sendMessageToRemote(message);
        }, 0);
    }
};

window.callProxy.fireCallbacks = function (data) {
    var msgs = JSON.parse(data);
    for (var i = 0; i < msgs.length; i++) {
        var obj = msgs[i];
        if (toolwindowHelpers.callbacks[obj.uid]) {
            if (obj.args !== undefined) {
                toolwindowHelpers.callbacks[obj.uid].callback.apply(this, obj.args);
            }
            if (toolwindowHelpers.callbacks[obj.uid].synced) {
                delete toolwindowHelpers.callbacks[obj.uid];
            }
        } else if (obj.uid === "scriptError") {
            // Fire the script error handler
            window.reportError(obj.args[0].message, obj.args[0].file, obj.args[0].line, obj.args[0].additionalInfo);
        }
    }
};

window.reportError = function (message, file, line, additionalInfo) {
    /// <summary>
    ///     Handles JavaScript errors in the toolwindows by reporting them as non-fatal errors
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
    
    var externalObj;
    if (window.parent.getExternalObj) {
        // Hosted in an IFRAME, so get the external object from there
        externalObj = window.parent.getExternalObj();
    } else if (window.external) { 
        // Hosted in Visual Studio
        externalObj = window.external;
    }
    
    // Add additional vs side information
    var info = [];
    try {
        info.push(additionalInfo);
        info.push("atBreakpoint: " + toolwindowHelpers.atBreakpoint);
        info.push("Stored Callbacks: " + JSON.stringify(toolwindowHelpers.callbacks));
        info.push("Pending Messages: " + JSON.stringify(toolwindowHelpers.pendingMessages));
    } catch (ex3) {
        // Fail gracefully
    }
    var finalInfo = info.join("\r\n\r\n");
    
    if (externalObj) {
        // Code in this function is commented out to stop the error from being displayed to the user for release,
        // If we need this this functionality again, the code can be un-commented.
        
        // Store the script error for later use
        ////window.lastScriptError = {message: message, file: file, line: line};
        
        // Report the NFE to the watson server
        var component = (window.errorComponent ? window.errorComponent : "Common");
/*+VWD
        externalObj.reportNonFatalError(component, message, file, line, finalInfo);
-VWD*/
        externalObj.reportNonFatalError(component, message, file, line);

        // Display a warning message to the user
        ////if (window.errorDisplayHandler) {
        ////    window.errorDisplayHandler(message, file, line, finalInfo);
        ////}
    }
 
};

window.onerror = function (message, file, line) {
    /// <summary>
    ///     Handles JavaScript errors in the toolwindows by reporting them as non-fatal errors
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
    /// <returns type="Boolean">
    ///     Returns true to mark the error as handled, False to display the default error dialog
    /// </returns>

    // The maximum callstack size to collect
    var maxStackSize = 10;

    var getArgumentString = function (argument) {
        /// <summary>
        ///     Gets a string representing the value of the passed in argument.
        ///     This supliments the built in typeof function by calculating the type of certain objects such as
        ///     array, date, and regex
        /// </summary>    
        /// <param name="argument" type="Object">
        ///     The argument to get the value of
        /// </param>
        /// <returns type="String">
        ///     A string representing the value of this argument
        /// </returns>            
        /// <disable>JS3053.IncorrectNumberOfArguments,JS2005.UseShortFormInitializations</disable>
        var type = (typeof argument);

        // Check for undefined
        if (argument === undefined) {
            type = "undefined";
        } else {
            // Check for object type
            if (type === "object") {
                if (argument) {
                    if (typeof argument.length === "number" && typeof argument.propertyIsEnumerable === "function" && !(argument.propertyIsEnumerable("length")) && typeof argument.splice === "function") {
                        type = "array";
                    }
                    try {
                        if (argument.constructor === (new Array()).constructor) {
                            type = "array";
                        } else if (argument.constructor === (new Date()).constructor) {
                            type = "date";
                        } else if (argument.constructor === (new RegExp()).constructor) {
                            type = "regex";
                        }
                    } catch (e) {
                        // This object is not accessible
                    }
                } else {
                    type = "null";
                }
                type = "object";
            }
    }
    
        switch (type) {
            case "boolean":
                return argument;

            case "date":
                return "[date] " + argument;

            case "function":
                return "" + argument;

            case "null":
                return "null";

            case "number":
                return argument;

            case "regex":
                return "[regex] " + argument;

            case "string":
                return "\"" + argument + "\"";

            case "undefined":
                return "undefined";
                
            case "htmlElement":
            // FALLTHROUGH
            case "array":
            // FALLTHROUGH
            case "object":
                return JSON.stringify(argument);
        }

    };

    // Generate the callstack information
    var callstack = [];
    try {
        var currentFunction = arguments.callee;
        var functionText, functionName, match, args, stringifiedArgs;
        
        // Loop up the caller chain
        while (currentFunction && callstack.length < maxStackSize) {
            
            // Set default values
            functionName = "unknown";
            stringifiedArgs = [];
            
            try {
                // Get the function name
                functionText = currentFunction.toString() || "";
                match = functionText.match(/function\s*([\w\-$]+)?\s*\(/i);
                functionName = (match.length >= 2 ? match[1] || "anonymous" : "anonymous");

                // Get the arguments
                if (currentFunction["arguments"]) {
                    args = currentFunction["arguments"];
                    for (var i = 0; i < args.length; i++) {
                        stringifiedArgs.push(getArgumentString(args[i]));
                    }
                }                       
            } catch (ex) {
                // Fail gracefully
            }
            
            // Add this info to the callstack
            callstack.push(functionName + " (" + stringifiedArgs.join(", ") + ")");
            
            // Walk up the stack
            currentFunction = currentFunction.caller;
        }
    } catch (ex2) {
        // Fail gracefully
    }
    
    // Populate the additional information
    var info = [];
    try {
        info.push("Callstack:\r\n" + callstack.join("\r\n"));
    } catch (ex3) {
        // Fail gracefully
    }
    
    window.reportError(message, file, line, info);
    return true;
};


// SIG // Begin signature block
// SIG // MIIaYgYJKoZIhvcNAQcCoIIaUzCCGk8CAQExCzAJBgUr
// SIG // DgMCGgUAMGcGCisGAQQBgjcCAQSgWTBXMDIGCisGAQQB
// SIG // gjcCAR4wJAIBAQQQEODJBs441BGiowAQS9NQkAIBAAIB
// SIG // AAIBAAIBAAIBADAhMAkGBSsOAwIaBQAEFKHJolItO7gU
// SIG // McKFRDezNXbtKe7+oIIVLTCCBKAwggOIoAMCAQICCmEZ
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
// SIG // zjEp/w7FW1zYTRuh2Povnj8uVRZryROj/TGCBKEwggSd
// SIG // AgEBMIGHMHkxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpX
// SIG // YXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYD
// SIG // VQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xIzAhBgNV
// SIG // BAMTGk1pY3Jvc29mdCBDb2RlIFNpZ25pbmcgUENBAgph
// SIG // GcyTAAEAAABmMAkGBSsOAwIaBQCggc4wGQYJKoZIhvcN
// SIG // AQkDMQwGCisGAQQBgjcCAQQwHAYKKwYBBAGCNwIBCzEO
// SIG // MAwGCisGAQQBgjcCARUwIwYJKoZIhvcNAQkEMRYEFIIu
// SIG // jHtTfuYS2osjb0VSUU+ZJQXgMG4GCisGAQQBgjcCAQwx
// SIG // YDBeoESAQgBNAGkAYwByAG8AcwBvAGYAdAAgAFYAaQBz
// SIG // AHUAYQBsACAAUwB0AHUAZABpAG8AIABXAGUAYgAgAFQA
// SIG // bwBvAGwAc6EWgBRodHRwOi8vd3d3LmFzcC5uZXQvIDAN
// SIG // BgkqhkiG9w0BAQEFAASCAQCpo0cVk6fBAc9YlLFYLeHp
// SIG // 2DJuLpr4eh3dYC4GiQ565pQlPJDlqLPbM2OuHY3XtQtD
// SIG // 25Rf/4Uu5jAfxy3inHZh30z+wWQrsRMAvQRoMOYuJ7cv
// SIG // nonyw2nmzrKCmAAj6/E8VAW37gvQikRjTDNscI1hhQwC
// SIG // zsd+a2AyC/pp6JLS7P9XkcSmD0gYlF+KnvqXQf6kSvDC
// SIG // uuDqBBnu08CtI6mSVfDumtQnphEw64M2lhR6N9LrtgxI
// SIG // 31XbNDbICrAJa4Z1NXf7LmrMjNxyoAP0wsybC0ZVXFrd
// SIG // +/WgCNUCvcyTb6HOgqJ42GEoY1gLx6t78Ezq7mBBum92
// SIG // jtIRAk1NNseKoYICHTCCAhkGCSqGSIb3DQEJBjGCAgow
// SIG // ggIGAgEBMIGFMHcxCzAJBgNVBAYTAlVTMRMwEQYDVQQI
// SIG // EwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4w
// SIG // HAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xITAf
// SIG // BgNVBAMTGE1pY3Jvc29mdCBUaW1lLVN0YW1wIFBDQQIK
// SIG // YQUZlgAAAAAAGzAHBgUrDgMCGqBdMBgGCSqGSIb3DQEJ
// SIG // AzELBgkqhkiG9w0BBwEwHAYJKoZIhvcNAQkFMQ8XDTEy
// SIG // MDcxMDIxMzgzOFowIwYJKoZIhvcNAQkEMRYEFHBD8xIK
// SIG // uOB4jc8UudHCyKcnLkFzMA0GCSqGSIb3DQEBBQUABIIB
// SIG // AHSMRmk0/4dlTx5ZAl2j1YdbMgp93hHfRBOfGkjpZ0n6
// SIG // c9COn5BQSaCbXXZTV1b8JNsZ44qLjjZIIxRy3h4h3ywH
// SIG // QB4wvnb71mZ7teBPTw2dCFU37asfZYqTOSbcII5Abs5A
// SIG // q6B+FXexis+ScDzaNekzJACWSav/pWYtSRt7Eu6ET8b3
// SIG // Smo30wph5WoihcdFczGKWfnzMJzAAvzCXmCk+7QPLll6
// SIG // tUM/0Z0h7+l/znr7UlEiUEyP0KfNOHduoTPlqRUKX94c
// SIG // wSLxgCwA7Abt/ENn67/hCRm6r9mmsJPgITMffu6rhcq1
// SIG // U8xNWIdvazJXaGxRMNgV7xhbYlUGTKUYJp0=
// SIG // End signature block
