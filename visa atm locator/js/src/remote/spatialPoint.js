define([
  'lib/vendor/publisher',
  'lib/remote/spatialPoint'
], function (publisher, spatialPoint){

  publisher.advise(spatialPoint).after({
    'routeCallback': 'spatialPoint/route',
    'newStartingPointCallback': 'spatialPoint/newRoute'
  });

  spatialPoint['search/success'] = function (search, data, request){
    this.updateRouteRequest(data, request);
  };

  spatialPoint['resultsLinks/click'] = function (resultsLinks, $element){
    this.routeFromElement($element);
  };

  spatialPoint['getDirections/submit'] = function (getDirections, formData) {
    var address = formData[0].value;
    
    if (address.length > 0)
    	this.getNewStartingPoint(address);
  	else
  		spatialPoint.error('noAddress');
  };

  publisher.subscribe([
    'search/success',
    'resultsLinks/click',
    'getDirections/submit'
  ], spatialPoint);

  return spatialPoint;

});
