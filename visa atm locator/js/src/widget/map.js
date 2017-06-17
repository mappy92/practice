define([
  'lib/vendor/publisher',
  'lib/widget/map',
  'lib/page'
], function (publisher, map, page){

  publisher.advise(map).after('route', 'map/route');

  map['resultsLinks/mouseenter'] = (function (){
    var z = 0;
    return function (resultsLinks, element) {
      var dataElement = element.find('div.visaATMResultsRight a');
      var index = dataElement.data('index');
      var bulletIndex = parseInt(element.find('span.visaATMPinBullet').text());
      var mapEntity = this.entities.atms.pins[index];
 
      if (mapEntity.get('class') !== 'hide') {
	      // mapEntity.setOptions({
	      //   zIndex: ++z,
	      //   icon: page.assetURL+'/blue-pins/'+ bulletIndex + '.png'
	      // });

        mapEntity.setZIndex(google.maps.Marker.MAX_ZINDEX + 1);
        mapEntity.set('icon', page.assetURL+'/blue-pins/'+ bulletIndex + '.png');
			}
    };
  }());

  map['resultsLinks/mouseleave'] = function (resultsLinks, element) {
	  var dataElement = element.find('div.visaATMResultsRight a');
	  var index = dataElement.data('index'),
        pin = this.entities.atms.pins[index];
    var bulletIndex = parseInt(element.find('span.visaATMPinBullet').text());
    // map.route clears all the pins, and empties the element causing a mouseleave
    // event, so we check if the pin is actually on the page
    if (pin) {
        pin.setZIndex();
      // pin.setOptions({ icon: page.assetURL+'/pushpin.png' });
       pin.set('icon', page.assetURL+'/orange-pins/'+ bulletIndex + '.png');
    }
  };

  map['search/success'] = function (search, results) {
    // for use in getting directions
    this.currentCoords = {
      latitude: results.location.Latitude,
      longitude: results.location.Longitude
    };
  };

  map['spatialPoint/route'] = function (spatialPoint, data){
    // this.detachDragging();
    this.mapSpec = {};
    this.mapSpec.zoomLevel = this.bing.getZoom();
    this.mapSpec.center = this.bing.getCenter();
    this.route(data);
  };

  map['results/renderResults'] = function () {
    this.clearEntity('route');
    this.clearEntity('endPoints');
  };

  publisher.subscribe([
    'resultsLinks/mouseenter',
    'resultsLinks/mouseleave',
    'search/success',
    'spatialPoint/route',
    'results/renderResults'
  ], map);
  return map;
});
