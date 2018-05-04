// Expected global variables:
/*global domHelper mainBrowser messageHandlers toolUI */

// Allow 'eval' for debugging code execution 
/*jshint evil: true*/

var htmlTreeHelpers;
var remoteHelpers = {
    // The queue of messages ready for sending to the VS side
    pendingMessages: [],
    
    // The map of messages ready for sending to the VS side, which is used by messages
    // that can quickly become stale and can be replaced.
    pendingMessagesMap: {},
    
    // The timeout for batching up messages to send to the VS side
    pendingTimeout: null,

    useTimeout: function remoteHelpers$useTimeout() {
        return (toolUI.getBreakFlags() === 0);
    },
    
    // The communication port that is talking to the console
    port: null,
    portId: 0,
    portReady: false,
    onDetachCallback: null,
    
    // Initialization counters
    initializeDocumentMaxTries: 15,
    initializeDocumentTries: 0,
    
    // The number of elements to retrieve for GetChildren before the 'show all' link is shown
    childrenElementLimit: 200,
    
    // Current unique id, we increment this so we can uniquely identify items
    uid: 0,
    
    // Flags indicating if the eval/execScript functions have been modified (for NFE reporting)
    isEvalModified: false,
    isExecScriptModified: false,
    
    initialize: function remoteHelpers$initialize(portName, handshakeCallback, windowShouldHave, onDetachCallback) {
        /// <summary>
        ///     This method initializes the communication port for the remote side
        /// </summary>
        /// <param name="portName" type="String">
        ///     An identifying name to give to the port
        /// </param>    
        /// <param name="handshakeCallback" type="Function">
        ///     A function to call when the port is created successfully so that it can post 
        ///     initial information to the VS side
        /// </param>     
        /// <param name="windowShouldHave" type="String">
        ///     A property which should be defined on the window object of a page if 
        ///     BeforeScriptExecute was called.  If the window does not have this property
        ///     during DocumentComplete, execScript("void(0);"); will be called to 
        ///     cause a script engine to be created and BeforeScriptExecute to be fired.
        /// </param>
        /// <param name="onDetachCallback" type="Function" optional="true">
        ///     The function to call when the diagnostics detach from a process
        /// </param>        
        remoteHelpers.windowShouldHave = windowShouldHave;

        // Listen for the DocumentComplete event
        mainBrowser.addEventListener("DocumentComplete", remoteHelpers.onDocumentComplete);

        remoteHelpers.onDetachCallback = onDetachCallback;
        
        // Listen for the detach event
        toolUI.addEventListener("detach", remoteHelpers.onDetach);
        toolUI.addEventListener("breakpointhit", remoteHelpers.onBreak);
        
        remoteHelpers.portId++;
        remoteHelpers.port = toolUI.createPort(portName + remoteHelpers.portId);
        if (remoteHelpers.port) {
            remoteHelpers.port.addEventListener("message", remoteHelpers.processMessages);
            toolUI.connect(remoteHelpers.port);
            handshakeCallback();
        }
        remoteHelpers.handshakeCallback = handshakeCallback;
    },

    initializeScriptEngines: function remoteHelpers$initializeScriptEngines(window) {
        /// <summary>
        ///    This method is called on initial attach and runs "void(0);" on each 
        ///    window in the page recursively to make sure they have a script engine 
        ///    available for use. This is necessary so that our tooling can work 
        ///    against pages with no script and therefore no engine for us to talk
        ///    to.
        /// </summary>
        /// <param name="window" type="Object">
        ///     The window to start initializing engines from.
        /// </param>

        if (window) {
            // Ideally, we'd only call execScript in cases where no script had been executed.  Since
            // there's not a straightforward way of checking that, instead check the document for 
            // script blocks.  This will still result in some unnecessary execScript's, but will 
            // ensure that we do in fact call it in all necessary situations.  
            if (window.document && window.document.scripts && window.document.scripts.length === 0) {
                window.execScript("void(0);");
            }

            // Use recursion to ensure we have a script engine for each page
            if (window.frames) {
                for (var i = 0; i < window.frames.length; i++) {
                    var frame = window.frames[i];
                    if (frame) {
                        var iframe = domHelper.getCrossSiteWindow(window, frame);
                        remoteHelpers.initializeScriptEngines(iframe);
                    }
                }        
            }
        }
    },

    onDocumentComplete: function remoteHelpers$onDocumentComplete(dispatchWindow) {
        /// <summary>
        ///     This method is called whenever the page is ready.  Most of the time 
        ///     we rely on onBeforeScriptExecute, but on pages without script we don't 
        ///     receive that event.
        /// </summary>   
        /// <param name="dispatchWindow" type="Object">
        ///     The IDispatch window that triggered the DocumentComplete event
        /// </param>
        if (remoteHelpers.windowShouldHave) {
            // Grab the document - IWebBrowser2 uses "Document" while 
            // IWebApplicationHost actually passes us the window which uses "document".
            var doc = null;
            if (dispatchWindow) {
                if (dispatchWindow.document) {
                    doc = dispatchWindow.document;
                } else if (dispatchWindow.Document) { 
                    doc = dispatchWindow.Document;
                }

                // No need to do anything if BeforeScriptExecute was fired                
                if (!doc || doc.parentWindow[remoteHelpers.windowShouldHave]) {
                    return;
                }
            
                try {
                    doc.parentWindow.execScript("void(0);");
                } catch (ex) {
                    // Ignore this document complete if the window is invalid.
                }
            }
        }
    },
    
    onDetach: function remoteHelpers$onDetach() {
        /// <summary>
        ///     This method is called when debugging is detached, so we can perform clean up
        /// </summary>
        
        remoteHelpers.uid = 0;
        remoteHelpers.pendingMessages = [];
        remoteHelpers.pendingMessagesMap = {};
        remoteHelpers.pendingTimeout = null;
        remoteHelpers.isEvalModified = false;
        remoteHelpers.isExecScriptModified = false;
        
        htmlTreeHelpers.reset();
        
        if (remoteHelpers.onDetachCallback) {
            remoteHelpers.onDetachCallback();
        }
    },    

    onBreak: function remoteHelpers$onBreak() {
        // If we've hit a breakpoint, our 'setTimeouts' from this chain of execution won't be processed until after
        // we resume or finish executing the current event, so post messages now to make sure they make it over
        // to VS.  This means, for instance, we'll post over messages that occur when the page logs and the user
        // hits F10 (step over).
        remoteHelpers.postAllMessages();
    },
    
    getUid: function remoteHelpers$getUid() {
        /// <summary>
        ///     Get a unique identifier that can be used in the remote script
        /// </summary>
        /// <returns type="String">
        ///     The unique id
        /// </returns>
        
        // Convert the 'uid' into a string using radix 36 (0-9, a-z)
        return "uid" + (remoteHelpers.uid++).toString(36);    
    },    

    processMessages: function remoteHelpers$processMessages(msg) {
        /// <summary>
        ///     This method is called back when the VS console has posted a message to the remote side
        /// </summary>
        /// <param name="msg" type="String">
        ///     The message string that was sent.
        ///     This function expects the string to be in the form of a JSON stringified object with the following format:
        ///     { type: int, id: "string", data: { object } };
        /// </param>

        if (msg.data === "InitializeDocument") {
            remoteHelpers.handshakeCallback();
            return;
        }
        
        var createVSPostFunction = function remoteHelpers$processMessages$createVSPostFunction(uid) {
            // If this function is used on this remote side it will post over to the VS side
            return function remoteHelpers$processMessages$createVSPostFunction$createdFunction(arg, hash) {
                remoteHelpers.postObject({
                    uid: uid,
                    args: [arg]
                }, hash, true);
            };
        };
        
        var messages = JSON.parse(msg.data);
        
        for (var i = 0; i < messages.length; i++) {
            var obj = messages[i];
            
            // Check that our generic handler has a corresponding function for this message
            if (messageHandlers[obj.command]) {
            
                // Check the arguments for any callback functions
                var args = obj.args;
                for (var j = 0; j < args.length; j++) {
                    if (args[j] && args[j].type === "callback") {
                        // This argument is a callback function on the VS side, so we need to wrap it into
                        // a function that we can use on this remote side (which will just post the result to the VS side).
                        args[j] = createVSPostFunction(args[j].uid);
                    }
                }

                // Call the method that the VS side requested with the arguments that were passed in
                var returnValue = messageHandlers[obj.command].apply(this, args);
                
                // Post the return result back to the VS side
                remoteHelpers.postObject({
                    uid: obj.uid,
                    args: (returnValue !== undefined ? [returnValue] : undefined)
                });
            }
        }
    },
    
    postObject: function remoteHelpers$postObject(obj, hash, isFromCallBack) {
        /// <summary>
        ///     This method packages up an object ready to be sent to the VS side code
        ///     It uses a 2 queues to batch up postmessages instead of sending every message instantly to improve performance
        ///     by not sending redundant messages that may quickly get out of date
        /// </summary>
        /// <param name="obj" type="Object">
        ///     The message object to send to the VS side
        /// </param>        
        /// <param name="hash" type="String" optional="true">
        ///     Optional string that specifies an id used in the mapped queue
        ///     Any message already in the map with the same hash will be overwritten with this new obj value
        ///     This is used for messages that are not critical and can quickly become stale so we only send the freshest one
        /// </param>
        /// <param name="isFromCallBack" type="Boolean" optional="true">
        ///     Optional parameter that specifies if the posting is being done from a callback,
        ///     True if the post is called from a callback function which will apply a 50ms batch timer, False if the post
        ///     is called as a return from a remote function call, which will avoid the batch timer.    
        /// </param>
        
        // If it contains a hash then it can be superceded by a later message
        if (hash) {
            // Replace any existing message with the new object
            remoteHelpers.pendingMessagesMap[hash] = obj;
        } else {
            // Just add this message to our queue
            remoteHelpers.pendingMessages.push(obj);
        }

        // If we don't have a pending timeout to dispatch the queued up messages, create it now
        if (remoteHelpers.useTimeout() && isFromCallBack) {
            if (!remoteHelpers.pendingTimeout) {
                remoteHelpers.pendingTimeout = mainBrowser.setTimeout(remoteHelpers.postAllMessages, 50);
            }
        } else {
            // Call the post directly
            remoteHelpers.postAllMessages();
        }
    },
    
    postAllMessages: function remoteHelpers$postAllMessages() {
        /// <summary>
        ///     Sends all queued messages to the VS side
        /// </summary>
        
        // Add all the messages in our dictionary to our pending messages.
        for (var key in remoteHelpers.pendingMessagesMap) {
            remoteHelpers.pendingMessages.push(remoteHelpers.pendingMessagesMap[key]);
        }
        
        // Only send messages if we have some
        if (remoteHelpers.pendingMessages.length > 0) {
            // Generate the message that we will post
            var messageString = JSON.stringify(remoteHelpers.pendingMessages);
            
            // Clear the message queues
            remoteHelpers.pendingMessages = [];
            remoteHelpers.pendingMessagesMap = {};
            remoteHelpers.pendingTimeout = null;
            
            // Send the message to the VS side
            remoteHelpers.port.postMessage(messageString);
        }
    }
};

