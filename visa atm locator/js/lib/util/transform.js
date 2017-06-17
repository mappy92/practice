define([
  'lib/vendor/publisher',
  'lib/remote/language',
  'lib/widget/sort',
  'lib/remote/config'
], function (publisher, language, sort, config){

  transform = {};
 	transform.propMap = {};
	// These map to the properties returned from spatial point
  
  publisher.subscribe('language/get', function(language) {
  	transform.propMap = {
				OPER_HRS	: language.tooltip24, // not A is null
				WHEELCHAIR: language.tooltipWheelchair,// 0 is null
				BRAILLE_AUDIO: language.tooltipBraille, // 0 is null
				BALANCE_INQUIRY: language.tooltipBalance, // 0 is null
				PIN_CHANGE: language.tooltipPIN, // 0 is null
				PLUS_ALLIANCE_NO_SURCHARGE_FEE: language.tooltipPlusAlliance, // 0 is null
				ACCEPTS_PLUS_SHARED_DEPOSIT: language.tooltipPlusShared, // 0 is null
				V_PAY_CAPABLE: language.tooltipVPay, // 0 is null 				
				AIRPORT_CD: language.tooltipAirport, // null is null
				READY_LINK: language.tooltipReadyLink,
        CHIP_CAPABLE: language.tooltipChipCard,
        NO_ATM_ACCS_FEE_IND: language.tooltipNoATMAccsFeeInd,
        ACPT_INTL_CRD_IND: language.tooltipAcptIntlCrdInd
			};
	});
  
  transform.results = (function (){

		

    // Transforming the data so it's easier on the templates
    // also gives us a spot to clean the data before we display it
    function mapItems (item, index){

      item.Location.distance = item.Score.toFixed(2) + ' mi';
	    item.Location.distanceKm = (item.Score * 1.609344).toFixed(2) + ' km';
			
      item.Location.props = filterProperties(item.Location.Properties);
      item.Location.amenities = item.Location.props.filteredProps;
      item.Location.unavailableProps = item.Location.props.unavailableProps;
      item.Location.cardAcceptProps = item.Location.props.cardAcceptProps;
      
      item.Location.hours = language.data.directions['hours_'+item.Location.props.allProps['OPER_HRS']] ? language.data.directions['hours_'+item.Location.props.allProps['OPER_HRS']] : '';
      item.Location.index = index + 1;
      item.Location.indexPin = (this.currentPage) + (index + 1); // pin number to actually show in pins, 10 is the number of results shown
      return item.Location;
    }
    
    // Finds the "amenities" we care about like wheelchair access, etc.
    // and returns an array of those available, simplifying the view template
    function filterProperties(props) {
		
			if (!props) return [];
			
			var temp = [];
			var allProps = [];
			var filteredProps = [];
			var unavailableProps = [];
			var cardAcceptProps = [];
			
			jQuery.each(props, function (index, item){
	        
	       allProps[item.Name] = item.Value;
	       
	       if(item.Name == "CARD_ACCEPT" && item.Value == "B")
	       {
	     	  cardAcceptProps.push({name: item.Name+"Visa", desc: "Visa"});
	     	  cardAcceptProps.push({name:item.Name+"Plus", desc: "Plus"});
	       }
	       if(item.Name == "CARD_ACCEPT" && item.Value == "V")
	       {
	     	  cardAcceptProps.push({name: item.Name+"Visa",  desc: "Visa"});
	       }
	       if(item.Name == "CARD_ACCEPT" && item.Value == "P")
	       {
	     	  cardAcceptProps.push({name: item.Name+"Plus",  desc: "Plus"});
	       }
				// do some checks for some specific filter properties assigned to the propMap object above
				if (transform.propMap[item.Name]) {
					if (item.Name !== "AIRPORT_CD" && item.Value == null) {
						unavailableProps.push({name: item.Name, value: item.Value });
					}	
					if (item.Name == 'OPER_HRS' && item.Value !== 'A') { return; /* continue */ }
					else if (item.Name == "AIRPORT_CD" && item.Value !== null) { /* continue */ }
					else if (item.Name !== "AIRPORT_CD" && item.Value !== '0' && item.Value !== null) { /* continue */ }
					else { 
            return; 
          }
				} else return;
	        
				// Add Filter to list to show
				if (item.Value !== 0)
					filteredProps.push({name: item.Name, desc: transform.propMap[item.Name]});
				
			});
	
			temp.allProps = allProps;
			temp.filteredProps = filteredProps;
			temp.unavailableProps = unavailableProps;
			temp.cardAcceptProps = cardAcceptProps;
			return temp;

		}

		var currentPage = '';

    function getPages (data, request) {
      var pages = [],
          perPage = request.options.range.count,
          total = data.FoundResults.TotalFound ? ( (data.FoundResults.TotalFound > config.totalCount) ? config.totalCount : data.FoundResults.TotalFound) : 0,
          numberOfPages = Math.ceil(total/perPage),
          current = request.options.range.start;
					this.currentPage = current;

      for (var i = 0; i < numberOfPages; i++)
        pages.push({
          number: i + 1,
          index: i,
          current: (current/config.countPerPage) === i
        });
			
      return {
      	numberOfPages: numberOfPages,
        pages: pages,
        lastPage: ((current/config.countPerPage) + 1 === numberOfPages) || numberOfPages == 1,
        firstPage: (current/10) === 0
      };
    }
		

    // The actual method for `results` in this module
    return function (data, request){
      var transformed = {};
			// set DistanceUnit current distanceType
	     	data.DistanceUnit = sort.distanceType == 'Miles' ? 'mi' : 'km';
      transformed.unit = data.DistanceUnit ? 'km' : 'mi';
      transformed.total = data.FoundResults.TotalFound;
      transformed.pages = getPages(data, request);
      transformed.items = jQuery.map(data.FoundResults.Results, mapItems);
      
      if (!data.MatchedLocations) {
 				transformed.location = request.location.coordinates ? request.location.coordinates : {};
 				transformed.location.label = request.location.placeName ? request.location.placeName : '';
			} else {
				transformed.location = data.MatchedLocations[0].Location.Coordinates;
				transformed.location.label = data.MatchedLocations[0].Location.PlaceName;
			}  
      
      return transformed;
    };
  }());



  transform.route = (function () {
    
    function getPath (data) {
      var path = [];
      for (var i = 0, l = data.length; i < l; i++)
        path.push({
          latitude: data[i].Latitude,
          longitude: data[i].Longitude
        });
      return path;
    }

    var parsers = [
      { pattern: /<VirtualEarth:(.+?)>/ig,
        replacement: '<b class="visaATMDirections$1">' },
      { pattern: /<\/.+?>/ig,
        replacement: "</b>" }
    ];

    function filterText (text) {
      for (var i=0; i < parsers.length; i++) {
        text = text.replace(parsers[i].pattern, parsers[i].replacement);
      }
      return text;
    }

    function filterDistance (distance) {
      if (distance < 0.1)
      	return '< 0.1';
      else
        return distance.toFixed(1);
    }

    function filterDuration (duration) {
      return secondsToString(duration);
    }
    
    function secondsToString(seconds)
		{
			// format seconds into a string
			var temp = '';
	
			var numdays = Math.floor(seconds / 86400);
			var numhours = Math.floor((seconds % 86400) / 3600);
			var numminutes = Math.floor(((seconds % 86400) % 3600) / 60);
			var numseconds = ((seconds % 86400) % 3600) % 60;
	
			if (numdays > 0) {				
				temp = temp + numdays + ' day';
				if (numdays > 1)
					temp = temp + 's';
			}
				
			if (numhours > 0) {
				temp = (temp.length > 0) ? temp + ' ' : temp;
				temp = temp + numhours + ' hr';
				if (numhours > 1)
					temp = temp + 's';				
			}
			
			if (numminutes > 0) {
				temp = (temp.length > 0) ? temp + ' ' : temp;
				temp = temp + numminutes + ' min';
				if (numminutes > 1)
					temp = temp + 's';				
			}

			if (numseconds > 0) {
				temp = (temp.length > 0) ? temp + ' ' : temp;
				temp = temp + numseconds + ' sec';
				if (numseconds > 1)
					temp = temp + 's';				
			}

			return temp;

		}
    

    function getItinerary (data) {
      var itinerary = {
        distance: data.Distance.toFixed(2),
        distanceKm: (data.Distance * 1.609344).toFixed(2),
        duration: filterDuration(data.Duration),
        directions: []
      };

      for (var i = 0, l = data.Segments.length; i < l; i++){
        for (var i2 = 0, l2 = data.Segments[i].Directions.length; i2 < l2; i2++){
          itinerary.directions.push({
            distance: filterDistance(data.Segments[i].Directions[i2].Distance),
            distanceKm: filterDistance(data.Segments[i].Directions[i2].Distance * 1.609344),
          //  duration: filterDuration(data.Segments[i].Directions[i2].Duration),
            maneuver: data.Segments[i].Directions[i2].ManeuverType,
            text: filterText(data.Segments[i].Directions[i2].Text),
            number: (i2 + 1)
          });
        }
      }

      return itinerary;
    }

    function getStart (path) {
      return {
        latitude: path[0].Latitude,
        longitude: path[0].Longitude
      };
    }

    function getEnd (path) {
      var lastIndex = path.length - 1;
      return {
        latitude: path[lastIndex].Latitude,
        longitude: path[lastIndex].Longitude
      };
    }

    return function (data) {
      return {
        endPoints: {
          start: getStart(data.d.Path),
          finish: getEnd(data.d.Path)
        },
        path: getPath(data.d.Path),
        itinerary: getItinerary(data.d.Itinerary)
      };
    };
  }());

  transform.newStartingPoint = function (data){
    var location = data.d.MatchedLocations[0].Location;
    return {
      coordinates: {
        latitude: location.Coordinates.Latitude,
        longitude: location.Coordinates.Longitude
      },
      label: location.PlaceName
    };
  };

  return transform;

});