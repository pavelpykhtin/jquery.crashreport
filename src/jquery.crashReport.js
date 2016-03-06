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
			
			var logService = new LogService(instanceOptions);
			var errorHandler = new ErrorHandler(logService);
		};
	};
})(jQuery);