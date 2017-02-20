# jquery.crashreport
This library provides jquery-based adapter for catching and sending crash reports to the CrashReport logging system.

# Getting started
Download the package using bower:
```bash
bower install jquery.crashreport --save
```
then run this code on page load
```js
$(document).crashReport({
	url: 'https://crashreport.collector.com',
	application: 'your-application-key',
	version: '1.2.3.4'
});
```
Options are:
* **url**: Location of the CrashReport server which will collect errors
* **application**: The key which identifies your application
* **version**: Version of your application

This will configure a handler which will catch errors all js errors being thrown on the page and send them to the reporting server. Errors will be logged with a 'Fatal' log level.
