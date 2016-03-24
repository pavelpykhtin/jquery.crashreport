(function ($) {
	var defaultOptions = {
		url: '',
		application: '',
		applicationVersion: '0.0'
	};

	$.fn.crashReport = function (options) {
		init();

		function init() {
			var instanceOptions = $.extend({}, defaultOptions, options);
			
			var logService = new $.fn.crashReport.LogService(instanceOptions);
			var errorHandler = new $.fn.crashReport.ErrorHandler(logService);
		};
	};
})(jQuery);
(function ($) {
	$.extend($.fn.crashReport, { ErrorHandler: ErrorHandler });

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
				self.throttleTimer = setTimeout(function() { self.lastError = null; }, self.throttleTimeout);

				self.lastError = errorDescriptor;
			}

			logService.logException(messageText, url, lineNumber, columnNumber, errorObject);
		};

		function getErrorDescriptor(messageText, url, lineNumber, columnNumber) {
			return messageText + url + lineNumber + columnNumber;
		}
	}
})(jQuery);
(function($) {
	$.extend($.fn.crashReport, { LogService: LogService });

	function LogService(options) {
		var self = this;

		var defaultOptions = {
			url: '',
			application: 'Unknown',
			applicationVersion: '0.0'
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
			var resultMessage = $.extend({
				version: self.options.applicationVersion
			}, message);

			$.ajax(
			{
				url: self.options.url + '/api/' + self.options.application + '/log',
				contentType: 'application/json',
				method: 'POST',
				crossDomain: true,
				data: JSON.stringify(resultMessage)
			});
		};

		function trace(messageText, additionalInforamtion) {
			var message = {
				TimeStamp: null,
				LogLevel: logLevels.Trace,
				MessageText: messageText,
				StackTrace: null,
				AdditionalInformation: additionalInforamtion ? JSON.stringify(additionalInforamtion) : null,
				UserId: 0,
				PersonId: 0,
				InnerException: null
			}

			self.log(message);
		};

		function logException(messageText, url, lineNumber, columnNumber, errorObject) {
			var formattedMessage = messageText + '\r\n[' + url + '] [' + lineNumber + ':' + columnNumber + ']';
			var additionalInformation = {
				currentLoaction: window.location.href,
				userAgent: navigator.userAgent
			};

			var message = {
				TimeStamp: null,
				LogLevel: logLevels.Fatal,
				MessageText: formattedMessage,
				StackTrace: (errorObject.stack || 'no stack available'),
				AdditionalInformation: JSON.stringify(additionalInformation),
				InnerException: null
			}

			self.log(message);
		};
	}
})(jQuery);