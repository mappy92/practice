define([
  'lib/vendor/publisher'
], function (publisher) {

  var appData = {};

  var lastLabel; // used for the startLabel in driving directions
  publisher.subscribe({
    'search/success': function (search, data, requestParams) {
      if (lastLabel !== data.location.label){
        lastLabel = data.location.label;
        appData.startLabel = lastLabel;
      }
      appData['search/success'] = data;
    },

    'spatialPoint/newRoute': function (spatialPoint, data) {
    	if (data)
	      appData.startLabel = data.label;
    }
  });

  return appData;
});
