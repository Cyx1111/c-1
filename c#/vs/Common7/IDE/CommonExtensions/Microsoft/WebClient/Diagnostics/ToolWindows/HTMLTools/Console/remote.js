// Expected global variables:
/*global consoleEvents consoleUtils domHelper htmlTreeHelpers mainBrowser onErrorHandler remoteHelpers styleHelper toolUI */

// Allow 'eval' for debugging code execution and leading underscores for invoke functions
/*jshint evil: true, nomen: false*/

var messageHandlers;
var remoteCode = {

    // A constant that defines the max number of items to traverse in an expandable tree object for each snapshot,
    // This number will be tweaked as development continues.
    maxItemTraverseCount: 500,

    // The queue of notification messages that have been received before the console is ready
    consoleNotificationQueue: [],

    // The current window that we are executing code against that can be changed with the cd command
    currentWindowContext: null,

    // A mapped set of stored results
    resultMap: {},

    initialize: function console$remoteCode$initialize() {
        /// <summary>
        ///     Gets the remote script code ready for use. 
        ///     Creates the console object and adds it to the page under diagnostic debugging and also sets up communication
        ///     with the VS side console
        /// </summary>

        // Listen for the before script execute event so we can insert our console object
        mainBrowser.addEventListener("BeforeScriptExecute", remoteCode.onBeforeScriptExecute);

        // Try to listen to console messages from IE
        try {
            consoleEvents.addEventListener("message", remoteCode.onConsoleMessage);
        } catch (e) {
            // Do nothing, we're on a version of IE that doesn't support console logging.
        }

        // Create a port
        remoteHelpers.initialize("ConsolePort", remoteCode.initializePage, "__VISUALSTUDIO_CONSOLE_BREAKMODE_FUNC");
    },

    initializePage: function console$remoteCode$initializePage() {
        /// <summary>
        ///     This method informs the Console that the remote side is ready
        ///     It sends the message over the communication port
        /// </summary>

        try {
            remoteCode.initializeConsoles(mainBrowser);
            remoteCode.currentWindowContext = mainBrowser.document.parentWindow;

            var connectionInfo = { docMode: mainBrowser.document.documentMode, contextInfo: mainBrowser.document.parentWindow.location.href };
            remoteHelpers.port.postMessage("Handshake:" + JSON.stringify(connectionInfo));

            // Reset the document timeout
            remoteHelpers.initializeDocumentTries = 0;
        } catch (e) {
            remoteCode.onDocumentNotReady();
        }
    },

    onDocumentNotReady: function console$remoteCode$onDocumentNotReady() {
        /// <summary>
        ///     This method should be called when the document is not yet ready for diagnostics to attach and populate.
        ///     It will increment the timeout counter and post back to the VS side asking for it to re-try the initialize call.
        /// </summary>

        if (remoteHelpers.initializeDocumentTries < remoteHelpers.initializeDocumentMaxTries) {
            remoteHelpers.initializeDocumentTries++;
            remoteHelpers.port.postMessage("DocumentNotYetReady");
        } else {
            onErrorHandler("Document timed out", "remote.js", 0);
        }
    },

    initializeConsoles: function console$remoteCode$initializeConsoles(windowToAttach) {
        /// <summary>
        ///     Recurses through all the frames on the window and calls 
        ///     'initializeConsole' to intialize the console on that frame
        /// </summary>
        /// <param name="windowToAttach" type="Object">
        ///     The IDispatch window that we should inspect for frames
        /// </param>

        var realWindow = null;

        try {
            // Try to get the window object that javascript expects
            realWindow = windowToAttach.document.parentWindow;
        } catch (ex) {
            // Ignore this beforeScriptExecute, as the window is not valid and cannot attach a console
            return;
        }

        // Attach a console to this window
        remoteCode.initializeConsole(realWindow);

        // Use recursion to add a console to each frame
        if (realWindow.frames) {
            for (var i = 0; i < realWindow.frames.length; i++) {
                var frame = realWindow.frames[i];
                if (frame) {
                    var iframe = domHelper.getCrossSiteWindow(realWindow, frame);
                    remoteCode.initializeConsoles(iframe);
                }
            }
        }
    },

    initializeConsole: function console$remoteCode$initializeConsole(realWindow) {
        /// <summary>
        ///     Initializes the console for the specified window
        /// </summary>
        /// <param name="realWindow" type="Object">
        ///     The window object that we add the console to
        /// </param>

        var modifiedConsole = false;
        var consoleObj = realWindow.console;
        var injectedConsole = {};

        if (!consoleObj) {
            // Create a new console object
            consoleObj = realWindow.console = {};
            modifiedConsole = true;
        }

        // The default logging functions will write the messages to our console, so we only define them if needed
        if (consoleObj.log === undefined) {
            consoleObj.log = function (msg) {
                remoteCode.onConsoleFunc(consoleUtils.consoleNotifyType.log, msg);
            };
            injectedConsole.log = consoleObj.log;
            modifiedConsole = true;
        }
        if (consoleObj.info === undefined) {
            consoleObj.info = function (msg) {
                remoteCode.onConsoleFunc(consoleUtils.consoleNotifyType.info, msg);
            };
            injectedConsole.info = consoleObj.info;
            modifiedConsole = true;
        }
        if (consoleObj.warn === undefined) {
            consoleObj.warn = function (msg) {
                remoteCode.onConsoleFunc(consoleUtils.consoleNotifyType.warn, msg);
            };
            injectedConsole.warn = consoleObj.warn;
            modifiedConsole = true;
        }
        if (consoleObj.error === undefined) {
            consoleObj.error = function (msg) {
                remoteCode.onConsoleFunc(consoleUtils.consoleNotifyType.error, msg);
            };
            injectedConsole.error = consoleObj.error;
            modifiedConsole = true;
        }
        if (consoleObj.assert === undefined) {
            consoleObj.assert = function (test, msg) {
                if (!test) {
                    remoteCode.onConsoleFunc(consoleUtils.consoleNotifyType.assert, msg);
                }
            };
            injectedConsole.assert = consoleObj.assert;
            modifiedConsole = true;
        }
        
        // Clear and Dir functions will have default 'no-op' functions, so we need to replace those if they are the native implementations
        if (consoleObj.clear === undefined || (consoleObj.clear && consoleObj.clear.toString && consoleObj.clear.toString() === "\nfunction clear() {\n    [native code]\n}\n")) {
            consoleObj.clear = function () {
                remoteCode.onConsoleFunc("clear");
            };
            injectedConsole.clear = consoleObj.clear;
            modifiedConsole = true;
        }
        if (consoleObj.dir === undefined || (consoleObj.dir && consoleObj.dir.toString && consoleObj.dir.toString() === "\nfunction dir() {\n    [native code]\n}\n")) {
            consoleObj.dir = function (obj) {
                remoteCode.onConsoleFunc("dir", obj);
            };
            injectedConsole.dir = consoleObj.dir;
            modifiedConsole = true;
        }
        
        // The following functions are not defined on the default console object, so define them now
        if (consoleObj.cd === undefined) {
            consoleObj.cd = function (obj) {
                remoteCode.onConsoleFunc("cd", { obj: obj, argsCount: arguments.length });
            };
            injectedConsole.cd = consoleObj.cd;
            modifiedConsole = true;
        }
        if (consoleObj.select === undefined) {
            consoleObj.select = function (obj) {
                remoteCode.onConsoleFunc("select", { obj: obj });
            };
            injectedConsole.select = consoleObj.select;
            modifiedConsole = true;
        }

        // Add the break mode function
        realWindow.__VISUALSTUDIO_CONSOLE_BREAKMODE_FUNC = function (id, data) {
            remoteCode.onBreakModeFunc(id, data);
        };

        if (modifiedConsole) {
            // Add the detach handler to remove the console object when we detach
            var detachHandler = function () {
                remoteCode.onDetach(realWindow, injectedConsole);
                toolUI.removeEventListener("detach", detachHandler);
            };

            // Add the unload handler to remove the detach handler on a navigate,
            // The actual page navigation will take care of cleaning up the consoles.
            // This enables us to still catch any console function calls during the unload event.
            if (realWindow.addEventListener) {
                // DocumentMode 9 and above
                realWindow.addEventListener("unload", function () {
                    toolUI.removeEventListener("detach", detachHandler);
                });
            } else {
                // Below DocumentMode 9
                realWindow.attachEvent("onunload", function () {
                    toolUI.removeEventListener("detach", detachHandler);
                });
            }

            toolUI.addEventListener("detach", detachHandler);
        }
    },

    onBeforeScriptExecute: function console$remoteCode$onBeforeScriptExecute(dispatchWindow) {
        /// <summary>
        ///     This method is called back when the main browser is about to execute script, 
        ///     so we should insert the console object (and set up handlers to remove it on detach
        /// </summary>   
        /// <param name="dispatchWindow" type="Object">
        ///     The IDispatch window that triggered the BeforeScriptExecute event
        /// </param>

        var realWindow;
        try {
            // Try to get the window object that javascript expects
            realWindow = dispatchWindow.document.parentWindow;
        } catch (ex) {
            // Ignore this beforeScriptExecute, as the window is not valid and cannot attach a console
            return;
        }

        // Ensure the new window is the top level one and not a sub frame
        if (realWindow === mainBrowser.document.parentWindow) {
            // Set this as the current context
            remoteCode.currentWindowContext = realWindow;

            // Context has changed so we need to re-evaluate the constructors
            remoteCode.constructors = null;

            // Notify the console that we have navigated
            if (remoteHelpers.port) {
                // Finish posting any messages from the previous page
                remoteHelpers.postAllMessages();

                remoteCode.initializePage();
            }
        } else {
            // Ensure we re-evaluate the constructors since a frame has changed
            remoteCode.constructors = null;
            
            try {
                // Try to access the current cd window
                var currentWindow = remoteCode.currentWindowContext.document.parentWindow;
            } catch (e) {
                // If we get an exception, it means the currently active cd window was replaced by this new one
                remoteCode.currentWindowContext = realWindow;
            }

            // Sub frames should get a new console
            remoteCode.initializeConsoles(realWindow);
        }

    },

    onDetach: function console$remoteCode$onDetach(realWindow, injectedConsole) {
        /// <summary>
        ///     Cleans up any injected console functions by removing them
        /// </summary>
        /// <param name="realWindow" type="Object">
        ///     The window object that we add the console to
        /// </param>
        /// <param name="injectedConsole" type="Object">
        ///     The object that represents the functions that were injected
        /// </param>        
        /// <disable>JS2078.DoNotDeleteObjectProperties</disable>

        // Reset the document timeout
        remoteHelpers.initializeDocumentTries = 0;

        try {
            if (realWindow.console) {
                // Remove all injected console functions if they haven't been modified
                var functionsNotRemoved = 0;
                for (var prop in injectedConsole) {
                    if (realWindow.console[prop] === injectedConsole[prop]) {
                        if (realWindow.document.documentMode < 9) {
                            // In IE8 mode and below, the delete operator causes the property to go into an 'unknown' state
                            realWindow.console[prop] = null;
                        } else {
                            delete realWindow.console[prop];
                        }
                    } else {
                        functionsNotRemoved++;
                    }
                }

                // If we removed all the injected functions, we might need to delete the console
                if (functionsNotRemoved === 0) {

                    // Check if we should delete the console as well
                    var deleteConsole = true;
                    for (var i in realWindow.console) {
                        if (realWindow.console[i]) {
                            deleteConsole = false;
                            break;
                        }
                    }

                    if (deleteConsole) {
                        delete realWindow.console;
                    }
                }
            }

            if (realWindow.__VISUALSTUDIO_CONSOLE_BREAKMODE_FUNC) {
                // Remove the break mode function
                delete realWindow.__VISUALSTUDIO_CONSOLE_BREAKMODE_FUNC;
            }

            if (realWindow.__VISUALSTUDIO_CONSOLE_INVOKER) {
                // Remove the invoker function
                delete realWindow.__VISUALSTUDIO_CONSOLE_INVOKER;
            }
            if (realWindow.__VISUALSTUDIO_CONSOLE_SELECTED_ELEMENT) {
                // Remove the stored select element
                delete mainBrowser.document.parentWindow.__VISUALSTUDIO_CONSOLE_SELECTED_ELEMENT;
            }
        }
        catch (ex) {
            // We should fail gracefully if there are access issues with already removed consoles
        }

        injectedConsole = null;
    },

    createInvoker: function console$remoteCode$createInvoker(win) {
        /// <summary>
        ///     Creates the visual studio console invoker function on the specified window
        /// </summary>   
        /// <param name="win" type="Object">
        ///     The window onto which to attach the function
        /// </param>

        // This invoker allows us to catch errors in the page's script engine and avoid invoking the debugger.
        // Note that "execScript" is used so that the script is executed in the global context
        // execScript does not return a result, so parameters are passed via properties on our own global function.
        // Using window.eval.call(window, script) would require IE9+.
        
        // Warn the user if the eval function has been modified
        var evalString = win.eval.toString();
        if (evalString !== "\nfunction eval() {\n    [native code]\n}\n" && remoteCode.notifyCallback) {
            remoteCode.notifyCallback({inputId: -1, notifyType: consoleUtils.consoleNotifyType.error, localizeId: "ModifiedEvalFunction"});
            // Identify that the eval function has been altered, so we can report it in any 'NFEs' that may occur
            remoteHelpers.isEvalModified = true;
        }
        
        // Warn the user if the execScript function has been modified
        var execScriptString = win.execScript.toString();
        if (execScriptString !== "\nfunction execScript() {\n    [native code]\n}\n" && remoteCode.notifyCallback) {
            remoteCode.notifyCallback({inputId: -1, notifyType: consoleUtils.consoleNotifyType.error, localizeId: "ModifiedExecScriptFunction"});
            // Identify that the execScript function has been altered, so we can report it in any 'NFEs' that may occur
            remoteHelpers.isExecScriptModified = true;
        }
        
        win.eval(
            "function __VISUALSTUDIO_CONSOLE_INVOKER(input) {\n" +
            "    // This function is used to evaluate commands for the Visual Studio JavaScript Console\n" +
            "    try {\n" +
            "       var inlineConsole = {cd: console.cd, dir: console.dir, select: console.select};\n" +
            "\n" +
            "       if ((typeof $) === 'undefined') {\n" +
            "          inlineConsole.$ = function () { return document.getElementById.apply(document, arguments); };\n" +
            "       }\n" +
            "\n" +
            "       if ((typeof $$) === 'undefined') {\n" +
            "          inlineConsole.$$ = function () { return document.querySelectorAll.apply(document, arguments); };\n" +
            "       }\n" +
            "\n" +
            "       if ((typeof __VISUALSTUDIO_DOMEXPLORER_STORED_ELEMENTS) !== 'undefined') {\n" +
            "          if ((typeof $0) === 'undefined') {\n" +
            "             inlineConsole.$0 = __VISUALSTUDIO_DOMEXPLORER_STORED_ELEMENTS[0];\n" +
            "          }\n" +
            "          if ((typeof $1) === 'undefined') {\n" +
            "             inlineConsole.$1 = __VISUALSTUDIO_DOMEXPLORER_STORED_ELEMENTS[1];\n" +
            "          }\n" +
            "          if ((typeof $2) === 'undefined') {\n" +
            "             inlineConsole.$2 = __VISUALSTUDIO_DOMEXPLORER_STORED_ELEMENTS[2];\n" +
            "          }\n" +
            "          if ((typeof $3) === 'undefined') {\n" +
            "             inlineConsole.$3 = __VISUALSTUDIO_DOMEXPLORER_STORED_ELEMENTS[3];\n" +
            "          }\n" +
            "          if ((typeof $4) === 'undefined') {\n" +
            "             inlineConsole.$4 = __VISUALSTUDIO_DOMEXPLORER_STORED_ELEMENTS[4];\n" +
            "          }\n" +
            "       }\n" +
            "\n" +
            "       __VISUALSTUDIO_CONSOLE_INVOKER.inlineConsole = inlineConsole;\n" +
            "       __VISUALSTUDIO_CONSOLE_INVOKER.input = input;\n" +
            "       __VISUALSTUDIO_CONSOLE_INVOKER.returnValue = { isError:false };\n" +
            "\n" +
            "       execScript('/* VS JSConsole invoke */ " +
            "          try {" +
            "              with (__VISUALSTUDIO_CONSOLE_INVOKER.inlineConsole) {" +
            "                  __VISUALSTUDIO_CONSOLE_INVOKER.returnValue.result = eval(__VISUALSTUDIO_CONSOLE_INVOKER.input);" +
            "              }" +
            "          } catch(e) {" +
            "              __VISUALSTUDIO_CONSOLE_INVOKER.returnValue.result = (e.message || e.description);" +
            "              __VISUALSTUDIO_CONSOLE_INVOKER.returnValue.isError = true;" +
            "          }" +
            "       ');\n" +
            "\n" +
            "       var returnValue = __VISUALSTUDIO_CONSOLE_INVOKER.returnValue;\n" +
            "\n" +
            "       __VISUALSTUDIO_CONSOLE_INVOKER.inlineConsole = null;\n" +
            "       __VISUALSTUDIO_CONSOLE_INVOKER.input = null;\n" +
            "       __VISUALSTUDIO_CONSOLE_INVOKER.returnValue = null;\n" +
            "\n" +
            "       return returnValue;\n" +
            "   } catch(invokerEx) {\n" +
            "       /* This exception occurs if the evaluation thread was terminated during the call due to a refresh, so fail gracefully. */ \n" +
            "       return { result: undefined, isError: false };\n" +
            "   }\n" +
            "}"
        );
    },

    onConsoleMessage: function console$remoteCode$onConsoleMessage(source, level, messageId, messageText, fileUrl, lineNumber, columnNumber) {
        /// <summary>
        ///     This method is called from code within IE that wants to output to the console
        /// </summary>   
        /// <param name="source" type="String">
        ///     The source identifier that created the message
        /// </param>   
        /// <param name="level" type="String">
        ///     The level of the message
        /// </param>   
        /// <param name="messageId" type="Number">
        ///     The message id for the type of message coming from the console
        /// </param>   
        /// <param name="messageText" type="String">
        ///     The text to display
        /// </param>   
        /// <param name="fileUrl" type="String">
        ///     The file url that caused the message
        /// </param>   
        /// <param name="lineNumber" type="Number">
        ///     The line number for the message
        /// </param>   
        /// <param name="columnNumber" type="Number">
        ///     The column number for the message
        /// </param>   

        if (source === "CONSOLE") {
            switch (messageId) {
                case 6000: // Log
                    remoteCode.onConsoleFunc(consoleUtils.consoleNotifyType.log, messageText);
                    return;
                case 6001: // Warn
                    remoteCode.onConsoleFunc(consoleUtils.consoleNotifyType.warn, messageText);
                    return;
                case 6002: // Error
                    remoteCode.onConsoleFunc(consoleUtils.consoleNotifyType.error, messageText);
                    return;
                case 6003: // Assert
                    remoteCode.onConsoleFunc(consoleUtils.consoleNotifyType.assert, messageText);
                    return;
                case 6004: // Info
                    remoteCode.onConsoleFunc(consoleUtils.consoleNotifyType.info, messageText);
                    return;
            }
        }

        var messageIdentifier = source + messageId;
        var data = { messageId: messageIdentifier, message: messageIdentifier + ": " + messageText, fileUrl: fileUrl, lineNumber: lineNumber, columnNumber: columnNumber };

        switch (level) {
            case 0:
                remoteCode.onConsoleFunc(consoleUtils.consoleNotifyType.info, data);
                break;
            case 1:
                remoteCode.onConsoleFunc(consoleUtils.consoleNotifyType.warn, data);
                break;
            case 2:
                remoteCode.onConsoleFunc(consoleUtils.consoleNotifyType.error, data);
                break;
        }

    },

    onConsoleFunc: function console$remoteCode$onConsoleFunc(functionId, data) {
        /// <summary>
        ///     This method is called by functions attached to the window.console
        ///     It processes the function call and communicates information back to the VS side
        /// </summary>
        /// <param name="functionId" type="String">
        ///     The type of the message
        ///     Either a notification type from consoleUtils.consoleNotifyType or a built in function
        ///     such as "cd", "clear", "dir", etc
        /// </param>
        /// <param name="data" type="Object" optional="true">
        ///     The information used for this function call
        /// </param>


        switch (functionId) {
            case "cd":
                // Built in console.cd command
                if (remoteCode.notifyCallback) {
                    try {
                        var iframe;
                        if (data.argsCount === 0) {
                            // Set the context back to the main window
                            iframe = mainBrowser.document.parentWindow;
                        } else {
                            // CD into the window
                            iframe = domHelper.getCrossSiteWindow(remoteCode.currentWindowContext, data.obj);
                        }

                        remoteCode.currentWindowContext = iframe;
                        remoteCode.constructors = null;
                        
                        var newWindowContext = iframe.eval("window.location.href");
                        var newWindowText = iframe.eval("window.location.hostname") + iframe.eval("window.location.pathname");

                        // Remove trailing slash
                        newWindowText = newWindowText.replace(/\/$/, "");
                        
                        remoteCode.notifyCallback({ notifyType: "consoleItemCDContext", message: newWindowText, contextInfo: newWindowContext });

                    } catch (e) {
                        remoteCode.notifyCallback({ notifyType: consoleUtils.consoleNotifyType.error, message: (e.message || e.description) });
                    }
                }
                break;

            case "clear":
                // Built in console.clear command
                if (remoteCode.clearCallback) {
                    remoteCode.reset();
                    remoteCode.clearCallback();
                }
                break;

            case "dir":
                // Built in console.dir command
                if (remoteCode.outputCallback) {
                    var returnObj = remoteCode.createOutputObject(-1, data);

                    if (returnObj.detailedType !== "undefined") {
                        remoteCode.outputCallback(returnObj);
                    }
                }
                break;

            case "select":
                // Built in console.select command
                if (remoteCode.notifyCallback) {
                    remoteCode.currentWindowContext.__VISUALSTUDIO_CONSOLE_SELECTED_ELEMENT = data.obj;

                    // Check that this is actually an html element
                    remoteCode.ensureConstructorsAreAvailable(true);
                    var isHtmlElement = (data.obj instanceof remoteCode.constructors.htmlElement);

                    remoteCode.notifyCallback({ notifyType: "consoleItemSelectInDom", message: isHtmlElement });
                }
                break;

            default:
                // All other functions are notification types
                if (!remoteCode.notifyCallback) {
                    // The port is not ready yet, so queue up the notifications
                    remoteCode.consoleNotificationQueue.push({ functionId: functionId, data: data });
                } else {
                    // Fire the notification directly

                    remoteCode.notifyCallback({ notifyType: functionId, message: data });
                }
                break;
        }
    },

    onBreakModeFunc: function console$remoteCode$onBreakModeFunc(id, data) {
        /// <summary>
        ///     This method is called when the console is at a break point, and is
        ///     used to evaluate commands while in that state
        /// </summary>
        /// <param name="id" type="String">
        ///     The id associated with the command
        ///     This is in the form:
        ///     "functionName:id:callbackUid"
        /// </param>
        /// <param name="data" type="Object">
        ///     The information used for this function call
        /// </param>

        // Since we are being executed in break mode, we don't know the current 'eval' context, as
        // it is handled by VS. So we need to re-evaluate the constructors in this context.
        remoteCode.constructors = null;

        if (id === "") {
            // This is a regular CallProxy call, so just process the messages
            remoteHelpers.processMessages({ data: data });
        } else {

            // First get the info about this call from the generic id
            var parts = id.split(":");
            if (parts.length === 3) {
                var funcName = parts[0];
                var inputId = parseInt(parts[1], 10);
                var uid = parts[2];

                // Now perform the requested function
                var returnValue;
                if (funcName === "processInput") {

                    // The constructors will have been created by the VS debug call so as to
                    // use the correct context.
                    if (data.constructors) {
                        remoteCode.constructors = data.constructors;
                    }

                    // Get the console result
                    returnValue = remoteCode.createConsoleResult(inputId, data);
                }

                // Now return the result using the callback mechanism
                if (returnValue !== undefined) {
                    remoteHelpers.postObject({
                        uid: uid,
                        args: [returnValue]
                    });
                }
            }
        }

        // We need to reset the constructors again, in case we switch back to run mode under a difference context
        remoteCode.constructors = null;
    },

    ensureConstructorsAreAvailable: function console$remoteCode$ensureConstructorsAreAvailable(forceCreate) {
        /// <summary>
        ///     Gets Html type name for a specified object
        /// </summary>
        /// <param name="forceCreate" type="Boolean" optional="true">
        ///     Optional parameter that specifies if we should re-create the constructors if they already exist
        /// </param>

        if (!remoteCode.constructors || forceCreate) {
            // For detailedType checks we need to evaluate some code in the context of the browser to
            // get the constructors for our metadata types.
            remoteCode.constructors = remoteCode.currentWindowContext.eval(
                "(function (){\n" +
                "   var constructors = {};\n" +
                "   try {\n" +
                "      constructors.array = (new Array).constructor;\n" +
                "      constructors.date = (new Date).constructor;\n" +
                "      constructors.regex = (new RegExp).constructor;\n" +
                "      constructors.htmlElement = window.HTMLElement;\n" +
                "      constructors.htmlNode = window.Node;\n" +
                "      constructors.nodeList = window.NodeList;\n" +
                "      constructors.htmlCollection = window.HTMLCollection;\n" +
                "   } catch (e) {\n" +
                "   }\n" +
                "   return constructors;\n" +
                " })();"
            );
        }

    },

    getHtmlViewableTypeName: function console$remoteCode$getHtmlViewableTypeName(obj) {
        /// <summary>
        ///     Gets Html type name for a specified object
        /// </summary>
        /// <param name="obj" type="Object">
        ///     The javascript object that we need the type name for
        /// </param>
        /// <returns type="String">
        ///     The html type name of the object, or null if the object is not an Html element
        /// </returns>

        // Create the constructors
        remoteCode.ensureConstructorsAreAvailable();

        if (remoteCode.constructors) {
            if (remoteCode.constructors.htmlElement && (obj instanceof remoteCode.constructors.htmlElement)) {
                // HTMLElement
                return "HtmlElement";
            } else if (remoteCode.constructors.htmlNode && (obj instanceof remoteCode.constructors.htmlNode)) {
                    // Now that we know this is an html node, we need to check its nodeType
                if (obj.nodeType === obj.DOCUMENT_NODE) {
                    // Document
                    return "DocumentNode";
                } else if (obj.nodeType === obj.ATTRIBUTE_NODE) {
                    // Attribute
                    return "AttributeNode";
                } else {
                    // HtmlNode
                    return "HtmlNode";
                }
            } else if (remoteCode.constructors.nodeList && (obj instanceof remoteCode.constructors.nodeList)) {
                    // NodeList
                return "NodeList";
            } else if (remoteCode.constructors.htmlCollection && (obj instanceof remoteCode.constructors.htmlCollection)) {
                    // HTMLCollection
                return "HtmlCollection";
            }
        }

        // Object 
        return null;
    },

    createConsoleResult: function console$remoteCode$createConsoleResult(inputId, evaluatedReturnValue) {
        /// <summary>
        ///     Creates the correct representation of an VisualStudioInvoker result
        /// </summary>
        /// <param name="inputId" type="String">
        ///     The identifier of the input command that was evaluated to create this object
        /// </param>
        /// <param name="evaluatedReturnValue" type="Object">
        ///     The result returned from the VisualStudioConsoleInvoker
        /// </param>
        /// <returns type="Object">
        ///     The constructed javscript object that is ready to be stringified and sent over to the VS side
        /// </returns>
        /// <disable>JS2021.SeparateBinaryOperatorArgumentsWithSpaces</disable>

        // Create the constructors
        remoteCode.ensureConstructorsAreAvailable();

        if (evaluatedReturnValue.isError) {
            // Error values should be shown using a notification
            if (remoteCode.notifyCallback) {
                remoteCode.notifyCallback({ inputId: inputId, notifyType: consoleUtils.consoleNotifyType.error, message: evaluatedReturnValue.result });
            }
        } else {

            // Mark the start of the object creation
            mainBrowser.document.parentWindow.msWriteProfilerMark("ConsoleRemote:BeginCreateResultObject");

            var consoleObject;

            // Now check what type of item we need to return
            var htmlTypeName = remoteCode.getHtmlViewableTypeName(evaluatedReturnValue.result);

            // Check for an html viewable type, excluding documents which should be objects by default (but have a view as html option)
            if (htmlTypeName !== null && htmlTypeName !== "DocumentNode") {
                // Create an Html Viewable result
                consoleObject = remoteCode.createOutputHtmlElement(inputId, evaluatedReturnValue.result, htmlTypeName);
            } else {
                // Create an Object result
                consoleObject = remoteCode.createOutputObject(inputId, evaluatedReturnValue.result);

                // Document nodes should be marked as 'Html Viewable'
                if (htmlTypeName === "DocumentNode") {
                    consoleObject.isHtmlViewableType = true;
                }
            }

            // Mark the end of the object creation
            mainBrowser.document.parentWindow.msWriteProfilerMark("ConsoleRemote:EndCreateResultObject");

            // Return the created object
            return consoleObject;
        }
    },

    createOutputHtmlElement: function console$remoteCode$createOutputHtmlElement(inputId, element, htmlTypeName) {
        /// <summary>
        ///     Creates a representation of a javascript HtmlElement for the VS console
        /// </summary>
        /// <param name="inputId" type="String">
        ///     The identifier of the input command that was evaluated to create this object
        /// </param>
        /// <param name="element" type="Object">
        ///     The object to traverse and convert to a console object
        ///     This should be from the result of an eval
        /// </param> 
        /// <param name="htmlTypeName" type="String" >
        ///     Specifies the html type Name
        /// </param>          
        /// <returns type="Object">
        ///     The constructed javscript object representing the HtmlElement
        /// </returns>

        var name;
        try {
            name = Object.prototype.toString.call(element);
        } catch (e) {
            // A failure means that this is a cross-site window that we cannot access
            name = null;
        }

        // Create the html node, and remember we want to see empty text elements
        var value = htmlTreeHelpers.createMappedNode(element, true);

        if (htmlTypeName === "NodeList" ||
            htmlTypeName === "HtmlCollection") {
            // This is a list so store that info
            value.tag = htmlTypeName;
            htmlTreeHelpers.mapping[value.uid].listType = htmlTypeName;
            value.attributes = [{ name: "length", value: element.length }];
        }

        // Return this console object
        return {
            inputId: inputId,
            consoleType: "consoleItemOutput",
            detailedType: "htmlElement",
            isExpandable: true,
            isHtmlViewableType: true,
            name: name,
            value: value,
            uid: 0
        };
    },

    createOutputObject: function console$remoteCode$createOutputObject(inputId, obj) {
        /// <summary>
        ///     Creates a representation of a javascript object for the VS console
        /// </summary>
        /// <param name="inputId" type="String">
        ///     The identifier of the input command that was evaluated to create this object
        /// </param>
        /// <param name="obj" type="Object">
        ///     The object to traverse and convert to a console object
        ///     This should be from the result of an eval
        /// </param>
        /// <returns type="Object">
        ///     The constructed javscript object representing the object
        /// </returns>

        // The meta type of the evaluate result could be 'string', 'object', 'array', 'date', 'regex', etc
        var detailedType = remoteCode.getDetailedTypeOf58(obj, remoteCode.constructors);

        // Expandable objects are not empty because they have properties
        var isExpandable = !remoteCode.isEmpty58(obj);

        // Get the value for the object
        var name;
        var value;
        var uid;
        if (isExpandable) {
            name = remoteCode.createName(obj, detailedType);

            // We need to get the special window object
            if (name === "[object Window]") {
                try {
                    var iframe = domHelper.getCrossSiteWindow(remoteCode.currentWindowContext, obj);
                    if (iframe) {
                        obj = iframe;
                    }
                } catch (e) {
                    // We couldn't access this window, so create a fake value
                    value = { 0: remoteCode.createExceptionValue(e) };
                }
            }

            if (!value) {
                uid = remoteHelpers.getUid();
                value = remoteCode.createValue(obj, uid);
                remoteCode.resultMap[uid] = obj;
            }
        } else {
            name = null;
            value = remoteCode.createValue(obj);
        }

        var htmlTypeName = remoteCode.getHtmlViewableTypeName(obj);
        var isHtmlViewableType = (htmlTypeName !== null && htmlTypeName !== "AttributeNode");

        // Return this console object
        return {
            inputId: inputId,
            consoleType: "consoleItemOutput",
            detailedType: detailedType,
            isExpandable: isExpandable,
            isHtmlViewableType: isHtmlViewableType,
            name: name,
            value: value,
            uid: uid
        };
    },

    runInPage: function console$remoteCode$runInPage(functionToRun, arg) {
        /// <summary>
        ///     Runs functionToRun in the context of the page passing 
        ///     in arg as the only argument by stringifying it then 
        ///     using the main window to eval it.
        /// </summary>
        /// <param name="functionToRun" type="Function">
        ///     A function containing code to run in the page.
        /// </param>
        /// <param name="arg" type="Object">
        ///     An argument to pass to functionToRun
        /// </param>
        /// <returns type="Object">
        ///     The result of running the function with the specified
        ///     argument.
        /// </returns>

        // Make sure there is an invoker to evaluate against
        if (!remoteCode.currentWindowContext.__VISUALSTUDIO_CONSOLE_INVOKER) {
            remoteCode.createInvoker(remoteCode.currentWindowContext);
        }
        var invoker = mainBrowser.document.parentWindow.__VISUALSTUDIO_CONSOLE_INVOKER;
        var temp = invoker.objParam;
        invoker.objParam = arg;

        var result = mainBrowser.document.parentWindow.eval(
            "(function() { try { return (" + functionToRun.toString() + ")(__VISUALSTUDIO_CONSOLE_INVOKER.objParam); } catch (e) { return 'undefined'; } })();");

        invoker.objParam = temp;
        return result;
    },

    getTypeOf: function console$remoteCode$getTypeOf(obj) {
        /// <summary>
        ///     Because the 5.8 engine can't get accurate typeof info for
        ///     Chakra objects, if we're not running under Chakra, we must
        ///     go to the page for typeofs.
        /// </summary>
        /// <param name="obj" type="Object">
        ///     The javascript value to be checked for its type
        /// </param>
        /// <returns type="String">
        ///     A string representing the type of this value, possible values include:
        ///     undefined, null, object, string, number, function, and boolean
        /// </returns>

        if (toolUI.engineSupportsES5) {
            return typeof obj;
        } else {
            return remoteCode.runInPage(function (arg) { return typeof arg; }, obj);
        }
    },

    getDetailedTypeOf58: function console$remoteCode$getDetailedTypeOf58(value, constructors) {
        /// <summary>
        ///     Gets a string representing the type of the passed in value.
        ///     This supliments the built in typeof function by calculating the type of certain objects such as
        ///     array, date, and regex.  The 58 version of this function is designed to work for the jscript 5.8 engine
        ///     talking to a page running jscript9
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

        var type = remoteCode.getTypeOf(value);

        if (type === "object") {
            if (value) {
                if (typeof value.length === "number" &&
                    (toolUI.engineSupportsES5 ? typeof value.propertyIsEnumerable :
                    remoteCode.getTypeOf(value.propertyIsEnumerable) === "function" &&
                    !(value.propertyIsEnumerable("length")) &&
                    remoteCode.getTypeOf(value.splice) === "function")) {
                    return "array";
                }

                // See if we have specific constructors to test against
                var arrayCon = (constructors && constructors.array ? constructors.array : remoteCode.runInPage(function () { return (new Array()).constructor; }, null));
                var dateCon = (constructors && constructors.date ? constructors.date : remoteCode.runInPage(function () { return (new Date()).constructor; }, null));
                var regexCon = (constructors && constructors.regex ? constructors.regex : remoteCode.runInPage(function () { return (new RegExp()).constructor; }, null));

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

    isEmpty58: function console$remoteCode$isEmpty58(obj) {
        /// <summary>
        ///     Checks if the passed in object is empty (such as { }) because it has no members
        /// </summary>
        /// <param name="obj" type="Object">
        ///     The javascript object to be checked for members
        /// </param>
        /// <returns type="Boolean">
        ///     True if the object contains no members, False otherwise
        /// </returns>

        var pageTypeOf = remoteCode.getTypeOf(obj);
        if (pageTypeOf === "object" || pageTypeOf === "function") {
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

    getPrototypeName: function console$remoteCode$getPrototypeName(obj) {
        /// <summary>
        ///     Grabs the toString of an object's prototype, using the page's engine if 
        ///     we're running under 5.8.  This is for use in identifying the type 
        ///     of object when outputting to the console.
        /// </summary>
        /// <param name="obj" type="Object">
        ///     The object whose prototype name we are fetching
        /// </param>
        /// <returns type="String">
        ///     toString of the object's prototype.
        /// </returns>
        var prototypeName;
        if (toolUI.engineSupportsES5) {
            try {
                prototypeName = Object.prototype.toString.call(obj);
            } catch (ex) {
                // A failure means that this is a cross-site window that we cannot access
                prototypeName = null;
            }
        } else {
            // Try to get the type name
            prototypeName = remoteCode.runInPage(
            function (param) {
                var retVal;
                try {
                    retVal = Object.prototype.toString.call(param);
                } catch (ex) {
                    // A failure means that this is a cross-site window that we cannot access
                    retVal = null;
                }
                return retVal;
            },
            obj);
        }
        return prototypeName;
    },

    createName: function console$remoteCode$createName(obj, detailedType) {
        /// <summary>
        ///     Creates a string representation of a javascript object's contents
        /// </summary>
        /// <param name="obj" type="Object">
        ///     The object to traverse and convert to a console object
        ///     This should be from the result of an eval
        /// </param>
        /// <param name="detailedType" type="String" optional="true">
        ///     If we already know the detailed type of obj, pass it in to 
        ///     avoid recalculating it.
        /// </param>
        /// <returns type="String">
        ///     The constructed string representing the object
        /// </returns>
        if (!detailedType) {
            detailedType = remoteCode.getDetailedTypeOf58(obj, remoteCode.constructors);
        }

        switch (detailedType) {
            case "boolean":
                return "" +  obj;
            case "date":
                return "[date] " + obj;

            case "function":
                return "" + obj;

            case "null":
                return "null";

            case "number":
                return  "" + obj;

            case "regex":
                return "[regex] " + obj;

            case "string":
                return "\"" + obj + "\"";

            case "undefined":
                return "undefined";

            case "array":
                if (remoteCode.isEmpty58(obj)) {
                    return consoleUtils.consoleUITypeStrings.emptyArray;
                }
                return remoteCode.getPrototypeName(obj);

                // FALLTHROUGH
            case "object":
            case "htmlElement":
            if (remoteCode.isEmpty58(obj)) {
                    return consoleUtils.consoleUITypeStrings.emptyObject;
                }
                return remoteCode.getPrototypeName(obj);
            default:
                return "" + obj;
        }
    },


    createValue: function console$remoteCode$createValue(obj, parentUid) {
        /// <summary>
        ///     Creates a representation of a value for the VS console
        /// </summary>
        /// <param name="obj" type="Object">
        ///     The object to traverse and create the value for
        /// </param>
        /// <param name="parentUid" type="String" optional="true">
        ///     The indentifier of the object in the stored map
        ///     This is used later to expand child elements
        /// </param>
        /// <returns type="Object">
        ///     The constructed javscript object representing the value
        /// </returns>

        var detailedType = remoteCode.getDetailedTypeOf58(obj, remoteCode.constructors);
        var isEmpty = remoteCode.isEmpty58(obj);
        
        // We can shortcut empty objects and just return their string value
        if (isEmpty) {
            return remoteCode.createName(obj, detailedType);
        }

        // Loop through the children and generate the meta object for it
        var outputObj = [];
        
        try {
            for (var i in obj) {
                // Some children cannot be accessed (eg document.fileUpdatedDate)
                // So first perform a check that we can use this child.
                var child;
                try {
                    child = obj[i];
                
                    // Get info about this child node
                    var childdetailedType = remoteCode.getDetailedTypeOf58(child, remoteCode.constructors);

                    var childIsExpandable = !remoteCode.isEmpty58(child);

                    // Try to get the type name, this will fail on cross site windows
                    var childName = null;
                    if (childIsExpandable) {
                        childName = remoteCode.createName(obj[i], childdetailedType);
                    }

                    var htmlTypeName = remoteCode.getHtmlViewableTypeName(child);
                    var isHtmlViewableType = (htmlTypeName !== null && htmlTypeName !== "AttributeNode");

                    // Create the child object
                    outputObj.push({
                        propertyName: i, 
                        propertyValue: {
                            detailedType: childdetailedType,
                            isExpandable: childIsExpandable,
                            isHtmlViewableType: isHtmlViewableType,
                            name: childName,
                            value: (!childIsExpandable ? remoteCode.createValue(child) : parentUid + ":" + i)
                        }
                    });
                } 
                catch (childAccessEx) {
                    // Child inaccessible, so just just return a fake value
                    outputObj.push({propertyName: i, propertyValue: remoteCode.createExceptionValue(childAccessEx)});
                    continue;
                }
            }
        } catch (objectAccessEx) {
            // The object was inaccessible, (it was probably a window object), so just return a fake value
            outputObj.push({propertyName: "0", propertyValue: remoteCode.createExceptionValue(objectAccessEx)});
        }
        return outputObj;
    },

    createExceptionValue: function console$remoteCode$createExceptionValue(exception) {
        /// <summary>
        ///     Creates a representation of an exception for the VS console
        /// </summary>
        /// <param name="exception" type="Object">
        ///     The exception to create the object for
        /// </param>
        /// <returns type="Object">
        ///     The constructed javscript object representing the exception
        /// </returns>

        var information = (exception.message || exception.description);
        var msg = "<" + (information).replace(/^\s+|\s+$/g, "") + ">";
        if (msg === "<>") {
            // This string matches the exception from javascript and should not be localized
            msg = "<Access denied.>";
        }

        return {
            detailedType: "exception",
            isExpandable: false,
            value: msg
        };
    },

    reset: function () {
        /// <summary>
        ///     Reset settings back to their original values
        /// </summary>

        remoteHelpers.uid = 0;
        remoteCode.resultMap = {};
        htmlTreeHelpers.reset();
    }
};

messageHandlers = {
    /// <summary>
    ///     Object that acts as the message handler for messages that get sent from the VS side
    ///     The messages contain a command property that corrisponds to a function on this 
    ///     object that processes that message
    /// </summary>

    getDocumentMode: function console$messageHandlers$getDocumentMode() {
        /// <summary>
        ///     Gets the document mode of the main browser page
        /// </summary>
        /// <returns type="Number">
        ///     The document mode of the main browser page
        /// </returns> 

        return mainBrowser.document.documentMode;
    },

    clearConsoleData: function console$messageHandlers$clearConsoleData() {
        /// <summary>
        ///     Removes any stored data for the remote side of the console
        ///     This is triggered when the user clicks the clear button on the VS side
        /// </summary>

        remoteCode.reset();
    },

    registerConsoleCallbacks: function console$messageHandlers$registerConsoleCallbacks(outputCallback, notifyCallback, clearCallback) {
        /// <summary>
        ///     Stores the callbacks used to send messages and commands to the VS side
        /// </summary>
        /// <param name="outputCallback" type="Function">
        ///     The callback function for output results
        /// </param>
        /// <param name="notifyCallback" type="Function">
        ///     The callback function that is used for sending info, warnings, errors, and assert
        ///     to the VS side console
        /// </param>
        /// <param name="clearCallback" type="Function">
        ///     The callback function that will clear the VS side console
        /// </param>        

        // Store the callback for console output messages
        remoteCode.outputCallback = outputCallback;

        // Store the callback for console notification messages
        remoteCode.notifyCallback = notifyCallback;

        // Store the callback for clearing the console
        remoteCode.clearCallback = clearCallback;

        // If we queued up any messages while the port was being created, then fire them now
        for (var i = 0; i < remoteCode.consoleNotificationQueue.length; i++) {
            var notification = remoteCode.consoleNotificationQueue[i];
            remoteCode.onConsoleFunc(notification.functionId, notification.data);
        }
    },

    processInput: function console$messageHandlers$processInput(inputId, input) {
        /// <summary>
        ///     Evals the input string against the current page under debugging and then
        ///     posts back the result to the VS console
        /// </summary>
        /// <param name="inputId" type="Number">
        ///     The unique id to associate with this script eval, this id will be posted back to the VS side
        ///     along with the result of the eval
        /// </param>
        /// <param name="input" type="String">
        ///     The javascript string that is to be evaled on the page
        /// </param>
        /// <returns type="Object">
        ///     The object to return to VS
        /// </returns>

        mainBrowser.document.parentWindow.msWriteProfilerMark("ConsoleRemote:BeginConsoleInvoke");

        // Make sure there is an invoker to evaluate against
        if (!remoteCode.currentWindowContext.__VISUALSTUDIO_CONSOLE_INVOKER) {
            remoteCode.createInvoker(remoteCode.currentWindowContext);
        }

        // Evaluate the input command
        var returnValue = remoteCode.currentWindowContext.__VISUALSTUDIO_CONSOLE_INVOKER(input);

        mainBrowser.document.parentWindow.msWriteProfilerMark("ConsoleRemote:EndConsoleInvoke");

        return remoteCode.createConsoleResult(inputId, returnValue);
    },

    getObjectChildren: function console$messageHandlers$getObjectChildren(identifier) {
        /// <summary>
        ///     Gets the children for a known object that has already been evaluated in the console
        /// </summary>
        /// <param name="identifier" type="String">
        ///     The unique id that identifies the object we want to expand. 
        ///     This is in the form "uid:property"
        /// </param>
        /// <returns type="Object">
        ///     The object to return to VS, or null if the object wasn't mapped
        /// </returns>

        // Process the identifier
        var parts = identifier.split(":", 2);

        // Ensure that this is a valid id
        if (parts.length === 2) {
            var mappedResult = remoteCode.resultMap[parts[0]];

            // Get the output object
            if (mappedResult) {
                var mappedChild = mappedResult[parts[1]];
                if (mappedChild !== undefined) {
                    return remoteCode.createOutputObject(-1, mappedChild);
                }
            }
        }

        // Specifically return null to indicate that no children were found for this item
        return null;
    },

    getHtmlChildren: function console$messageHandlers$getHtmlChildren(uid) {
        /// <summary>
        ///     Get all the child elements from a particular mapped DOM element
        /// </summary>
        /// <param name="uid" type="String">
        ///     The mapped unique id of the DOM element we want to get the children of
        /// </param>        
        /// <returns type="Array">
        ///     An array of mapped nodes that represent the children of the DOM element
        /// </returns> 

        var mappedNode = htmlTreeHelpers.mapping[uid];
        if (!mappedNode || !htmlTreeHelpers.isElementAccessible(mappedNode.ele)) {
            return;
        }

        return htmlTreeHelpers.getChildrenForMappedNode(uid, true);
    },

    getHtmlAttributes: function console$messageHandlers$getHtmlAttributes(uid) {
        /// <summary>
        ///     Get all the HTML attributes of the current specified DOM Element
        /// </summary>
        /// <param name="uid" type="String">
        ///     The mapped unique id of the DOM element we want to get the attributes for
        /// </param>        
        /// <returns type="Array">
        ///     An array of objects that contain a name and value pair for each attribute
        /// </returns> 

        // Ensure we have already mapped the requested DOM element
        var mappedNode = htmlTreeHelpers.mapping[uid];
        if (!mappedNode || !htmlTreeHelpers.isElementAccessible(mappedNode.ele)) {
            return;
        }

        var allAttributes = [];
        var element = mappedNode.ele;
        if (element.attributes) {
            // Create a name/value pair for each attribute and add it to the array
            for (var i = 0; i < element.attributes.length; i++) {
                allAttributes.push({
                    name: element.attributes[i].name,
                    value: element.attributes[i].value
                });
            }
        }
        return allAttributes;
    },

    getObjectItemAsHtml: function console$messageHandlers$getObjectItemAsHtml(identifier) {
        /// <summary>
        ///     Gets the Html representation of an object that has already been evaluated in the console
        /// </summary>
        /// <param name="identifier" type="String">
        ///     The unique id that identifies the object we want to use
        /// </param>
        /// <returns type="Object">
        ///     The object to return to VS, or null if the object wasn't mapped
        /// </returns>

        var mappedItem = null;

        // Process the identifier
        var parts = identifier.split(":", 2);
        if (parts.length === 2) {
            var mappedParent = remoteCode.resultMap[parts[0]];
            if (mappedParent) {
                mappedItem = mappedParent[parts[1]];
            }
        } else if (parts.length === 1) {
            mappedItem = remoteCode.resultMap[identifier];
        }

        // Get the html object
        if (mappedItem) {
            return remoteCode.createOutputHtmlElement(-1, mappedItem, remoteCode.getHtmlViewableTypeName(mappedItem));
        }


        // Specifically return null to indicate that no object could be found for this item
        return null;
    },

    getHtmlItemAsObject: function console$messageHandlers$getHtmlItemAsObject(uid) {
        /// <summary>
        ///     Gets the object representation of an Html element that has already been evaluated in the console
        /// </summary>
        /// <param name="uid" type="String">
        ///     The unique id that identifies the HtmlElement we want to use
        /// </param>
        /// <returns type="Object">
        ///     The object to return to VS, or null if the object wasn't mapped
        /// </returns>

        // Ensure we have already mapped the requested DOM element
        var mappedNode = htmlTreeHelpers.mapping[uid];
        if (!mappedNode || !htmlTreeHelpers.isElementAccessible(mappedNode.ele)) {
            // Specifically return null to indicate that no object could be found for this item
            return null;
        }

        return remoteCode.createOutputObject(-1, mappedNode.ele);
    }


};

remoteCode.initialize();

// SIG // Begin signature block
// SIG // MIIaMgYJKoZIhvcNAQcCoIIaIzCCGh8CAQExCzAJBgUr
// SIG // DgMCGgUAMGcGCisGAQQBgjcCAQSgWTBXMDIGCisGAQQB
// SIG // gjcCAR4wJAIBAQQQEODJBs441BGiowAQS9NQkAIBAAIB
// SIG // AAIBAAIBAAIBADAhMAkGBSsOAwIaBQAEFP+TQBl13oLM
// SIG // 9Uvw7xNacypWak78oIIVLTCCBKAwggOIoAMCAQICCmEZ
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
// SIG // zjEp/w7FW1zYTRuh2Povnj8uVRZryROj/TGCBHEwggRt
// SIG // AgEBMIGHMHkxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpX
// SIG // YXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYD
// SIG // VQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xIzAhBgNV
// SIG // BAMTGk1pY3Jvc29mdCBDb2RlIFNpZ25pbmcgUENBAgph
// SIG // GcyTAAEAAABmMAkGBSsOAwIaBQCggZ4wGQYJKoZIhvcN
// SIG // AQkDMQwGCisGAQQBgjcCAQQwHAYKKwYBBAGCNwIBCzEO
// SIG // MAwGCisGAQQBgjcCARUwIwYJKoZIhvcNAQkEMRYEFAWy
// SIG // KpJ59rUsRkLzCjdtHCaMhUtNMD4GCisGAQQBgjcCAQwx
// SIG // MDAuoBSAEgByAGUAbQBvAHQAZQAuAGoAc6EWgBRodHRw
// SIG // Oi8vbWljcm9zb2Z0LmNvbTANBgkqhkiG9w0BAQEFAASC
// SIG // AQCGRfrp6LN4tygIoBZ74tgBQY8q5W/+Hbupul4fNt5G
// SIG // sRA4JtHaiI+bEUPZdu2/y2sagE9X+6+tcKQXEc08Q8Y9
// SIG // +s4LhoPR+KVwFMZhCppNMM1kuWY3Ifk/DsvU1De3J8mM
// SIG // ykdZGKgogsXnrWlxx6Cee7/u0F8N3QJf6lwHnWQ/nPNk
// SIG // wx3zMqqVWKpOxgZ7NGfR6Sh0H4S5Ibnmyt05TCH2s9uK
// SIG // jt5f0aGA8/gewx3dLkOg53wgjH9yCQEiHDZEpxCBu4KC
// SIG // jlOkPf+gfqRyqxV+WNxPQvdJ990mQOMCeHA3zPXWgYLp
// SIG // WTByAmQuXT1Dy1DvhkCmAhBpLy9zzq6i/EVkoYICHTCC
// SIG // AhkGCSqGSIb3DQEJBjGCAgowggIGAgEBMIGFMHcxCzAJ
// SIG // BgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAw
// SIG // DgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3Nv
// SIG // ZnQgQ29ycG9yYXRpb24xITAfBgNVBAMTGE1pY3Jvc29m
// SIG // dCBUaW1lLVN0YW1wIFBDQQIKYQUTNgAAAAAAGjAHBgUr
// SIG // DgMCGqBdMBgGCSqGSIb3DQEJAzELBgkqhkiG9w0BBwEw
// SIG // HAYJKoZIhvcNAQkFMQ8XDTEyMDcyNzAxNDYyNlowIwYJ
// SIG // KoZIhvcNAQkEMRYEFHu04MoAixNHwiOwpqIGL4gw1FiG
// SIG // MA0GCSqGSIb3DQEBBQUABIIBADoLlNhr5yYA9MAPtGHx
// SIG // hUtMYdTQ3JKctQbyuA7jm7mmjKBl25ecJkUocB6xYX1Q
// SIG // +BQaciqOzvu6D4WZkBh4Bbdm0PysN8WCgKYvPGUllCR2
// SIG // orZiJEHfLklJcqMBJ6PaM9CleGjqplKoQzVccgDvRz4B
// SIG // wtk2/S/pu/in7gk/ofCRv4+MQXfiTqt+5LF/cEWALw1G
// SIG // XDzhryPh26FzgCI94ApV26I2B4H1NjhOfI0kHyJLj+CP
// SIG // EtD5zQlgEkbhjSukO/oTFZ9hQIaAJg+uW7PIdjZmaYun
// SIG // dYbYYqLaWxGt2gnEwlKnPqwQqPjO5uxvq7eaHDvrumKt
// SIG // uHbMW6+wAi/Vgys=
// SIG // End signature block
