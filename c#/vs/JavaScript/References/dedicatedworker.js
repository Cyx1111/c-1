(function () {
	var _eventManager = _$createEventManager(
	function getEventObject(type, attach, obj, ignoreCase) {
		function _eventTypeToObject(type, attach) {
			if(attach) return Event;
			switch (type) {
				case 'close':
					return CloseEvent;
				case 'error':
					return ErrorEvent;
				case 'upgradeneeded':
					return IDBVersionChangeEvent;
				case 'message':
					return MessageEvent;
				case 'loadend':
				case 'progress':
					return ProgressEvent;
			};
			return Event;
		}
		var e = _eventTypeToObject(type, attach);
		var eventObject = Object.create(e);
		eventObject.target = obj;
		eventObject.currentTarget = obj;
		eventObject.type = type;
		if (eventObject.relatedTarget)
			eventObject.relatedTarget = obj;
		return eventObject;
	});
	var _events = _eventManager.createEventProperties;

	var WorkerTimers = {};
	var WindowBase64 = {};
	var WorkerTimersExtension = {};
	var WorkerUtils = {};
	var MSEventExtensions = {};
	var Event = {};
	var IDBVersionChangeEvent = _$inherit(Event);
	var EventTarget = {};
	var AbstractWorker = {};
	var Worker = {};
	var WorkerCtor = function() { return Object.create(Worker); };
	var WindowConsole = {};
	var IDBKeyRange = {};
	var Blob = {};
	var BlobCtor = function() { return Object.create(Blob); };
	var MSXMLHttpRequestExtensions = {};
	var MSApp = {};
	var MSBaseReader = {};
	var FileReader = {};
	var FileReaderCtor = function() { return Object.create(FileReader); };
	var ImageData = {};
	var MessagePort = {};
	var IDBRequest = {};
	var IDBObjectStore = {};
	var WorkerLocation = {};
	var ProgressEvent = _$inherit(Event);
	var CloseEvent = _$inherit(Event);
	var WebSocket = {};
	var WebSocketCtor = function() { return Object.create(WebSocket); };
	var DOMError = {};
	var MSWorkerGlobalScopeExtensions = {};
	var MessageEvent = _$inherit(Event);
	var DOMException = {};
	var FileReaderSync = {};
	var FileReaderSyncCtor = function() { return Object.create(FileReaderSync); };
	var MSUnsafeFunctionCallback = {};
	var MessageChannel = {};
	var MessageChannelCtor = function() { return Object.create(MessageChannel); };
	var DedicatedWorkerGlobalScope = {};
	var WorkerGlobalScope = this;
	var IDBOpenDBRequest = _$inherit(IDBRequest);
	var XMLHttpRequestEventTarget = {};
	var DOMStringList = {};
	var IDBDatabase = {};
	var IDBFactory = {};
	var NavigatorOnLine = {};
	var CanvasPixelArray = {};
	var IDBCursor = {};
	var IDBCursorWithValue = _$inherit(IDBCursor);
	var EventException = {};
	var Console = {};
	var EventListener = {};
	var MSBlobBuilder = {};
	var MSBlobBuilderCtor = function() { return Object.create(MSBlobBuilder); };
	var MSStreamReader = {};
	var MSStreamReaderCtor = function() { return Object.create(MSStreamReader); };
	var File = _$inherit(Blob);
	var MSStream = {};
	var ErrorEvent = _$inherit(Event);
	var NavigatorID = {};
	var WorkerNavigator = {};
	var IDBTransaction = {};
	var FileList = {};
	var IDBIndex = {};
	var XMLHttpRequest = {};
	var XMLHttpRequestCtor = function() { return Object.create(XMLHttpRequest); };

	/* -- type: WorkerTimers -- */

	WorkerTimers.clearTimeout = function(handle) { 
		/// <signature>
		/// <param name='handle' type='Number' />
		/// </signature>
	};
	WorkerTimers.setTimeout = function(handler, timeout, args) { 
		/// <signature>
		/// <param name='handler' type='Object' />
		/// <param name='timeout' type='Object' optional='true' />
		/// <param name='args' type='Object' />
		/// <returns type='Number'/>
		/// </signature>
		return 0; 
	};
	WorkerTimers.clearInterval = function(handle) { 
		/// <signature>
		/// <param name='handle' type='Number' />
		/// </signature>
	};
	WorkerTimers.setInterval = function(handler, timeout, args) { 
		/// <signature>
		/// <param name='handler' type='Object' />
		/// <param name='timeout' type='Object' optional='true' />
		/// <param name='args' type='Object' />
		/// <returns type='Number'/>
		/// </signature>
		return 0; 
	};


	/* -- type: WindowBase64 -- */

	WindowBase64.btoa = function(rawString) { 
		/// <signature>
		/// <param name='rawString' type='String' />
		/// <returns type='String'/>
		/// </signature>
		return ''; 
	};
	WindowBase64.atob = function(encodedString) { 
		/// <signature>
		/// <param name='encodedString' type='String' />
		/// <returns type='String'/>
		/// </signature>
		return ''; 
	};


	/* -- type: WorkerTimersExtension -- */

	WorkerTimersExtension.clearImmediate = function(handle) { 
		/// <signature>
		/// <param name='handle' type='Number' />
		/// </signature>
	};
	WorkerTimersExtension.setImmediate = function(handler, args) { 
		/// <signature>
		/// <param name='handler' type='Object' />
		/// <param name='args' type='Object' optional='true' />
		/// <returns type='Number'/>
		/// </signature>
		return 0; 
	};


	/* -- type: WorkerUtils -- */
	_$implement(WorkerUtils, WorkerTimersExtension);
	_$implement(WorkerUtils, WindowBase64);
	_$implement(WorkerUtils, WorkerTimers);

	WorkerUtils.navigator = WorkerNavigator;
	WorkerUtils.msIndexedDB = IDBFactory;
	WorkerUtils.indexedDB = IDBFactory;
	WorkerUtils.importScripts = function(urls) { 
		/// <signature>
		/// <param name='urls' type='String' />
		/// </signature>
		for (var i = 0; i < arguments.length; i++) _$asyncRequests.add({ src: arguments[i] });
	};


	/* -- type: MSEventExtensions -- */

	MSEventExtensions.cancelBubble = false;
	MSEventExtensions.srcElement = new Object();


	/* -- type: Event -- */
	_$implement(Event, MSEventExtensions);

	Event.timeStamp = 0;
	Event.defaultPrevented = false;
	Event.isTrusted = false;
	Event.currentTarget = EventTarget;
	Event.target = EventTarget;
	Event.eventPhase = 0;
	Event.type = '';
	Event.cancelable = false;
	Event.bubbles = false;
	Event.CAPTURING_PHASE = 1;
	Event.AT_TARGET = 2;
	Event.BUBBLING_PHASE = 3;
	Event.initEvent = function(eventTypeArg, canBubbleArg, cancelableArg) { 
		/// <signature>
		/// <param name='eventTypeArg' type='String' />
		/// <param name='canBubbleArg' type='Boolean' />
		/// <param name='cancelableArg' type='Boolean' />
		/// </signature>
	};
	Event.stopPropagation = function() { };
	Event.stopImmediatePropagation = function() { };
	Event.preventDefault = function() { };


	/* -- type: IDBVersionChangeEvent -- */

	IDBVersionChangeEvent.newVersion = 0;
	IDBVersionChangeEvent.oldVersion = 0;


	/* -- type: EventTarget -- */

	EventTarget.removeEventListener = function(type, listener, useCapture) { 
		/// <signature>
		/// <param name='type' type='String' />
		/// <param name='listener' type='EventListener' />
		/// <param name='useCapture' type='Boolean' optional='true' />
		/// </signature>
	};
	EventTarget.addEventListener = function(type, listener, useCapture) { 
		/// <signature>
		/// <param name='type' type='String' />
		/// <param name='listener' type='EventListener' />
		/// <param name='useCapture' type='Boolean' optional='true' />
		/// </signature>
		_eventManager.add(this, type, listener);
	};
	EventTarget.dispatchEvent = function(evt) { 
		/// <signature>
		/// <param name='evt' type='Event' />
		/// <returns type='Boolean'/>
		/// </signature>
		return false; 
	};


	/* -- type: AbstractWorker -- */
	_$implement(AbstractWorker, EventTarget);

	_events(AbstractWorker, "onerror");


	/* -- type: Worker -- */
	_$implement(Worker, AbstractWorker);

	Worker.postMessage = function(message, ports) { 
		/// <signature>
		/// <param name='message' type='Object' />
		/// <param name='ports' type='Object' optional='true' />
		/// </signature>
	};
	Worker.terminate = function() { };
	_events(Worker, "onmessage");


	/* -- type: WindowConsole -- */

	WindowConsole.console = Console;


	/* -- type: IDBKeyRange -- */

	IDBKeyRange.upperOpen = false;
	IDBKeyRange.upper = new Object();
	IDBKeyRange.lowerOpen = false;
	IDBKeyRange.lower = new Object();
	IDBKeyRange.bound = function(lower, upper, lowerOpen, upperOpen) { 
		/// <signature>
		/// <param name='lower' type='Object' />
		/// <param name='upper' type='Object' />
		/// <param name='lowerOpen' type='Boolean' optional='true' />
		/// <param name='upperOpen' type='Boolean' optional='true' />
		/// <returns type='IDBKeyRange'/>
		/// </signature>
		return IDBKeyRange; 
	};
	IDBKeyRange.only = function(value) { 
		/// <signature>
		/// <param name='value' type='Object' />
		/// <returns type='IDBKeyRange'/>
		/// </signature>
		return IDBKeyRange; 
	};
	IDBKeyRange.upperBound = function(bound, open) { 
		/// <signature>
		/// <param name='bound' type='Object' />
		/// <param name='open' type='Boolean' optional='true' />
		/// <returns type='IDBKeyRange'/>
		/// </signature>
		return IDBKeyRange; 
	};
	IDBKeyRange.lowerBound = function(bound, open) { 
		/// <signature>
		/// <param name='bound' type='Object' />
		/// <param name='open' type='Boolean' optional='true' />
		/// <returns type='IDBKeyRange'/>
		/// </signature>
		return IDBKeyRange; 
	};


	/* -- type: Blob -- */

	Blob.type = '';
	Blob.size = 0;
	Blob.msDetachStream = function() { 
		/// <signature>
		/// <returns type='Object'/>
		/// </signature>
		return new Object(); 
	};
	Blob.msClose = function() { };
	Blob.slice = function(start, end, contentType) { 
		/// <signature>
		/// <param name='start' type='Number' optional='true' />
		/// <param name='end' type='Number' optional='true' />
		/// <param name='contentType' type='String' optional='true' />
		/// <returns type='Blob'/>
		/// </signature>
		return Blob; 
	};


	/* -- type: MSXMLHttpRequestExtensions -- */

	MSXMLHttpRequestExtensions.responseBody = new Object();
	MSXMLHttpRequestExtensions.response = new Object();
	MSXMLHttpRequestExtensions.responseType = '';
	MSXMLHttpRequestExtensions.timeout = 0;
	MSXMLHttpRequestExtensions.upload = XMLHttpRequestEventTarget;
	_events(MSXMLHttpRequestExtensions, "onprogress", "ontimeout", "onabort", "onloadend", "onerror", "onloadstart");


	/* -- type: MSApp -- */

	MSApp.createFileFromStorageFile = function(storageFile) { 
		/// <signature>
		/// <param name='storageFile' type='Object' />
		/// <returns type='File'/>
		/// </signature>
		return File; 
	};
	MSApp.createDataPackage = function(object) { 
		/// <signature>
		/// <param name='object' type='Object' />
		/// <returns type='Object'/>
		/// </signature>
		return new Object(); 
	};
	MSApp.terminateApp = function(exceptionObject) { 
		/// <signature>
		/// <param name='exceptionObject' type='Object' />
		/// </signature>
	};
	MSApp.createStreamFromInputStream = function(type, inputStream) { 
		/// <signature>
		/// <param name='type' type='String' />
		/// <param name='inputStream' type='Object' />
		/// <returns type='MSStream'/>
		/// </signature>
		return MSStream; 
	};
	MSApp.createBlobFromRandomAccessStream = function(type, seeker) { 
		/// <signature>
		/// <param name='type' type='String' />
		/// <param name='seeker' type='Object' />
		/// <returns type='Blob'/>
		/// </signature>
		return Blob; 
	};
	MSApp.execUnsafeLocalFunction = function(unsafeFunction) { 
		/// <signature>
		/// <param name='unsafeFunction' type='MSUnsafeFunctionCallback' />
		/// <returns type='Object'/>
		/// </signature>
		return new Object(); 
	};
	MSApp.getHtmlPrintDocumentSource = function(htmlDoc, printTemplate) { 
		/// <signature>
		/// <param name='htmlDoc' type='Object' />
		/// <param name='printTemplate' type='String' optional='true' />
		/// <returns type='Object'/>
		/// </signature>
		return new Object(); 
	};
	MSApp.addPublicLocalApplicationUri = function(uri) { 
		/// <signature>
		/// <param name='uri' type='String' />
		/// </signature>
	};
	MSApp.createDataPackageFromSelection = function() { 
		/// <signature>
		/// <returns type='Object'/>
		/// </signature>
		return new Object(); 
	};


	/* -- type: MSBaseReader -- */
	_$implement(MSBaseReader, EventTarget);

	MSBaseReader.readyState = 0;
	MSBaseReader.result = new Object();
	MSBaseReader.LOADING = 1;
	MSBaseReader.DONE = 2;
	MSBaseReader.EMPTY = 0;
	MSBaseReader.abort = function() { };
	_events(MSBaseReader, "onprogress", "onabort", "onloadend", "onerror", "onload", "onloadstart");


	/* -- type: FileReader -- */
	_$implement(FileReader, MSBaseReader);

	FileReader.error = DOMError;
	FileReader.readAsArrayBuffer = function(blob) { 
		/// <signature>
		/// <param name='blob' type='Blob' />
		/// </signature>
	};
	FileReader.readAsDataURL = function(blob) { 
		/// <signature>
		/// <param name='blob' type='Blob' />
		/// </signature>
	};
	FileReader.readAsText = function(blob, encoding) { 
		/// <signature>
		/// <param name='blob' type='Blob' />
		/// <param name='encoding' type='String' optional='true' />
		/// </signature>
	};


	/* -- type: ImageData -- */

	ImageData.width = 0;
	ImageData.data = CanvasPixelArray;
	ImageData.height = 0;


	/* -- type: MessagePort -- */
	_$implement(MessagePort, EventTarget);

	MessagePort.close = function() { };
	MessagePort.postMessage = function(message, ports) { 
		/// <signature>
		/// <param name='message' type='Object' />
		/// <param name='ports' type='Object' optional='true' />
		/// </signature>
	};
	MessagePort.start = function() { };
	_events(MessagePort, "onmessage");


	/* -- type: IDBRequest -- */
	_$implement(IDBRequest, EventTarget);

	IDBRequest.source = new Object();
	IDBRequest.transaction = IDBTransaction;
	IDBRequest.error = DOMError;
	IDBRequest.readyState = '';
	IDBRequest.result = new Object();
	_events(IDBRequest, "onsuccess", "onerror");


	/* -- type: IDBObjectStore -- */

	IDBObjectStore.indexNames = DOMStringList;
	IDBObjectStore.transaction = IDBTransaction;
	IDBObjectStore.name = '';
	IDBObjectStore.keyPath = '';
	IDBObjectStore.count = function(key) { 
		/// <signature>
		/// <param name='key' type='Object' optional='true' />
		/// <returns type='IDBRequest'/>
		/// </signature>
		return _createIDBRequest(IDBRequest, this, 0);
	};
	IDBObjectStore.add = function(value, key) { 
		/// <signature>
		/// <param name='value' type='Object' />
		/// <param name='key' type='Object' optional='true' />
		/// <returns type='IDBRequest'/>
		/// </signature>
		return _createIDBRequest(IDBRequest, this, key);
	};
	IDBObjectStore.createIndex = function(name, keyPath, optionalParameters) { 
		/// <signature>
		/// <param name='name' type='String' />
		/// <param name='keyPath' type='String' />
		/// <param name='optionalParameters' type='Object' optional='true' />
		/// <returns type='IDBIndex'/>
		/// </signature>
		return IDBIndex; 
	};
	IDBObjectStore.clear = function() { 
		/// <signature>
		/// <returns type='IDBRequest'/>
		/// </signature>
		return _createIDBRequest(IDBRequest, this, undefined);
	};
	IDBObjectStore.put = function(value, key) { 
		/// <signature>
		/// <param name='value' type='Object' />
		/// <param name='key' type='Object' optional='true' />
		/// <returns type='IDBRequest'/>
		/// </signature>
		return _createIDBRequest(IDBRequest, this, key);
	};
	IDBObjectStore.deleteIndex = function(indexName) { 
		/// <signature>
		/// <param name='indexName' type='String' />
		/// </signature>
	};
	IDBObjectStore.openCursor = function(range, direction) { 
		/// <signature>
		/// <param name='range' type='Object' optional='true' />
		/// <param name='direction' type='String' optional='true' />
		/// <returns type='IDBRequest'/>
		/// </signature>
		var cursor = Object.create(IDBCursorWithValue); cursor.source = this; return _createIDBRequest(IDBRequest, this, cursor);
	};
	IDBObjectStore.index = function(name) { 
		/// <signature>
		/// <param name='name' type='String' />
		/// <returns type='IDBIndex'/>
		/// </signature>
		return IDBIndex; 
	};
	IDBObjectStore.delete = function(key) { 
		/// <signature>
		/// <param name='key' type='Object' />
		/// <returns type='IDBRequest'/>
		/// </signature>
		return _createIDBRequest(IDBRequest, this, undefined);
	};
	IDBObjectStore.get = function(key) { 
		/// <signature>
		/// <param name='key' type='Object' />
		/// <returns type='IDBRequest'/>
		/// </signature>
		return _createIDBRequest(IDBRequest, this, new Object());
	};


	/* -- type: WorkerLocation -- */

	WorkerLocation.protocol = '';
	WorkerLocation.hash = '';
	WorkerLocation.search = '';
	WorkerLocation.href = '';
	WorkerLocation.hostname = '';
	WorkerLocation.pathname = '';
	WorkerLocation.port = '';
	WorkerLocation.host = '';
	WorkerLocation.toString = function() { 
		/// <signature>
		/// <returns type='String'/>
		/// </signature>
		return ''; 
	};


	/* -- type: ProgressEvent -- */

	ProgressEvent.loaded = 0;
	ProgressEvent.lengthComputable = false;
	ProgressEvent.total = 0;
	ProgressEvent.initProgressEvent = function(typeArg, canBubbleArg, cancelableArg, lengthComputableArg, loadedArg, totalArg) { 
		/// <signature>
		/// <param name='typeArg' type='String' />
		/// <param name='canBubbleArg' type='Boolean' />
		/// <param name='cancelableArg' type='Boolean' />
		/// <param name='lengthComputableArg' type='Boolean' />
		/// <param name='loadedArg' type='Number' />
		/// <param name='totalArg' type='Number' />
		/// </signature>
	};


	/* -- type: CloseEvent -- */

	CloseEvent.wasClean = false;
	CloseEvent.reason = '';
	CloseEvent.code = 0;
	CloseEvent.initCloseEvent = function(typeArg, canBubbleArg, cancelableArg, wasCleanArg, codeArg, reasonArg) { 
		/// <signature>
		/// <param name='typeArg' type='String' />
		/// <param name='canBubbleArg' type='Boolean' />
		/// <param name='cancelableArg' type='Boolean' />
		/// <param name='wasCleanArg' type='Boolean' />
		/// <param name='codeArg' type='Number' />
		/// <param name='reasonArg' type='String' />
		/// </signature>
	};


	/* -- type: WebSocket -- */
	_$implement(WebSocket, EventTarget);

	WebSocketCtor.CLOSING = 2;
	WebSocketCtor.OPEN = 1;
	WebSocketCtor.CLOSED = 3;
	WebSocketCtor.CONNECTING = 0;
	WebSocket.protocol = '';
	WebSocket.bufferedAmount = 0;
	WebSocket.readyState = 0;
	WebSocket.extensions = '';
	WebSocket.binaryType = '';
	WebSocket.url = '';
	WebSocket.CLOSING = 2;
	WebSocket.OPEN = 1;
	WebSocket.CLOSED = 3;
	WebSocket.CONNECTING = 0;
	WebSocket.close = function(code, reason) { 
		/// <signature>
		/// <param name='code' type='Number' optional='true' />
		/// <param name='reason' type='String' optional='true' />
		/// </signature>
	};
	WebSocket.send = function(data) { 
		/// <signature>
		/// <param name='data' type='Object' />
		/// </signature>
	};
	_events(WebSocket, "onopen", "onmessage", "onclose", "onerror");


	/* -- type: DOMError -- */

	DOMError.name = '';
	DOMError.toString = function() { 
		/// <signature>
		/// <returns type='String'/>
		/// </signature>
		return ''; 
	};


	/* -- type: MSWorkerGlobalScopeExtensions -- */

	MSWorkerGlobalScopeExtensions.msWriteProfilerMark = function(profilerMarkName) { 
		/// <signature>
		/// <param name='profilerMarkName' type='String' />
		/// </signature>
	};


	/* -- type: MessageEvent -- */

	MessageEvent.source = new Object();
	MessageEvent.ports = new Object();
	MessageEvent.origin = '';
	MessageEvent.data = new Object();
	MessageEvent.initMessageEvent = function(typeArg, canBubbleArg, cancelableArg, dataArg, originArg, lastEventIdArg, sourceArg) { 
		/// <signature>
		/// <param name='typeArg' type='String' />
		/// <param name='canBubbleArg' type='Boolean' />
		/// <param name='cancelableArg' type='Boolean' />
		/// <param name='dataArg' type='Object' />
		/// <param name='originArg' type='String' />
		/// <param name='lastEventIdArg' type='String' />
		/// <param name='sourceArg' type='Object' />
		/// </signature>
	};


	/* -- type: DOMException -- */

	DOMException.name = '';
	DOMException.code = 0;
	DOMException.message = '';
	DOMException.HIERARCHY_REQUEST_ERR = 3;
	DOMException.NO_MODIFICATION_ALLOWED_ERR = 7;
	DOMException.DATA_CLONE_ERR = 25;
	DOMException.INVALID_MODIFICATION_ERR = 13;
	DOMException.NAMESPACE_ERR = 14;
	DOMException.INVALID_CHARACTER_ERR = 5;
	DOMException.TYPE_MISMATCH_ERR = 17;
	DOMException.ABORT_ERR = 20;
	DOMException.INVALID_STATE_ERR = 11;
	DOMException.SECURITY_ERR = 18;
	DOMException.NETWORK_ERR = 19;
	DOMException.WRONG_DOCUMENT_ERR = 4;
	DOMException.INVALID_NODE_TYPE_ERR = 24;
	DOMException.QUOTA_EXCEEDED_ERR = 22;
	DOMException.INDEX_SIZE_ERR = 1;
	DOMException.SYNTAX_ERR = 12;
	DOMException.DOMSTRING_SIZE_ERR = 2;
	DOMException.SERIALIZE_ERR = 82;
	DOMException.VALIDATION_ERR = 16;
	DOMException.NOT_FOUND_ERR = 8;
	DOMException.URL_MISMATCH_ERR = 21;
	DOMException.PARSE_ERR = 81;
	DOMException.NO_DATA_ALLOWED_ERR = 6;
	DOMException.NOT_SUPPORTED_ERR = 9;
	DOMException.TIMEOUT_ERR = 23;
	DOMException.INVALID_ACCESS_ERR = 15;
	DOMException.INUSE_ATTRIBUTE_ERR = 10;
	DOMException.toString = function() { 
		/// <signature>
		/// <returns type='String'/>
		/// </signature>
		return ''; 
	};


	/* -- type: FileReaderSync -- */

	FileReaderSync.readAsArrayBuffer = function(blob) { 
		/// <signature>
		/// <param name='blob' type='Blob' />
		/// <returns type='Object'/>
		/// </signature>
		return new Object(); 
	};
	FileReaderSync.readAsDataURL = function(blob) { 
		/// <signature>
		/// <param name='blob' type='Blob' />
		/// <returns type='String'/>
		/// </signature>
		return ''; 
	};
	FileReaderSync.readAsText = function(blob, encoding) { 
		/// <signature>
		/// <param name='blob' type='Blob' />
		/// <param name='encoding' type='String' optional='true' />
		/// <returns type='String'/>
		/// </signature>
		return ''; 
	};


	/* -- type: MSUnsafeFunctionCallback -- */

	MSUnsafeFunctionCallback.callback = function() { 
		/// <signature>
		/// <returns type='Object'/>
		/// </signature>
		return new Object(); 
	};


	/* -- type: MessageChannel -- */

	MessageChannel.port2 = MessagePort;
	MessageChannel.port1 = MessagePort;


	/* -- type: DedicatedWorkerGlobalScope -- */

	DedicatedWorkerGlobalScope.postMessage = function(data) { 
		/// <signature>
		/// <param name='data' type='Object' />
		/// </signature>
	};
	_events(DedicatedWorkerGlobalScope, "onmessage");


	/* -- type: WorkerGlobalScope -- */
	_$implement(WorkerGlobalScope, EventTarget);
	_$implement(WorkerGlobalScope, WindowConsole);
	_$implement(WorkerGlobalScope, DedicatedWorkerGlobalScope);
	_$implement(WorkerGlobalScope, MSWorkerGlobalScopeExtensions);
	_$implement(WorkerGlobalScope, WorkerUtils);

	WorkerGlobalScope.location = WorkerLocation;
	WorkerGlobalScope.self = _$getTrackingNull(Object.create(WorkerGlobalScope));
	WorkerGlobalScope.close = function() { };
	WorkerGlobalScope.toString = function() { 
		/// <signature>
		/// <returns type='String'/>
		/// </signature>
		return ''; 
	};
	_events(WorkerGlobalScope, "onerror");


	/* -- type: IDBOpenDBRequest -- */

	_events(IDBOpenDBRequest, "onupgradeneeded", "onblocked");


	/* -- type: XMLHttpRequestEventTarget -- */
	_$implement(XMLHttpRequestEventTarget, EventTarget);

	_events(XMLHttpRequestEventTarget, "onload", "onerror", "onprogress", "ontimeout", "onabort", "onloadend", "onloadstart");


	/* -- type: DOMStringList -- */

	DOMStringList.length = 0;
	DOMStringList.contains = function(str) { 
		/// <signature>
		/// <param name='str' type='String' />
		/// <returns type='Boolean'/>
		/// </signature>
		return false; 
	};
	DOMStringList.item = function(index) { 
		/// <signature>
		/// <param name='index' type='Number' />
		/// <returns type='String'/>
		/// </signature>
		return this[index] || _$getTrackingNull(''); 
	};
	/* Add a single array element */
	DOMStringList[0] = _$getTrackingNull('');


	/* -- type: IDBDatabase -- */
	_$implement(IDBDatabase, EventTarget);

	IDBDatabase.version = '';
	IDBDatabase.objectStoreNames = DOMStringList;
	IDBDatabase.name = '';
	IDBDatabase.close = function() { };
	IDBDatabase.createObjectStore = function(name, optionalParameters) { 
		/// <signature>
		/// <param name='name' type='String' />
		/// <param name='optionalParameters' type='Object' optional='true' />
		/// <returns type='IDBObjectStore'/>
		/// </signature>
		return IDBObjectStore; 
	};
	IDBDatabase.transaction = function(storeNames, mode) { 
		/// <signature>
		/// <param name='storeNames' type='Object' />
		/// <param name='mode' type='String' optional='true' />
		/// <returns type='IDBTransaction'/>
		/// </signature>
		return IDBTransaction; 
	};
	IDBDatabase.deleteObjectStore = function(name) { 
		/// <signature>
		/// <param name='name' type='String' />
		/// </signature>
	};
	_events(IDBDatabase, "onerror", "onabort");


	/* -- type: IDBFactory -- */

	IDBFactory.open = function(name, version) { 
		/// <signature>
		/// <param name='name' type='String' />
		/// <param name='version' type='Number' optional='true' />
		/// <returns type='IDBOpenDBRequest'/>
		/// </signature>
		return _createIDBRequest(IDBOpenDBRequest, null, Object.create(IDBDatabase));
	};
	IDBFactory.cmp = function(first, second) { 
		/// <signature>
		/// <param name='first' type='Object' />
		/// <param name='second' type='Object' />
		/// <returns type='Number'/>
		/// </signature>
		return 0; 
	};
	IDBFactory.deleteDatabase = function(name) { 
		/// <signature>
		/// <param name='name' type='String' />
		/// <returns type='IDBOpenDBRequest'/>
		/// </signature>
		return _createIDBRequest(IDBOpenDBRequest, null, null);
	};


	/* -- type: NavigatorOnLine -- */

	NavigatorOnLine.onLine = false;


	/* -- type: CanvasPixelArray -- */

	CanvasPixelArray.length = 0;


	/* -- type: IDBCursor -- */

	IDBCursor.direction = '';
	IDBCursor.source = new Object();
	IDBCursor.primaryKey = new Object();
	IDBCursor.key = new Object();
	IDBCursor.advance = function(count) { 
		/// <signature>
		/// <param name='count' type='Number' />
		/// </signature>
	};
	IDBCursor.delete = function() { 
		/// <signature>
		/// <returns type='IDBRequest'/>
		/// </signature>
		return _createIDBRequest(IDBRequest, this, undefined);
	};
	IDBCursor.continue = function(key) { 
		/// <signature>
		/// <param name='key' type='Object' optional='true' />
		/// </signature>
	};
	IDBCursor.update = function(value) { 
		/// <signature>
		/// <param name='value' type='Object' />
		/// <returns type='IDBRequest'/>
		/// </signature>
		return _createIDBRequest(IDBRequest, this, value);
	};


	/* -- type: IDBCursorWithValue -- */

	IDBCursorWithValue.value = new Object();


	/* -- type: EventException -- */

	EventException.name = '';
	EventException.code = 0;
	EventException.message = '';
	EventException.DISPATCH_REQUEST_ERR = 1;
	EventException.UNSPECIFIED_EVENT_TYPE_ERR = 0;
	EventException.toString = function() { 
		/// <signature>
		/// <returns type='String'/>
		/// </signature>
		return ''; 
	};


	/* -- type: Console -- */

	Console.profile = function(reportName) { 
		/// <signature>
		/// <param name='reportName' type='String' optional='true' />
		/// </signature>
	};
	Console.info = function(message, optionalParams) { 
		/// <signature>
		/// <param name='message' type='String' optional='true' />
		/// <param name='optionalParams' type='Object' />
		/// </signature>
	};
	Console.assert = function(test, message, optionalParams) { 
		/// <signature>
		/// <param name='test' type='Boolean' optional='true' />
		/// <param name='message' type='String' optional='true' />
		/// <param name='optionalParams' type='Object' />
		/// </signature>
	};
	Console.clear = function() { };
	Console.msIsIndependentlyComposed = function(element) { 
		/// <signature>
		/// <param name='element' type='Object' />
		/// <returns type='Boolean'/>
		/// </signature>
		return false; 
	};
	Console.dir = function(value, optionalParams) { 
		/// <signature>
		/// <param name='value' type='Object' optional='true' />
		/// <param name='optionalParams' type='Object' />
		/// </signature>
	};
	Console.warn = function(message, optionalParams) { 
		/// <signature>
		/// <param name='message' type='String' optional='true' />
		/// <param name='optionalParams' type='Object' />
		/// </signature>
	};
	Console.error = function(message, optionalParams) { 
		/// <signature>
		/// <param name='message' type='String' optional='true' />
		/// <param name='optionalParams' type='Object' />
		/// </signature>
	};
	Console.log = function(message, optionalParams) { 
		/// <signature>
		/// <param name='message' type='String' optional='true' />
		/// <param name='optionalParams' type='Object' />
		/// </signature>
	};
	Console.profileEnd = function() { };


	/* -- type: EventListener -- */

	EventListener.handleEvent = function(evt) { 
		/// <signature>
		/// <param name='evt' type='Event' />
		/// </signature>
	};


	/* -- type: MSBlobBuilder -- */

	MSBlobBuilder.append = function(data, endings) { 
		/// <signature>
		/// <param name='data' type='Object' />
		/// <param name='endings' type='String' optional='true' />
		/// </signature>
	};
	MSBlobBuilder.getBlob = function(contentType) { 
		/// <signature>
		/// <param name='contentType' type='String' optional='true' />
		/// <returns type='Blob'/>
		/// </signature>
		return Blob; 
	};


	/* -- type: MSStreamReader -- */
	_$implement(MSStreamReader, MSBaseReader);

	MSStreamReader.error = DOMError;
	MSStreamReader.readAsArrayBuffer = function(stream, size) { 
		/// <signature>
		/// <param name='stream' type='MSStream' />
		/// <param name='size' type='Number' optional='true' />
		/// </signature>
	};
	MSStreamReader.readAsBlob = function(stream, size) { 
		/// <signature>
		/// <param name='stream' type='MSStream' />
		/// <param name='size' type='Number' optional='true' />
		/// </signature>
	};
	MSStreamReader.readAsDataURL = function(stream, size) { 
		/// <signature>
		/// <param name='stream' type='MSStream' />
		/// <param name='size' type='Number' optional='true' />
		/// </signature>
	};
	MSStreamReader.readAsText = function(stream, encoding, size) { 
		/// <signature>
		/// <param name='stream' type='MSStream' />
		/// <param name='encoding' type='String' optional='true' />
		/// <param name='size' type='Number' optional='true' />
		/// </signature>
	};


	/* -- type: File -- */

	File.lastModifiedDate = new Object();
	File.name = '';


	/* -- type: MSStream -- */

	MSStream.type = '';
	MSStream.msDetachStream = function() { 
		/// <signature>
		/// <returns type='Object'/>
		/// </signature>
		return new Object(); 
	};
	MSStream.msClose = function() { };


	/* -- type: ErrorEvent -- */

	ErrorEvent.colno = 0;
	ErrorEvent.filename = '';
	ErrorEvent.lineno = 0;
	ErrorEvent.message = '';
	ErrorEvent.initErrorEvent = function(typeArg, canBubbleArg, cancelableArg, messageArg, filenameArg, linenoArg) { 
		/// <signature>
		/// <param name='typeArg' type='String' />
		/// <param name='canBubbleArg' type='Boolean' />
		/// <param name='cancelableArg' type='Boolean' />
		/// <param name='messageArg' type='String' />
		/// <param name='filenameArg' type='String' />
		/// <param name='linenoArg' type='Number' />
		/// </signature>
	};


	/* -- type: NavigatorID -- */

	NavigatorID.appVersion = '';
	NavigatorID.appName = '';
	NavigatorID.userAgent = '';
	NavigatorID.platform = '';


	/* -- type: WorkerNavigator -- */
	_$implement(WorkerNavigator, NavigatorOnLine);
	_$implement(WorkerNavigator, NavigatorID);



	/* -- type: IDBTransaction -- */
	_$implement(IDBTransaction, EventTarget);

	IDBTransaction.db = IDBDatabase;
	IDBTransaction.mode = '';
	IDBTransaction.error = DOMError;
	IDBTransaction.abort = function() { };
	IDBTransaction.objectStore = function(name) { 
		/// <signature>
		/// <param name='name' type='String' />
		/// <returns type='IDBObjectStore'/>
		/// </signature>
		return IDBObjectStore; 
	};
	_events(IDBTransaction, "oncomplete", "onerror", "onabort");


	/* -- type: FileList -- */

	FileList.length = 0;
	FileList.item = function(index) { 
		/// <signature>
		/// <param name='index' type='Number' />
		/// <returns type='File'/>
		/// </signature>
		return this[index] || _$getTrackingNull(Object.create(File)); 
	};
	/* Add a single array element */
	FileList[0] = _$getTrackingNull(Object.create(File));


	/* -- type: IDBIndex -- */

	IDBIndex.unique = false;
	IDBIndex.name = '';
	IDBIndex.keyPath = '';
	IDBIndex.objectStore = IDBObjectStore;
	IDBIndex.count = function(key) { 
		/// <signature>
		/// <param name='key' type='Object' optional='true' />
		/// <returns type='IDBRequest'/>
		/// </signature>
		return _createIDBRequest(IDBRequest, this, 0);
	};
	IDBIndex.getKey = function(key) { 
		/// <signature>
		/// <param name='key' type='Object' />
		/// <returns type='IDBRequest'/>
		/// </signature>
		return _createIDBRequest(IDBRequest, this.objectStore, new Object());
	};
	IDBIndex.get = function(key) { 
		/// <signature>
		/// <param name='key' type='Object' />
		/// <returns type='IDBRequest'/>
		/// </signature>
		return _createIDBRequest(IDBRequest, this.objectStore, new Object());
	};
	IDBIndex.openKeyCursor = function(range, direction) { 
		/// <signature>
		/// <param name='range' type='IDBKeyRange' optional='true' />
		/// <param name='direction' type='String' optional='true' />
		/// <returns type='IDBRequest'/>
		/// </signature>
		var cursor = Object.create(IDBCursor); cursor.source = this; return _createIDBRequest(IDBRequest, this.objectStore, cursor);
	};
	IDBIndex.openCursor = function(range, direction) { 
		/// <signature>
		/// <param name='range' type='IDBKeyRange' optional='true' />
		/// <param name='direction' type='String' optional='true' />
		/// <returns type='IDBRequest'/>
		/// </signature>
		var cursor = Object.create(IDBCursorWithValue); cursor.source = this; return _createIDBRequest(IDBRequest, this, cursor);
	};


	/* -- type: XMLHttpRequest -- */
	_$implement(XMLHttpRequest, EventTarget);
	_$implement(XMLHttpRequest, MSXMLHttpRequestExtensions);

	XMLHttpRequestCtor.LOADING = 3;
	XMLHttpRequestCtor.DONE = 4;
	XMLHttpRequestCtor.UNSENT = 0;
	XMLHttpRequestCtor.OPENED = 1;
	XMLHttpRequestCtor.HEADERS_RECEIVED = 2;
	XMLHttpRequest.status = 0;
	XMLHttpRequest.withCredentials = false;
	XMLHttpRequest.readyState = 0;
	XMLHttpRequest.responseText = '';
	XMLHttpRequest.responseXML = new Object();
	XMLHttpRequest.statusText = '';
	XMLHttpRequest.LOADING = 3;
	XMLHttpRequest.DONE = 4;
	XMLHttpRequest.UNSENT = 0;
	XMLHttpRequest.OPENED = 1;
	XMLHttpRequest.HEADERS_RECEIVED = 2;
	XMLHttpRequest.open = function(method, url, async, user, password) { 
		/// <signature>
		/// <param name='method' type='String' />
		/// <param name='url' type='String' />
		/// <param name='async' type='Boolean' optional='true' />
		/// <param name='user' type='String' optional='true' />
		/// <param name='password' type='String' optional='true' />
		/// </signature>
	};
	XMLHttpRequest.send = function(data) { 
		/// <signature>
		/// <param name='data' type='Object' optional='true' />
		/// </signature>
		/// <signature>
		/// <param name='data' type='String' optional='true' />
		/// </signature>
		this.status = 200; this.readyState = XMLHttpRequest.DONE; this.status = 4; this.statusText = "OK";
	};
	XMLHttpRequest.abort = function() { };
	XMLHttpRequest.getAllResponseHeaders = function() { 
		/// <signature>
		/// <returns type='String'/>
		/// </signature>
		return ''; 
	};
	XMLHttpRequest.setRequestHeader = function(header, value) { 
		/// <signature>
		/// <param name='header' type='String' />
		/// <param name='value' type='String' />
		/// </signature>
	};
	XMLHttpRequest.getResponseHeader = function(header) { 
		/// <signature>
		/// <param name='header' type='String' />
		/// <returns type='String'/>
		/// </signature>
		return ''; 
	};
	_events(XMLHttpRequest, "onreadystatechange", "onload");



	function _publicInterface(name, interface, interfacePrototype) {
		_$nonRemovable(interface);
		WorkerGlobalScope[name] = interface;
		WorkerGlobalScope[name].prototype = interfacePrototype;
	}

	function _publicObject(name, obj) {
		_$nonRemovable(obj);
		WorkerGlobalScope[name] = obj;
	}
	
	_publicInterface('IDBIndex', {}, IDBIndex);
	_publicInterface('FileList', {}, FileList);
	_publicInterface('IDBTransaction', {}, IDBTransaction);
	_publicInterface('WorkerNavigator', {}, WorkerNavigator);
	_publicInterface('IDBCursor', {}, IDBCursor);
	_publicInterface('ErrorEvent', {}, ErrorEvent);
	_publicInterface('MSStream', {}, MSStream);
	_publicInterface('File', {}, File);
	_publicInterface('Console', {}, Console);
	_publicInterface('EventException', {
		'DISPATCH_REQUEST_ERR' : 1,
		'UNSPECIFIED_EVENT_TYPE_ERR' : 0
	}, EventException);
	_publicInterface('IDBCursorWithValue', {}, IDBCursorWithValue);
	_publicInterface('CanvasPixelArray', {}, CanvasPixelArray);
	_publicInterface('IDBFactory', {}, IDBFactory);
	_publicInterface('IDBDatabase', {}, IDBDatabase);
	_publicInterface('DOMStringList', {}, DOMStringList);
	_publicInterface('XMLHttpRequestEventTarget', {}, XMLHttpRequestEventTarget);
	_publicInterface('IDBOpenDBRequest', {}, IDBOpenDBRequest);
	_publicInterface('WorkerGlobalScope', {}, WorkerGlobalScope);
	_publicInterface('DOMException', {
		'HIERARCHY_REQUEST_ERR' : 3,
		'NO_MODIFICATION_ALLOWED_ERR' : 7,
		'DATA_CLONE_ERR' : 25,
		'INVALID_MODIFICATION_ERR' : 13,
		'NAMESPACE_ERR' : 14,
		'INVALID_CHARACTER_ERR' : 5,
		'TYPE_MISMATCH_ERR' : 17,
		'ABORT_ERR' : 20,
		'INVALID_STATE_ERR' : 11,
		'SECURITY_ERR' : 18,
		'NETWORK_ERR' : 19,
		'WRONG_DOCUMENT_ERR' : 4,
		'INVALID_NODE_TYPE_ERR' : 24,
		'QUOTA_EXCEEDED_ERR' : 22,
		'INDEX_SIZE_ERR' : 1,
		'SYNTAX_ERR' : 12,
		'DOMSTRING_SIZE_ERR' : 2,
		'SERIALIZE_ERR' : 82,
		'VALIDATION_ERR' : 16,
		'NOT_FOUND_ERR' : 8,
		'URL_MISMATCH_ERR' : 21,
		'PARSE_ERR' : 81,
		'NO_DATA_ALLOWED_ERR' : 6,
		'NOT_SUPPORTED_ERR' : 9,
		'TIMEOUT_ERR' : 23,
		'INVALID_ACCESS_ERR' : 15,
		'INUSE_ATTRIBUTE_ERR' : 10
	}, DOMException);
	_publicInterface('MessageEvent', {}, MessageEvent);
	_publicInterface('DOMError', {}, DOMError);
	_publicInterface('CloseEvent', {}, CloseEvent);
	_publicInterface('ProgressEvent', {}, ProgressEvent);
	_publicInterface('WorkerLocation', {}, WorkerLocation);
	_publicInterface('IDBObjectStore', {}, IDBObjectStore);
	_publicInterface('IDBRequest', {}, IDBRequest);
	_publicInterface('MessagePort', {}, MessagePort);
	_publicInterface('Event', {
		'CAPTURING_PHASE' : 1,
		'AT_TARGET' : 2,
		'BUBBLING_PHASE' : 3
	}, Event);
	_publicInterface('ImageData', {}, ImageData);
	_publicObject('MSApp', MSApp);
	_publicInterface('IDBKeyRange', {
		'bound' : IDBKeyRange ['bound'],
		'only' : IDBKeyRange ['only'],
		'upperBound' : IDBKeyRange ['upperBound'],
		'lowerBound' : IDBKeyRange ['lowerBound']
	}, IDBKeyRange);
	_publicInterface('IDBVersionChangeEvent', {}, IDBVersionChangeEvent);

	_publicInterface('XMLHttpRequest', XMLHttpRequestCtor , XMLHttpRequest);
	_publicInterface('MSStreamReader', MSStreamReaderCtor , MSStreamReader);
	_publicInterface('MSBlobBuilder', MSBlobBuilderCtor , MSBlobBuilder);
	_publicInterface('MessageChannel', MessageChannelCtor , MessageChannel);
	_publicInterface('FileReaderSync', FileReaderSyncCtor , FileReaderSync);
	_publicInterface('WebSocket', WebSocketCtor , WebSocket);
	_publicInterface('FileReader', FileReaderCtor , FileReader);
	_publicInterface('Blob', BlobCtor , Blob);
	_publicInterface('Worker', WorkerCtor , Worker);

	this['XMLHttpRequest'].create = this['XMLHttpRequest'];
})();

