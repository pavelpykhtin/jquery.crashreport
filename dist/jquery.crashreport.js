function ErrorHandler(logService) {
	var self = this;

	self.throttling = true;
	self.throttleTimeout = 2000;
	self.lastError = null;
	self.throttleTimer = null;

	init();

	function init() {
		window.onerror = onError;
	}

	function onError(messageText, url, lineNumber, columnNumber, errorObject) {
		if (self.throttling) {
			var errorDescriptor = getErrorDescriptor(messageText, url, lineNumber, columnNumber);

			if (errorDescriptor == self.lastError)
				return;

			clearTimeout(self.throttleTimer);
			self.throttleTimer = setTimeout(function () { self.lastError = null; }, self.throttleTimeout);

			self.lastError = errorDescriptor;
		}

		logService.logException(messageText, url, lineNumber, columnNumber, errorObject);
	};

	function getErrorDescriptor(messageText, url, lineNumber, columnNumber) {
		return messageText + url + lineNumber + columnNumber;
	}
};
(function ($) {
	var defaultOptions = {
		url: '',
		application: ''
	};

	$.fn.crashReport = function (options) {
		init();

		function init() {
			var instanceOptions = $.extend({}, defaultOptions, options);
			
			var logService = new LogService(instanceOptions);
			var errorHandler = new ErrorHandler(logService);
		};
	};
})(jQuery);
function LogService(options) {
	var self = this;

	var defaultOptions = {
		url: '',
		module: 'Unknown'
	}

	self.options = $.extend({}, defaultOptions, options);
	
	self.log = log;
	self.trace = trace;
	self.logException = logException;

	var logLevels = {
		Fatal: 0,
		Debug: 1,
		Error: 2,
		Trace: 3,
		Warn: 4,
		Info: 5
	};

	function log(message) {
		$.ajax(
			{
				url: self.options.url,
				contentType: 'application/json',
				method: 'POST',
				crossDomain: true,
				data: JSON.stringify(message)
			});
	};

	function trace(messageText) {
		var message = {
			TimeStamp: null,
			LogLevel: logLevels.Trace,
			Module: self.options.module,
			MessageText: messageText,
			StackTrace: null,
			AdditionalInformation: null,
			UserId: 0,
			PersonId: 0,
			InnerException: null,
			Version: appVersion
		}

		self.log(message);
	};

	function logException(messageText, url, lineNumber, columnNumber, errorObject) {
		var formattedMessage = messageText + '\r\n[' + url + '] [' + lineNumber + ':' + columnNumber + ']';
		var additionalInformation = '';
		additionalInformation += 'Current location: ' + window.location.href + '\r\n';
		additionalInformation += 'User-Agent: ' + navigator.userAgent + '\r\n';

		var message = {
			TimeStamp: null,
			LogLevel: logLevels.Fatal,
			Module: self.options.module,
			MessageText: formattedMessage,
			StackTrace: (errorObject.stack || 'no stack available'),
			AdditionalInformation: additionalInformation,
			UserId: 0,
			PersonId: 0,
			InnerException: null,
			Version: appVersion
		}

		self.log(message);
	};
};