htmlTreeHelpers = {
    // Max text length of 'inlined' text elements before they need to be expanded to show the text element child
    maxInlineLength: 70,
      
    // Maps uid's to DOM elements
    mapping: {},
    
    // CSS Class that the DOM Explorer ignores (for things like overlays and highlights)
    ignoreStyleClass: "BPT-DomExplorer-Ignore",
    
    reset: function htmlTreeHelpers$reset() {
        /// <summary>
        ///     Reset settings back to their original values
        /// </summary>

        // Remove any existing event handlers
        for (var uid in htmlTreeHelpers.mapping) {
            htmlTreeHelpers.deleteMappedNode(uid);
        }

        htmlTreeHelpers.mapping = {};
    },
    
    createMappedNode: function htmlTreeHelpers$createMappedNode(element, showEmptyTextElements) {
        /// <summary>
        ///     Constructs a js object we can serialize and send over to the VS side
        /// </summary>
        /// <param name="element" type="Object">
        ///     The javascript string that is to be evaled on the associated script engine
        /// </param>
        /// <param name="showEmptyTextElements" type="Boolean" optional="true">
        ///     Optional parameter that specifies if we should map empty text nodes
        /// </param>
        /// <returns type="Object">
        ///     The constructed javscript object that is ready to be stringified and sent over to VS
        /// </returns>
       
        // Shortcut empty text elements because we never show them in the DOM
        if (!element.tagName && (typeof element.textContent === "string") && !element.textContent.replace(/^\s+|\s+$/g, "") && !showEmptyTextElements) {
            // We return null because this node should never be shown in the UI, so there is no need to map it
            return null;
        }
            
        // Create the uid for this element
        var uidString = remoteHelpers.getUid();
        var obj, isIframeElement;
        
        // Document elements must be special cased
        if (element.nodeType === element.DOCUMENT_NODE || element.nodeType === element.DOCUMENT_FRAGMENT_NODE) {

            // Create the viewable object
            obj = {
                uid: uidString,
                tag: "#document",
                hasChildren: true,
                text: null,
                rootTag: element.nodeName
            };
        } else {
        
            // Create a normal node
            if (element.tagName) {
                // This is a non-text node
                var textContent = null;
                var hasChildren = (element.childNodes.length > 0);
                     
                if (element.nodeName === "STYLE") {
                    // Style nodes should use the styleSheet as a child
                    hasChildren = true;
                    var text = (element.styleSheet ? element.styleSheet.cssText : element.textContent);
                    
                    if (!text.replace(/^\s+|\s+$/g, "")) {
                        hasChildren = false;
                    } else if (!text.match(/\n/g) && text.length < htmlTreeHelpers.maxInlineLength) {
                        hasChildren = false;
                        textContent = text;
                    }
                    
                } else if (element.childNodes.length === 1) {
                    // Since we only have a single child element, we need to process it further
                    var child = element.childNodes[0];
                    
                    // Check to see if it is a text node
                    if (!child.tagName && child.textContent) {

                        // Remove white space and see if it is an empty text node, which we never display
                        if (!child.textContent.replace(/^\s+|\s+$/g, "")) {
                            hasChildren = false;
                        } else if (!child.textContent.match(/\n/g) && child.textContent.length < htmlTreeHelpers.maxInlineLength) {
                            hasChildren = false;
                            textContent = child.textContent;
                        }
                        
                    }
                }
               
                // Check to see if this is an IFRAME element
                if (element.tagName === "IFRAME") {
                    isIframeElement = true;
                    hasChildren = true; // IFRAME elements always have a document child
                }

                // Non-text nodes need to have attributes
                var attributes = [];
                if (element.attributes) {
                    // Create a name/value pair for each attribute and add it to the array
                    for (var i = 0; i < element.attributes.length; i++) {
                        attributes.push({
                            name: element.attributes[i].name,
                            value: element.attributes[i].value
                        });
                    }
                }
                
                // Create the viewable object
                obj = {
                    uid: uidString,
                    tag: element.tagName.toLowerCase(),
                    hasChildren: hasChildren,
                    text: textContent,
                    attributes: attributes
                };
                
            } else {
                // This is a text node
                
                // Check for comment nodes
                var tagName = null;
                var elementText = element.textContent;
                
                if (element.nodeType === element.DOCUMENT_TYPE_NODE) {
                    tagName = "#doctype";
                    
                    // Build the DOCTYPE text
                    var docTypeText = "<!DOCTYPE " + element.nodeName;
                    if (element.publicId) {
                        docTypeText += " PUBLIC \"" + element.publicId + "\"";
                        if (element.systemId) {
                            docTypeText += " \"" + element.systemId + "\"";
                        }
                    } else if (element.systemId) {
                        docTypeText += " SYSTEM \"" + element.systemId + "\"";
                    }
                    if (element.internalSubset) {
                        docTypeText += " [" + element.internalSubset + "]";
                    }
                    docTypeText += ">";
                    elementText = docTypeText;
                    
                } else if (element.nodeType === element.COMMENT_NODE) {
                    tagName = "#comment";
                }
                
                // Create the viewable object
                obj = {
                    uid: uidString,
                    tag: tagName,
                    hasChildren: false,
                    text: elementText,
                    parentUid: (element.parentNode ? element.parentNode.uniqueID : "") // Text nodes need to remember their parent if they have one
                };
            }
        }
        
        
        // Store this element in the map
        htmlTreeHelpers.mapping[uidString] = {
            ele: element,
            isIframeElement: isIframeElement,
            mapped: obj
        };
        
        // Check to see if this need special value handling
        if (htmlTreeHelpers.hasSpecialValueAttribute(element)) {
            htmlTreeHelpers.mapping[uidString].hasValueAttribute = element.hasAttribute("value");
        }
        
        // Return the created object
        return obj;
    },
    
    getChildrenForMappedNode: function htmlTreeHelpers$getChildrenForMappedNode(uid, showEmptyTextElements) {
        /// <summary>
        ///     Get all the child elements from a particular mapped DOM element
        /// </summary>
        /// <param name="uid" type="String">
        ///     The mapped unique id of the DOM element we want to get the children of
        /// </param>    
        /// <param name="showEmptyTextElements" type="Boolean" optional="true">
        ///     Optional parameter that specifies if we should map empty text nodes
        /// </param>        
        /// <returns type="Array">
        ///     An array of mapped nodes that represent the children of the DOM element
        /// </returns> 
        
        // Ensure we have already mapped the requested DOM element
        var mappedNode = htmlTreeHelpers.mapping[uid];
        if (!mappedNode || !htmlTreeHelpers.isElementAccessible(mappedNode.ele)) {
            return;
        }
        
        // Style nodes should emulate a text node child
        if (mappedNode.ele.nodeName === "STYLE") {
            return [{
                uid: "style" + uid,
                parentUid: uid,
                tag: null,
                hasChildren: false,
                text: (mappedNode.ele.styleSheet ? mappedNode.ele.styleSheet.cssText : mappedNode.ele.textContent)
            }];
        }

        // Get the actual element
        var element = (mappedNode.isIframeElement ? htmlTreeHelpers.getIframeRootForMappedNode(uid) : mappedNode.ele);
        var childNodes = (mappedNode.listType ? element : element.childNodes);

        var newlyMappedChildren = [];
        for (var i = 0; i < childNodes.length; i++) {
            // Ignore the hover class
            if (childNodes[i].className && 
                (typeof childNodes[i].className === "string") && 
                childNodes[i].className.indexOf(htmlTreeHelpers.ignoreStyleClass) !== -1) { 
                continue;
            }
            
            // Create the mapped child node
            var mappedChild = htmlTreeHelpers.createMappedNode(childNodes[i], showEmptyTextElements);
            if (mappedChild) {
                newlyMappedChildren.push(mappedChild);
            }
        }

        mappedNode.isLimited = (newlyMappedChildren.length > remoteHelpers.childrenElementLimit);

        // If we have gotten the children before, we need to go through it and remove the old mutation events
        if (mappedNode.childrenNodes) {
            for (var j = 0; j < mappedNode.childrenNodes.length; j++) {
                htmlTreeHelpers.deleteMappedNode(mappedNode.childrenNodes[j].uid);
            }
        }
        
        // Store the children in the mapping for this DOM element
        mappedNode.childrenNodes = newlyMappedChildren;
        
        // Since we have requested the children, the node is expanded
        mappedNode.isExpanded = true;
        
        // Return the children array
        return newlyMappedChildren;    
    },
    
    deleteMappedNode: function htmlTreeHelpers$deleteMappedNode(uid, onlyChildren) {
        /// <summary>
        ///     Detaches any DOM Manipulation events and removes it from the mapping (along with any children nodes)
        /// </summary>
        /// <param name="uid" type="String">
        ///     The unique identifier of the DOM element to delete
        /// </param>
        /// <param name="onlyChildren" type="Boolean" optional="true">
        ///     Optional parameter that specifies if we should only remove the children, and not the element itself
        /// </param>
        
        var mappedNode = htmlTreeHelpers.mapping[uid];
        if (mappedNode) {

            // Remove the children
            if (mappedNode.childrenNodes) {
                for (var i = 0; i < mappedNode.childrenNodes.length; i++) {
                    htmlTreeHelpers.deleteMappedNode(mappedNode.childrenNodes[i].uid, false);
                }
                mappedNode.childrenNodes = null;
            }
            
            // Remove the node itself
            if (!onlyChildren) {
                try {
                    // Remove the onPropertyChange event listeners
                    if (mappedNode.onValueModified) {
                        mappedNode.ele.detachEvent("onpropertychange", mappedNode.onValueModified);
                    }
                } catch (ex) {
                    // This will fail if we are trying to remove event listeners from the previous page after a navigate
                    // So fail gracefully.
                }
                delete htmlTreeHelpers.mapping[uid];
            } else {
                mappedNode.isExpanded = false;
            }
        }
    },
    
    getIframeRootForMappedNode: function htmlTreeHelpers$getIframeRootForMappedNode(uid) {
        /// <summary>
        ///     Gets a cross domain safe iframe document from a mapped DOM element
        /// </summary>
        /// <param name="uid" type="String">
        ///     The unique identifier of the DOM element to get the iframe root for
        /// </param>
        /// <returns type="Object">
        ///     The iframe document element or null if there isn't one
        /// </returns> 
        
        // Ensure we have already mapped the requested DOM element
        var mappedNode = htmlTreeHelpers.mapping[uid];
        if (!mappedNode || !htmlTreeHelpers.isElementAccessible(mappedNode.ele)) {
            return null;
        }
        
        if (mappedNode.iframeRoot) {
            // Return the stored iframe root
            return mappedNode.iframeRoot;
        }
        
        // Check to see if this is an IFRAME element
        if (mappedNode.ele.tagName === "IFRAME") {
            var element = mappedNode.ele;
            var currentWindow = element.parentNode.ownerDocument.parentWindow;
            var iframe = domHelper.getCrossSiteWindow(currentWindow, element.contentWindow);
            mappedNode.iframeRoot = iframe.document;
            
            return mappedNode.iframeRoot;
        }
        
        // Not an iframe
        return null;
    },
    
    hasSpecialValueAttribute: function htmlTreeHelpers$hasSpecialValueAttribute(element) {
        /// <summary>
        ///     Gets whether the element uses the value attribute differently to other attributes
        /// </summary>
        /// <param name="element" type="Object">
        ///     The DOM element to check
        /// </param>
        /// <returns type="Boolean">
        ///     True if the element requires special value attribute handling, False otherwise
        /// </returns> 
        
        switch (element.nodeName) {
            case "INPUT":
            case "FORM":
            case "SELECT":
            case "OPTION":
            case "TEXTAREA":
            return true;
        }
        
        return false;
    },

    isElementAccessible: function htmlTreeHelpers$isElementAccessible(element) {
        /// <summary>
        ///     Gets whether the element throws an exception when attempting to access it
        /// </summary>
        /// <param name="element" type="Object">
        ///     The DOM element to check
        /// </param>
        /// <returns type="Boolean">
        ///     True if the element does not throw an exception, False otherwise
        /// </returns> 
        
        var elementType = null;
        var elementName = null;
        try {
            elementName = element.nodeName;
            elementType = (typeof element);
        } catch (ex) {
            // An exception is caused by the page already having navigated away, so return false
            return false;
        }

        return (elementType === "object");
    }
};