function _$getActiveXObject(className, location) {
	if ((/XMLHTTP/i).test(className))
		return new window.XMLHttpRequest();
}

// SIG // Begin signature block
// SIG // MIIaRgYJKoZIhvcNAQcCoIIaNzCCGjMCAQExCzAJBgUr
// SIG // DgMCGgUAMGcGCisGAQQBgjcCAQSgWTBXMDIGCisGAQQB
// SIG // gjcCAR4wJAIBAQQQEODJBs441BGiowAQS9NQkAIBAAIB
// SIG // AAIBAAIBAAIBADAhMAkGBSsOAwIaBQAEFAX9b7f48mFB
// SIG // LKsdYbfHtUfKavhGoIIVLTCCBKAwggOIoAMCAQICCmEZ
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
// SIG // zjEp/w7FW1zYTRuh2Povnj8uVRZryROj/TGCBIUwggSB
// SIG // AgEBMIGHMHkxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpX
// SIG // YXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYD
// SIG // VQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xIzAhBgNV
// SIG // BAMTGk1pY3Jvc29mdCBDb2RlIFNpZ25pbmcgUENBAgph
// SIG // GcyTAAEAAABmMAkGBSsOAwIaBQCggbAwGQYJKoZIhvcN
// SIG // AQkDMQwGCisGAQQBgjcCAQQwHAYKKwYBBAGCNwIBCzEO
// SIG // MAwGCisGAQQBgjcCARUwIwYJKoZIhvcNAQkEMRYEFKdl
// SIG // BVaW5p1UhstuAjThKmX3WufbMFAGCisGAQQBgjcCAQwx
// SIG // QjBAoCaAJABkAGUAZABpAGMAYQB0AGUAZAB3AG8AcgBr
// SIG // AGUAcgAuAGoAc6EWgBRodHRwOi8vbWljcm9zb2Z0LmNv
// SIG // bTANBgkqhkiG9w0BAQEFAASCAQCgFbi1k//f1u2/2bRR
// SIG // Lmlk2smSkAWuBN5m9Ux3p8SEI1TwFDM3p6w6ghsYbd/s
// SIG // OvBiver/UQNIMqWBjU5Lxms9G5HABH2EEBhbX7v6aYLe
// SIG // Nre/CmTc3JnhKbfcBKValgumbwPhqVU1nN7F4JB1Gsmr
// SIG // TMswovLzO11E9EM/DanR7ZmRBZhGQDC1jqPj2AP4mCPB
// SIG // 9JgLFywG1ux/fmJdt7bHzb+Fo9bMGD9WXFtt0auiyQ3S
// SIG // I4COnLpiesO/EtL3WwK55gyexVcfWZ72akPyZuvvbZf9
// SIG // tvHonSWgOSxYK4CIgqiKrIXdxWewraIKQUnxa49Sdl41
// SIG // /VUo50dv7xlXWUHAoYICHzCCAhsGCSqGSIb3DQEJBjGC
// SIG // AgwwggIIAgEBMIGFMHcxCzAJBgNVBAYTAlVTMRMwEQYD
// SIG // VQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25k
// SIG // MR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24x
// SIG // ITAfBgNVBAMTGE1pY3Jvc29mdCBUaW1lLVN0YW1wIFBD
// SIG // QQIKYQKOQgAAAAAAHzAJBgUrDgMCGgUAoF0wGAYJKoZI
// SIG // hvcNAQkDMQsGCSqGSIb3DQEHATAcBgkqhkiG9w0BCQUx
// SIG // DxcNMTIwNzI3MDE0NjI2WjAjBgkqhkiG9w0BCQQxFgQU
// SIG // Z0KjAbxWzx95LEb285LMNJmaBcIwDQYJKoZIhvcNAQEF
// SIG // BQAEggEAbSMIqbOWxigeRlVDxGO/Bm/48QjeKxUDr8qx
// SIG // fKg7W8HEcZTBSwvgO58vjxUdBihzW6z0DPvt4QJd8m6Q
// SIG // NfPmGvjL3Eo4IL2xOBDkQcKK4nRA8QbQfYt/gwP0mYA1
// SIG // TSG67ExfACHqukrCT9a/1hi5q1gUDenRwyDcnei2znXa
// SIG // buOH6eFvCMFDoJvs1mYbeKIIoQjQcOj7XtpSOYQ0i2pQ
// SIG // oAZKmnFRli2s6AFMHWB8THmvKdeNw2oMEO8DGrqpI01+
// SIG // EmFTHb69Z9wRIlIUJ1w/HEj8gncC4nJrmyesv+8mExEV
// SIG // 9FNkD8G8spkKdmIcVIqbguvZHNYX5r2lOVLgJFcHag==
// SIG // End signature block
