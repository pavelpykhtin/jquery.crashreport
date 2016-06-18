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
			Error: 1,
			Warn: 2,
			Info: 3,
			Debug: 4,
			Trace: 5
		};

		function log(message) {
			var resultMessage = $.extend({
				Version: self.options.applicationVersion
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