define([
  'lib/vendor/publisher',
  'lib/pages/results',
  'src/appData'
], function (publisher, results, appData){
	//results.locals.driving.Mappable = true;
  publisher.advise(results)
//    .before('renderResults', 'results/renderResults')
    .after('clickPage', 'results/clickPage');

  results['resultsLinks/click'] = function (resultsLinks, $element) {
    var index = $element.data('index');
    this.locals.driving = appData['search/success'].items[index];
    if($element.attr('class') === "visaATMDirectionsSignIcon visaDetails")
    {
    	this.locals.driving.Mappable = false;
    }
    else
    {
    	this.locals.driving.Mappable = true;
    }
  };

  // Will happen after resultsLinks/click since it has to make a
  // request to the server
  results['spatialPoint/route'] = function (spatialPoint, data) {
    this.locals.itinerary = data.itinerary;
    this.locals.route = data;
    this.renderDirections();
  };

  results['search/success'] = function loadNewResults (search, data){
 	   if (results.rendered && !results.smsBitly) {
	 	   results.renderResults();	
  	}
  };

  publisher.subscribe([
    'resultsLinks/click',
    'spatialPoint/route',
    'search/success'
  ], results);

  return results;

});
