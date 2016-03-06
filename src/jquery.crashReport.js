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