function onErrorHandler (message, file, line) {
    /// <summary>
    ///     Handles JavaScript errors in the remote code by reporting them as non-fatal errors
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

    if (remoteHelpers && remoteHelpers.port) {
        
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
            info.push("BreakFlags: " + toolUI.getBreakFlags());
            info.push("TicksSinceLastRefresh: " + toolUI.getTicksSinceLastRefresh());
            info.push("IsEvalModified: " + remoteHelpers.isEvalModified);
            info.push("IsExecScriptModified: " + remoteHelpers.isExecScriptModified);
            info.push("Url: " + mainBrowser.document.parentWindow.location.href);
        } catch (ex3) {
            // Fail gracefully
        }
        
        // Generate the message that we will post
        var errorObject = [{uid:"scriptError", args:[{message: message, file: file, line: line, additionalInfo: info.join("\r\n\r\n")}]}];
        var messageString = JSON.stringify(errorObject);
        
        // Send the message to the VS side
        remoteHelpers.port.postMessage(messageString);
            
        return true;
    }
    
    return false;
}

// Attach the script error handler
toolUI.addEventListener("scripterror", onErrorHandler);

// Detach the script error handler when we have been detached from the 'debuggee'
toolUI.addEventListener("detach", function remoteHelpers$toolUI$detachHandler() {
    toolUI.removeEventListener("scripterror", onErrorHandler);
});

