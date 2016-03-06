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
				module: self.options.application,
				version: self.options.applicationVersion
			}, message);

			$.ajax(
			{
				url: self.options.url,
				contentType: 'application/json',
				method: 'POST',
				crossDomain: true,
				data: JSON.stringify(resultMessage)
			});
		};

		function trace(messageText) {
			var message = {
				TimeStamp: null,
				LogLevel: logLevels.Trace,
				MessageText: messageText,
				StackTrace: null,
				AdditionalInformation: null,
				UserId: 0,
				PersonId: 0,
				InnerException: null
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
				MessageText: formattedMessage,
				StackTrace: (errorObject.stack || 'no stack available'),
				AdditionalInformation: additionalInformation,
				UserId: 0,
				PersonId: 0,
				InnerException: null
			}

			self.log(message);
		};
	}
})(jQuery);