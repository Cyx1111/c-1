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
/*+VWD
        return (toolUI.getBreakFlags() === 0);
-VWD*/
//+VWD
        return true;
//-VWD
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
//                remoteHelpers.pendingTimeout = mainBrowser.setTimeout(remoteHelpers.postAllMessages, 50);
		remoteHelpers.pendingTimeout = mainBrowser.document.parentWindow.setTimeout(remoteHelpers.postAllMessages, 50);
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

//+VWD
    // Returns true if the given attribute name should be ignored by the DOM explorer
    ignoreAttributeName: function (attrName) {
        if (attrName == "__id") {
            return true;
        }
        return false;
    },
//-VWD    
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
//+VWD
                        if (htmlTreeHelpers.ignoreAttributeName(element.attributes[i].name)) {
                            continue;
                        }
//-VWD
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

/*+VWD
                var elementText = element.textContent;
-VWD*/
//+VWD
                var elementText = "";

                // Needed for IE conditional comments.
                try {
                    elementText = element.textContent;
                }
                catch(e) {
                }
//-VWD                
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
                    parentUid: element.parentNode.uniqueID // Text nodes need to remember their parent
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
// SIG // MIIaYgYJKoZIhvcNAQcCoIIaUzCCGk8CAQExCzAJBgUr
// SIG // DgMCGgUAMGcGCisGAQQBgjcCAQSgWTBXMDIGCisGAQQB
// SIG // gjcCAR4wJAIBAQQQEODJBs441BGiowAQS9NQkAIBAAIB
// SIG // AAIBAAIBAAIBADAhMAkGBSsOAwIaBQAEFNjwxYYLIW7S
// SIG // IGRFUgqDhPnSYOddoIIVLTCCBKAwggOIoAMCAQICCmEZ
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
// SIG // MAwGCisGAQQBgjcCARUwIwYJKoZIhvcNAQkEMRYEFBzO
// SIG // 6tFjmlFL6efampg90qlZ9ALBMG4GCisGAQQBgjcCAQwx
// SIG // YDBeoESAQgBNAGkAYwByAG8AcwBvAGYAdAAgAFYAaQBz
// SIG // AHUAYQBsACAAUwB0AHUAZABpAG8AIABXAGUAYgAgAFQA
// SIG // bwBvAGwAc6EWgBRodHRwOi8vd3d3LmFzcC5uZXQvIDAN
// SIG // BgkqhkiG9w0BAQEFAASCAQC77z1b4l+AVuBw3rHOgJ3Z
// SIG // GRe4mKpmobFvDXRmD6hL2l7PrmUbvd7AN9WIgoWNtOBn
// SIG // +vKHCmcvLtOGsSMOG4Hy/kSfarhk9r/aywntSjMtD/hX
// SIG // eeiC6QgnK9ibGD8pNypAOVxXZJHUpMj0KQ55FHC2a5R/
// SIG // 1fIGWdPpQiKGWWYfvF3opdEIVWzb2YER2jKPfmE/LpN8
// SIG // gH1+37EmI9pOSAFrdJlW1g+476fDiiIskP8hCXVU4gu/
// SIG // /K8WNo5UrAeJpfr/nN0DbMAp7mErqxAF84s5G4eI/7tJ
// SIG // lw/gF1tl8RC8IIsqHG7YQO/bmoFIq3nk4uYv/1YFP9N3
// SIG // xDcEtLdDsrC1oYICHTCCAhkGCSqGSIb3DQEJBjGCAgow
// SIG // ggIGAgEBMIGFMHcxCzAJBgNVBAYTAlVTMRMwEQYDVQQI
// SIG // EwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4w
// SIG // HAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xITAf
// SIG // BgNVBAMTGE1pY3Jvc29mdCBUaW1lLVN0YW1wIFBDQQIK
// SIG // YQUZlgAAAAAAGzAHBgUrDgMCGqBdMBgGCSqGSIb3DQEJ
// SIG // AzELBgkqhkiG9w0BBwEwHAYJKoZIhvcNAQkFMQ8XDTEy
// SIG // MDcxMDIxMzgzOFowIwYJKoZIhvcNAQkEMRYEFMkrTSwk
// SIG // zCmKgMHWz6uUBa0YCdQyMA0GCSqGSIb3DQEBBQUABIIB
// SIG // ACyHa5/rKWHydo/FNAK9wioaT9fQW4wdQBqrX8QMX7b2
// SIG // giQ4wbKTDG6A2iU9qpuZOVXVx/xA4DteNwZuIPYZ8m5w
// SIG // lFCawm4dhJTKplszM65rD1YVftsNDePmRCt7VvkZUHAM
// SIG // mk0QdK1a6ktAVtfzoQbtvByzgignexCY+US3EW5+f8cm
// SIG // +LITMzvBtczpzu0wZhtziPxHj0oQTKxQL1sVIIa00dEy
// SIG // W0qob/ynTY8UHi85lgUB1HuXVEbZTd9019OInNniAYD7
// SIG // 2KezT2XBKPnVIKjnLMiD8TDYmMJBFTd1csSti8vtlmt1
// SIG // 8Ip6z6B4pbBCagWI4FZrO8quinVCf0HvxTk=
// SIG // End signature block
