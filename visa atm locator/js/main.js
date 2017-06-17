require(['lib/vendor/jquery'], function (jQuery){ // shouldn't have to load jQuery again after this. make sure this is loaded first...
	
	setTimeout(function() {
		// load after jquery to make sure it gets loaded
		require([  
		'lib/util/browserDetect',
	  'lib/util/mobileRedirect', // calls itself and checks for mobile devices.  Will redirect before anything else is called if necessary.
	  'lib/util/logger',
	  'lib/vendor/publisher',
	  'src/appData',
	  'src/controller',
	  'lib/remote/language',
	  'src/pages/layout',
	  'src/remote/spatialPoint',
	  'src/widget/all',
	  'src/page',
	  ], function(browserDetect, mobileRedirect, logger, publisher, data, controller, language, layout, spatialPoint, page) {
	  	// check for compatible browsers
			if (!browserDetect.inMatrix) {
				browserDetect.showUpgrade();
				return false;
			}
		
		  var domready = false,
		      langReady = false;
		
		  function init (){
		    if (!langReady || !domready) return;
		    publisher.publish('ready');
		  }
		
		  // async ops
		  $(function (){
		    domready = true;
		  	init();
		 	});
		 	
		  language.get(function (){
		  	langReady = true;
		    init();
		  });
		  
		  // log some events
		  logger.on = ~location.search.indexOf('log');
		  logger.log([
		  	'config',
		    'search/fetchComplete',
		    'search/fetchTotalsComplete',
		    'search/success',
		    'spatialPoint/route',
		    'resultsLinks/click',
		    'search/errorHandler',
		    'spatialPoint/smsSend',
		    'spatialPoint/smsResponse',
		    'searchRequest',
		    'tokenExpired'
		  ]);
			  
		});
	}, 1);
});