// Initialize the script engines on all frames in case a frame doesn't have
// any script.
if (mainBrowser && mainBrowser.document && mainBrowser.document.parentWindow){
    remoteHelpers.initializeScriptEngines(mainBrowser.document.parentWindow);
}

// SIG // Begin signature block
// SIG // MIIaKwYJKoZIhvcNAQcCoIIaHDCCGhgCAQExCzAJBgUr
// SIG // DgMCGgUAMGcGCisGAQQBgjcCAQSgWTBXMDIGCisGAQQB
// SIG // gjcCAR4wJAIBAQQQEODJBs441BGiowAQS9NQkAIBAAIB
// SIG // AAIBAAIBAAIBADAhMAkGBSsOAwIaBQAEFJ+9oSS4Pzix
// SIG // ft2e5roOicGiHYFCoIIVFjCCBKAwggOIoAMCAQICCmEZ
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
// SIG // o/0xggSBMIIEfQIBATCBhzB5MQswCQYDVQQGEwJVUzET
// SIG // MBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVk
// SIG // bW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0
// SIG // aW9uMSMwIQYDVQQDExpNaWNyb3NvZnQgQ29kZSBTaWdu
// SIG // aW5nIFBDQQIKYRnMkwABAAAAZjAJBgUrDgMCGgUAoIGs
// SIG // MBkGCSqGSIb3DQEJAzEMBgorBgEEAYI3AgEEMBwGCisG
// SIG // AQQBgjcCAQsxDjAMBgorBgEEAYI3AgEVMCMGCSqGSIb3
// SIG // DQEJBDEWBBTma2hyctsqcum2SwAxyEcoi4rT5jBMBgor
// SIG // BgEEAYI3AgEMMT4wPKAigCAAcgBlAG0AbwB0AGUASABl
// SIG // AGwAcABlAHIAcwAuAGoAc6EWgBRodHRwOi8vbWljcm9z
// SIG // b2Z0LmNvbTANBgkqhkiG9w0BAQEFAASCAQAWV9G39gBc
// SIG // C+MI7P8IXRuJWWYFQoHlY5r01EFe2B6zVs4RuLeAhwnI
// SIG // jyZJYhPM95tH2/JqHgp3WXTBnJKl8529POityL/V1FmD
// SIG // f6+5slUhd3PbECv+FR+6xCgq2Q2b8GLZNh6prZV/ZKuz
// SIG // rO3eJbAJnYtOc7B/BsJBAgrWNzcyM8DuCzol+l0bvPM2
// SIG // kELumxDzDhdpTY7+O0wl2Y0kAx4LdT6U+GxRCzur/jlX
// SIG // ba+C9nKX6+GSfb51KhCnHcw1HthaD03s9v514mOLSk3A
// SIG // jzL1vq1PZIJQtcMRMurGnoAHEpbdufOBydHQj2kxuwOz
// SIG // 53mjUq2kLGrlEMy1KMWYGYHcoYICHzCCAhsGCSqGSIb3
// SIG // DQEJBjGCAgwwggIIAgEBMIGFMHcxCzAJBgNVBAYTAlVT
// SIG // MRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdS
// SIG // ZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9y
// SIG // YXRpb24xITAfBgNVBAMTGE1pY3Jvc29mdCBUaW1lLVN0
// SIG // YW1wIFBDQQIKYQ2vjQAAAAAAKDAJBgUrDgMCGgUAoF0w
// SIG // GAYJKoZIhvcNAQkDMQsGCSqGSIb3DQEHATAcBgkqhkiG
// SIG // 9w0BCQUxDxcNMTIwNzI3MDE0NjI2WjAjBgkqhkiG9w0B
// SIG // CQQxFgQUINta/ddqPt3w5FoWjqNg3t7YFOEwDQYJKoZI
// SIG // hvcNAQEFBQAEggEAhElnBnYAn8ikqeYyjN1kiFY+gviK
// SIG // ZIcBJUQMyFQzueDjFCFw/BomotLI5irPDNjMsmk2YbBU
// SIG // Nvopp8uKMkocwW1wpo4pDWIvyiaPhNdT4tGULItlQbsu
// SIG // gywazrdwU8QQBTPmRdqbYC9usAQcnH6GgMKl8AujrT3r
// SIG // yX6DZiwPo35OIRTXG+D41H8KlDBl/SazHO3kQTWjM9Sr
// SIG // I14S0UDQ0Vxz+sNPjZoo7coFX3zXlqXuqEcECYICGxQw
// SIG // Ez20L+IrTcTJRIDMYNHc0rupJJACRe+7g1AhDqu2y1iw
// SIG // x134aRsZtystFgeU48BYvIwiTYS91RKFG8VAemrFVJTw
// SIG // yU5A4A==
// SIG // End signature block
