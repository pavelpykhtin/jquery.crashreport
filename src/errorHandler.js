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
			window.addEventListener('error', onError);
		}

		function onError(e) {
			var messageText = e.message;
			var lineNumber = e.lineno;
			var columnNumber = e.colno;
			var errorObject = e.error;
			var url = e.filename;

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