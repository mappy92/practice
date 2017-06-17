/*
 * Needs to be refactored for the new publisher pattern, and get rid of all
 * these hard dependencies!  Could/should probably be a couple of objects,
 * one that controls the data, one that controls the element events.
*/
define([
  'lib/remote/config',
  'lib/vendor/publisher',
  'lib/vendor/rison',
  'lib/widget/hint',
  'lib/page',
  'src/views',
  'lib/hash',
  'src/remote/spatialPoint',
  'src/remote/requestParams',
  'lib/remote/handlers',
  'lib/util/transform',
  'lib/remote/language',
  'lib/util/encoder'
], 
function (config, publisher, rison, hint, page, dust, hash, spatialPoint, requestParams, handlers, transform, language, encoder){

/*
 * Controls the search functionality
*/
var search = {

	searchType: 'Input', // default search type.  changes for 'Input' field or 'Filter' search
	fetchAttempts: 0,
	findNearbyTotals: false, // have I found totals for this location?
	coords: '',
	totalCount: 0,
	findNearByBankName: false, 

	isGeoSearch: false,
	matchedLocationCache_formatted: [],

	isMapDragging: false,
	isMapDragged: false,
	
  init: function (selector){
		
    jQuery('.visaATMSearchWrap input').bind('click keypress', function() {
  		search.clearInput(this);
  	});
    
    this.$element = jQuery(selector);
    this.$form = this.$element.find('form');
    this.$input = this.$element.find('input');
    this.hint = hint;
    hint.init(
      this.$element.find('.visaATMSearchDidYouMean'),
      this.$input
    );
    this.requestParams = requestParams.create();
    this.checkParams();
    this.attach();
  },
  
  clearInput: function(iThis) {
	  var searchInput = jQuery(iThis);
	  
	  if ( searchInput.val() == encoder.htmlDecode(language.data.searchInputValue) )
	  {
		  searchInput.val('');
		  //Fix for IE all versions
		  setTimeout(function() {document.getElementById("visaATMIeSearchInputFix").focus();},1);
		  }
  },
  
  clear : function(){
	  if(jQuery("#visaATMIeSearchInputFix").val() !="" && jQuery("#visaATMIeSearchInputFix").val() !=language.data.searchInputValue)
		  jQuery(".icon_clear").show();

	  jQuery(document).on('propertychange keyup input paste', 'input.searchInput', function(){
		  var io = $(this).val().length ? 1 : 0 ;
		  $(this).next('.icon_clear').stop().fadeTo(300,io);
	  }).on('click', '.icon_clear', function() {
	  		// search.prevQuery = $('#visaATMIeSearchInputFix').val();
		  $(this).delay(50).fadeTo(300,0).prev('input').val('');
		  setTimeout(function() {document.getElementById("visaATMIeSearchInputFix").focus();},1);
	  });

	  jQuery(document).on('focusout', 'input.searchInput', function(){
		  var value = $(this).val();
		  if(value == "") {
			  $(this).val(language.data.searchInputValue);
		  }
	  });
  },

  checkParams: function(){
  	search.recentHash = hash.get();
    var params = search.recentHash.params;
    if (params && params.query) {
      this.$input.val(window.decodeURIComponent(params.query));
      this.fetch();
    }
  },

  attach: function (){
	search.clear();
	search.searchHint();
    var self = this;
    this.$form.bind('submit.search', jQuery.proxy(this.onSubmit, this));
    
    //plus alliance
    $('.plusAlliance-input-wrapper input').bind('click', jQuery.proxy(this.plusAllianceFilterClicked, this));

    hint.$element.undelegate('a', 'click').delegate('a', 'click', function (){
      hint.hide();
    });
  },

  plusAllianceFilterClicked: function(e) {
  	var isChecked = $(e.currentTarget).is(':checked');

  	if(jQuery('.visaATMFilters').is(':visible')) {
  		jQuery('.visaATMFilters li label.visaATMPLUS_ALLIANCE_NO_SURCHARGE_FEE input').click();
  	}
  },
  
  searchHint: function(){
	  jQuery(".visaATMShowHintButton").click(function(){
	  jQuery(".visaATMShowHintDiv").show();
	  });
	  jQuery(".visaATMShowHintDivCloseButton").click(function(){
		  jQuery(".visaATMShowHintDiv").hide();
	  });
	  jQuery(".visaATMShowFaqLink").click(function(){
		  jQuery(".visaATMShowHintDiv").hide();
		  setTimeout(function(){
		  jQuery(".visaATMToggleFirst h3").addClass("visaATMTogglerToggled");
		  jQuery(".visaATMToggleFirst div").show();
		  },500);
		  
	  });
  },

  onSubmit: function (event){
  	publisher.publish('config', config);
  	// fire Unica Tracking event
    // ntptEventTag("ev=SearchForm");
  	
  	search.isMapDragging = false;
  	search.isMapDragged = false;

  	search.searchType = 'Input';
	this.requestParams.data.options.range.start = 0; // reset pager vars to first page of results
    event.preventDefault();
    
    var hasSearchValue = this.hasSearchValue();

    //in case user searches by latlon from input box directly.
    this.matchedLocationCache_formatted = [];
	
		// reset sort on submit
		this.resetSort();
	
	// uncheck filters...
    jQuery('.visaATMFilters input:checked').removeAttr('checked');
    //preselect filter by attribute to 'And'
    jQuery('.visaATMFilters input:radio[value="and"]').attr('checked', 'checked');
    this.requestParams.data.options.operationName = 'and';

    //clear bank name filter  
    search.findNearByBankName = false;
    // delete this.requestParams.data.options.findFilters;
    this.requestParams.data.options.findFilters = this.requestParams.defaultFindFilters;
    
    if (hasSearchValue) {
    	search.coords = '';
	    this.fetch();
		}
  },
  
  // reset Sort buttons to Distance
  resetSort: function() {
  	// reset search to Distance on search submit.
	this.requestParams.data.options.sort.primary = 'distance';
	this.requestParams.data.options.sort.direction = 'asc';
	jQuery('.visaATMSort button.visaATMSortCurrent').removeClass('visaATMSortCurrent');
	jQuery('.visaATMSort button#Distance').addClass('visaATMSortCurrent');
  },

  hasSearchValue: function() {	

	var searchInputVal = encoder.htmlDecode(page.locals.searchInputValue);
	var searchValue = jQuery('.visaATMSearchWrap input').val();

	if (searchValue == '' || searchValue == searchInputVal) {
		alert(language.data.noSearch);
		return false;
	} else {
		//add ntptpagetag
		// ntptEventTag('ev=SearchForm&searchTerm=' + encodeURIComponent(searchValue));
		dataLayer.push({
			'SearchForm&searchTerm': encodeURIComponent(searchValue)}
		);

		return true;
	}
	 	
  },
  
  setCoordinates: function(latlon){
	  search.coords = latlon.lat()+","+latlon.lng();
	  search.fetch();
  },

  fetch: function (iConfig){
  	// close SMS dialogue if open
  	// spatialPoint.destroySMS();

		// if (!config.token) {
		// 	// try for 10 seconds to get token.  If longer, then timeout...
		// 	if (search.fetchAttempts > 20) {
		// 		alert(language.data.tokenError);
		// 		return;
		// 	}
			
		// // loop for 10 seconds or until token is available…
		// 	setTimeout(function() {
		// 		search.fetchAttempts = search.fetchAttempts + 1;
		// 		search.fetch(iConfig);
		// 	}, 500);
				
		// } else {
			this.data = false;
		   	// this.query = hint.$input.val();
		   	this.query = $('<div/>').text(hint.$input.val()).html();

		   	if(this.query === language.data.searchInputValue) {
		   		alert(language.data.noSearch);
				return false;
		   	}
		   	
		   	publisher.publish('search/fetch', this.query);
		   	this.buildRequest(iConfig);
		   	
		   	var requestParams = this.requestParams.get();
		   	requestParams.distance = 60; //reset distance in case dragging changed it
		   	if (search.coords) {
		   		var coords = search.coords.split(',');
		   		requestParams.location.geocodes = {};
		   		requestParams.location.geocodes.latitude = coords[0];
		   		requestParams.location.geocodes.longitude = coords[1];
		   		this.isGeoSearch = true;
		   	//	delete requestParams.location.placeName;
		   	} else {
		   		// mainly to delete from last request before processing new one.  don't need these anymore if using a placeName only…
		   		requestParams.location.geocodes = null;
		   		this.isGeoSearch = false;

		   		//hacky, only when placename contains ', BRA' and geocode is null, strip ', BRA', 
		   		//so will force the suggestion shows up, search by geocode
		   		var locationCopy = requestParams.location.placeName.toLowerCase();
		   		var startIndex = locationCopy.lastIndexOf(', bra'); //in case ',Brazil' will also meet the requirement
		   		if(startIndex > -1 && startIndex+4 === locationCopy.length-1) {
		   			requestParams.location.placeName = requestParams.location.placeName.slice(0, startIndex);
		   		}
		   	}
		   	
		   	//update plus alliance 
		    for(var i=0; i<requestParams.options.findFilters.length; ++i) {
		    	var filter = requestParams.options.findFilters[i];
		    	if(filter.filterName=== "PLUS_ALLIANCE_NO_SURCHARGE_FEE") {
		    		if($('.plusAlliance-input-wrapper input').is(':checked')) {
				    	filter.filterValue = 'Y'
				    }
				    else {
				    	filter.filterValue = '';
				    }
		    	}
		    }

		   	if(search.isMapDragging === true) { //just dragged the map
		   		search.isMapDragging = false;
		   		search.isMapDragged = true;

		   		search.resetAndFetch(requestParams); //similar to this.onSubmit()
		   		// console.log('map is dragging, findNearbyTotals get called.');
		   		return;
		   	}
		   	else if(search.isMapDragging === false && search.isMapDragged === true) { //filter, pagination, sort on the dragging map
		   		requestParams.distance = search.radius;
		   	}
		   	
	   		spatialPoint.findNearby(requestParams, jQuery.proxy(this.mapDataCallback, this));

	   		if (!search.findNearByBankName) {
		   		// console.log('map is not dragging, findNearbyTotals get called.');
		   		spatialPoint.findNearbyTotals(requestParams,jQuery.proxy(this.mapTotalsCallback, this));
		   	}
		   	else {
		   		// console.log('map is not dragging, but findNearbyTotals did not get called.');
		   	}
			
		// }
    
  },

  resetAndFetch: function(requestParams) {
  	search.searchType = 'Input';
	requestParams.options.range.start = 0; // reset pager vars to first page of results

	requestParams.distance = search.radius; //reset distance to be current map height/2
    
    //in case user searches by latlon from input box directly.
    this.matchedLocationCache_formatted = [];
	
	// reset sort on submit
	this.resetSort();
	
	// uncheck filters...
    jQuery('.visaATMFilters input:checked').removeAttr('checked');
    //preselect filter by attribute to 'And'
    jQuery('.visaATMFilters input:radio[value="and"]').attr('checked', 'checked');
    this.requestParams.data.options.operationName = 'and';

    //clear bank name filter  
    jQuery(".visaATMBankNameListInner").html("<img class = \"loadingImage\" src=\"img/spinner.gif\">");
    search.findNearByBankName = false;
    // delete this.requestParams.data.options.findFilters;
    requestParams.options.findFilters = this.requestParams.defaultFindFilters;

    //update plus alliance 
    for(var i=0; i<requestParams.options.findFilters.length; ++i) {
    	var filter = requestParams.options.findFilters[i];
    	if(filter.filterName=== "PLUS_ALLIANCE_NO_SURCHARGE_FEE") {
    		if($('.plusAlliance-input-wrapper input').is(':checked')) {
		    	filter.filterValue = 'Y'
		    }
		    else {
		    	filter.filterValue = '';
		    }
    	}
    }

	spatialPoint.findNearby(requestParams, jQuery.proxy(this.mapDataCallback, this));
	spatialPoint.findNearbyTotals(requestParams,jQuery.proxy(this.mapTotalsCallback, this));
  },

  fetchPageFromElement: function($element){
    var page = $element.data('pagination'),
        current = this.requestParams.data.options.range.start;

    switch (page) {
      case 'next': page = (current/config.countPerPage) + 1; break;
      case 'previous': page = (current/config.countPerPage) - 1; break;
      default: page = parseInt(page, 10);
    }

    this.requestParams.page(page);
    this.fetch();
  },

  buildRequest: function(iConfig){
  	// set token to current value
  	// this.requestParams.data.token = config.token;

  	//check if input is geocode or single line address
  	this.requestParams.geocodes(null);
  	this.requestParams.placeName('');

  	var geocode = this.getGeocode(this.query);
  	if(geocode) {
  		// this.requestParams.geocodes(geocode);
  		search.coords = geocode.latitude + ',' + geocode.longitude;
  		// this.isGeoSearch = true;
  	}
  	else {
    	this.requestParams.placeName(this.query);
    	// this.isGeoSearch = false;
    }

    if (!iConfig) return;
    if (iConfig.filter !== undefined) search.resetBankNameSearch(iConfig.filter);
    if (iConfig.filter !== undefined) this.requestParams.filter(iConfig.filter);
    if(iConfig.filterByAttributeOperationName) this.requestParams.data.options.operationName = iConfig.filterByAttributeOperationName;
    if (iConfig.sort !== undefined) this.requestParams.sort(iConfig.sort);
  },

  getGeocode: function(str) {
  	if(!str) return null;
  	str = str.trim();
  	var latlon = str.split(',');
  	if(!latlon || latlon.length!==2) {
  		return null;
  	}
  	var lat = latlon[0], lon = latlon[1];
  	if(!isNaN(lat) && !isNaN(lon)) {
  		return {
  			'latitude': parseFloat(latlon[0]),
  			'longitude': parseFloat(latlon[1])
  		};
  	}
  	return null;
  },
  
  resetBankNameSearch : function(filters){
	  if (filters === null || (filters && filters.length === 0)) {
		  search.findNearByBankName = false;
		  jQuery(".visaATMBankNameListInner").html("<img class = \"loadingImage\" src=\"img/spinner.gif\">");
		  return;
	  }
	  var bankNameFlag = false;
	  for (var i = 0, l = filters.length; i < l; i++){
		  if (i in filters) {
			  var item = filters[i];
			  if (item !== "AIRPORT_CD" && item !== "OPER_HRS" && item !== "WHEELCHAIR" 
			  	&& item !== "BRAILLE_AUDIO" && item !== "ACCEPTS_PLUS_SHARED_DEPOSIT" && item !== "BALANCE_INQUIRY" 
			  	&& item !== "PIN_CHANGE" && item !== "PLUS_ALLIANCE_NO_SURCHARGE_FEE" && item !== "V_PAY_CAPABLE" 
			  	&& item !== "READY_LINK" && item !== "CHIP_CAPABLE"
			  	&& item !=="ACPT_INTL_CRD_IND" && item !== "NO_ATM_ACCS_FEE_IND") {  
				  bankNameFlag = true;
				  search.findNearByBankName = true;
			  }
		  }
	  }
	  if(bankNameFlag === false){
		  jQuery(".visaATMBankNameListInner").html("<img class = \"loadingImage\" src=\"img/spinner.gif\">");
		  search.findNearByBankName = false;
		
	  }
  },

   	openFilters: function() {
		var element = jQuery('.visaATMFilters .visaATMTogglee');
		if (element.css('display') == 'none') {
			jQuery('.visaATMFilters .visaATMToggler').click();    	
		}
	},

  	mapTotalsCallback: function(_data) {
  		//map new data to spatial point format
  		_data = this.reformatFindNearbyTotalResponse(_data);

	  var data = this.data = _data.d;
	  var statusCode = data.StatusCode;

	  	//diable attributes in the fitler module
	  	var that = this;
	 	var interval = setInterval(filterShow, 50); 
	 	function filterShow() { //wait until filter module is in the DOM	 		
	 		if(jQuery('.visaATMTogglee') && jQuery('.visaATMTogglee').length>0) {
	 			
	 			clearInterval(interval);

	 			if(data.Properties != null && statusCode == "Success" && !search.findNearByBankName) {

		 			jQuery('.visaATMFiltersByAttribute li').hide();
					if(data.Properties != null) {
						for(var i=0; i<data.Properties.length; ++i) {
							var propName = data.Properties[i].Name;
							if(propName === 'PLACE_NAME' || propName === 'TOTALCOUNT') {
								continue;
							}
							var filterLi = '.visaATMFiltersByAttribute li .visaATM'+propName;
							if(jQuery(filterLi) && jQuery(filterLi).length>0) {
								if(propName !=='PLUS_ALLIANCE_NO_SURCHARGE_FEE') {
									jQuery(filterLi) .parent().show();
								}
								// else {
								// 	var isChecked = $('.plusAlliance-input-wrapper input').is(':checked');
								// 	jQuery(filterLi).find('input').attr('checked', isChecked);
								// }
							}
						}
					}
					that.openFilters();
		 		}
		 	}
	 	}
	  //end of filter

	  setTimeout(function (){
		  if(data.Properties != null && statusCode == "Success" && !search.findNearByBankName) { 

		  		publisher.publish('updateBankNameList', this);

		  		for(var i=0; i<data.Properties.length; ++i) {
		  			if(data.Properties[i].Name !== "PLACE_NAME") {
		  				continue;
		  			}
		  			if(data.Properties[i].Name == "PLACE_NAME") { 
					  var bankNames = data.Properties[i].Value;
					  if(bankNames == "") 
					  {
						  jQuery(".visaATMBankNameListInner").html("");
						  return;
					  }
					  var bankNamesArray = bankNames.split("|");
					  var bankNameList = jQuery("<ul/>",{
						  "class" : "visaATMBankNameList"
					  });
					  jQuery('.visaATMBankNameListInner').html('');
					  bankNameList.html('');
					  for(var j=0;j<bankNamesArray.length;j++)
					  {
						  var bankNameListItem = jQuery("<li />",{
							  "title": bankNamesArray[j]
						  }); 
						  var bankNameListItemLabel = jQuery("<label />",{
							  "class": bankNamesArray[j]
						  });
						  var bankNameListItemCheckBox = jQuery("<input />",{
							  "type": "checkbox",
							  "name": bankNamesArray[j],
							  "class": "visaATMLocationNameCheckbox"
								 
						  });
						  bankNameListItemLabel.append(bankNameListItemCheckBox);
						  bankNameListItemLabel.append(bankNamesArray[j]);
						  bankNameListItem.append(bankNameListItemLabel);
						  bankNameList.append(bankNameListItem);
					  }
					  var last = jQuery("<li>&nbsp;</li>",{
						  "class": "visaATMLast",
						  "style": "visibility: hidden;"
					  });
					  bankNameList.append(last);

					  jQuery('.visaATMBankNameListInner').append(bankNameList);
					  jQuery('.visaATMBlend').remove();
					  var blend = jQuery("<div />",{
						  "class": "visaATMBlend"
					  });
					  jQuery('.visaATMFiltersByBank').append(blend);
					  search.findNearByBankName = true;
				  }
		  		}
		  }
		  var searchedValue = jQuery('.searchInput').val();
		  if(data.Properties !=null){
			  jQuery('.visaATMSearchedValue').html("<p>"+searchedValue+"</p>");
		  }
	  }, 4000);
  },
  
	mapDataCallback: function (_data){
		//map new data to spatial point format
  		_data = this.reformatFindNearbyResponse(_data);		

		var data = this.data = _data.d;
		publisher.publish('search/fetchComplete', data);
		var statusCode = data.StatusCode;
		if (search.searchType == 'Filter' && statusCode == 'NoResults') statusCode = 'NoFilterMatches';
		if (handlers[statusCode])
		{
			return handlers[statusCode](data, this);
		}

		return handlers.methodMissing(data);
	},

	reformatFindNearbyTotalResponse: function(data) {
		var toRet = {};
		var obj = toRet.d = {};
		obj['__type'] = 'Visa.Locator.Library.FindNearbyTotalsResponse';

		if(data.wsStatus.statusCode === 'CDI000') {
			obj.StatusCode = 'Success';
		}
		else if(data.wsStatus.statusCode === 'CDIS203'){
			obj.StatusCode = 'NoResults';	
		}
		else {
			obj.StatusCode = 'OtherErrors';
			return toRet;
		}

		if(data.responseData && data.responseData[0]) {
			var response = data.responseData[0];
			if(response) {

				if(response.foundATMLocations === null 
					&& response.matchedLocations && response.matchedLocations.length === 0
					&& obj.StatusCode === 'Success') {

					obj.StatusCode = 'LocationNotFound';
					return toRet;
				}

				obj.Properties = this.mapPropsInResponse(response.properties);

				if(this.isGeoSearch) { //if geosearch, mathcedLocation=[], use cached one
					if(this.matchedLocationCache_formatted && this.matchedLocationCache_formatted.length===0 && search.coords !== '') {
						var latlon = search.coords.split(',');
						obj.MatchedLocations = [{
							Location: {
								PlaceName: search.coords,
								Coordinates: {
									Latitude: latlon[0],
									Longitude: latlon[1]
								}
							}
						}];
					}
					else {
						obj.MatchedLocations = this.matchedLocationCache_formatted;
					}
				}
				else {
					obj.MatchedLocations = this.mapLocation(response.matchedLocations);
					this.matchedLocationCache_formatted = [];
				}


				var totalCount = 0;
				if(obj.Properties && obj.Properties.length > 0) {
					for(var i=0; i<obj.Properties.length; ++i) {
						var property = obj.Properties[i];
						if(property.Name === 'TOTALCOUNT') {
							totalCount = property.Value;
							break;
						}
					}
				}
				if(!obj.MatchedLocations || obj.MatchedLocations.length===0) {
					// console.log('reformatFindNearbyTotalResponse: no matched location');
					obj.StatusCode = 'NoResults';	
					// obj.StatusCode = 'OtherErrors';
					return toRet;

				}
				// else if(obj.MatchedLocations.length > 1 || !response.bestMapView) {
				else if(totalCount === 0 && obj.MatchedLocations.length>0 && obj.StatusCode === 'Success') {
					// console.log('reformatFindNearbyTotalResponse: more than one matched location found.')
					obj.StatusCode = 'AmbiguousMatches';

					//reformat placeName if its typeName is POI
					obj.MatchedLocations = this.reformatMatchedLocationsIfAmbiguous(obj.MatchedLocations);

					this.matchedLocationCache_formatted = obj.MatchedLocations;
				}	
				else {
					obj.MatchedLocations[0].Location.BestMapView = this.mapBestMapView(response.bestMapView);
				}



				obj.MetaData = response.metaData;
				obj.DistanceUnit = response.distanceUnit;
			}	
		}
		return toRet;
	},

	reformatMatchedLocationsIfAmbiguous: function(locations) {
		if(locations && locations.length>0) {
			for(var i=0; i<locations.length; ++i) {
				var temp = locations[i];

				if(temp.Location.TypeName === 'POI') {
					temp.Location.PlaceName = temp.Location.Address.FormattedAddress + (temp.Location.Address.City ? ', '+temp.Location.Address.City : '') + (temp.Location.Address.Country ? ', '+temp.Location.Address.Country : '');
				}
			}
		}
		return locations;
	},

	reformatFindNearbyResponse: function(data) {
		var toRet={};
		var obj = toRet.d = {};
		obj['__type'] = 'Visa.Locator.Library.FindNearbyResponse';

		if(data.wsStatus.statusCode === 'CDI000') {
			obj.StatusCode = 'Success';
		}
		else if(data.wsStatus.statusCode === 'CDIS203'){
			obj.StatusCode = 'NoResults';	
		}
		else {
			obj.StatusCode = 'OtherErrors';
			return toRet;
		}

		if(data.responseData && data.responseData[0]) {
			var response = data.responseData[0];
			if(response) {

				if(response.foundATMLocations === null 
					&& response.matchedLocations && response.matchedLocations.length === 0
					&& obj.StatusCode === 'Success') {

					obj.StatusCode = 'LocationNotFound';
					return toRet;
				}


				obj.FoundResults = {};
				obj.FoundResults.Results = this.mapLocation(response.foundATMLocations);
				if(response.foundATMLocations) {
					obj.FoundResults.TotalFound = response.totalATMCount;
					
					// var that = this;
					// jQuery.each(obj.FoundResults.Results, function(index, temp) {
					// 	if(temp.Location.isMappable === 'Y' || temp.Location.isMappable === true) {
					// 		temp.Location.Mappable = true;
					// 	}
					// 	else {
					// 		temp.Location.Mappable = false;
					// 	}
					// 	temp.Location.Total = 1;
					// 	temp.Location.Properties = that.mapPropsInResponse(temp.Location.Properties);
					// });
				}
				else {
					obj.FoundResults.TotalFound = 0;
				}
			

				obj.Map = null;

				if(this.isGeoSearch) { //if geosearch, mathcedLocation=[], use cached one
					if(this.matchedLocationCache_formatted && this.matchedLocationCache_formatted.length===0 && search.coords !== '') {
						var latlon = search.coords.split(',');
						obj.MatchedLocations = [{
							Location: {
								PlaceName: search.coords,
								Coordinates: {
									Latitude: latlon[0],
									Longitude: latlon[1]
								}
							}
						}];
					}
					else {
						obj.MatchedLocations = this.matchedLocationCache_formatted;
					}
				}
				else {
					obj.MatchedLocations = this.mapLocation(response.matchedLocations);
					this.matchedLocationCache_formatted = [];
				}
					
				// if(!obj.MatchedLocations || obj.MatchedLocations.length===0 ||
				// 	(obj.MatchedLocations.length===1 && (!obj.FoundResults || !obj.FoundResults.Results || obj.FoundResults.Results.length===0))) {
				// 	// console.log('reformatFindNearbyResponse: no matched location');
				// 	obj.StatusCode = 'NoResults';	
				// }
				if(!obj.MatchedLocations || obj.MatchedLocations.length === 0) {
					obj.StatusCode = 'OtherErrors';
					return toRet;
				}
				// else if(obj.MatchedLocations.length >1 || !response.bestMapView) {
				else if(obj.MatchedLocations.length >0 && obj.StatusCode === 'Success' && obj.FoundResults.TotalFound === 0) {
					// console.log('reformatFindNearbyResponse: more than one matched location found.');
					obj.StatusCode = 'AmbiguousMatches';
					obj.MatchedLocations = this.reformatMatchedLocationsIfAmbiguous(obj.MatchedLocations);
					this.matchedLocationCache_formatted = obj.MatchedLocations;
				}
				else {
					obj.MatchedLocations[0].Location.BestMapView = this.mapBestMapView(response.bestMapView);
				}

				obj.MetaData = response.metaData;
				obj.DistanceUnit = response.distanceUnit;
			}
		}	
		return toRet;
	},

	mapPropsInResponse: function(props) {
		if(props && props.length > 0) {
			jQuery.each(props, function(index, prop) {
				switch(prop.name) {
					//TODO: temp, waiting for ACPT_INTL_CRD_IND API ready
					case 'ACPT_INTL_CRD_IND':
						break;
					case 'NO_ATM_ACCS_FEE_IND':
						break;
					//End of TODO
					case 'AIRPORT_CD':
						prop.Name = prop.name;				
						prop.Value = (prop.value!==null && prop.value !== '') ? prop.value : null;
						break;
					case 'OPER_HRS':
					case 'PLACE_NAME':
					case 'CARD_ACCEPT':
					case 'LOC_DESC':
						prop.Name = prop.name;
						prop.Value = prop.value;
						break;
					default:
						prop.Name = prop.name;
						prop.Value = (prop.value === 'N' || prop.value === 0) ? 0 : 1;
				}
				delete prop.name;
				delete prop.value;
			});
		}

		return props;
	},

	mapLocation: function(locations) {
		var toRet=[];
		if(locations && locations.length>0) {
			var loc = {};
			for(var i=0; i<locations.length; ++i) {
				var temp = locations[i];
				loc = {};
				loc.Score = temp.location.score;
				loc.Location = {};	
				loc.Location.Id = temp.location.id;

				loc.Location.Address = {};
				loc.Location.Address.Street = temp.location.address.street;
				loc.Location.Address.Street2 = temp.location.address.street2;
				loc.Location.Address.City = temp.location.address.city;
				loc.Location.Address.State = temp.location.address.state;
				loc.Location.Address.PostalCode = temp.location.address.postalCode;
				loc.Location.Address.Country = temp.location.address.country;
				loc.Location.Address.FormattedAddress = temp.location.address.formattedAddress;
				loc.Location.Address.IsEmpty = temp.location.address.isEmpty;
				loc.Location.Address.HasOnlyStreet = temp.location.address.hasOnlyStreet;
				loc.Location.Address.HasFullAddress = temp.location.address.hasFullAddress;
				loc.Location.Address.HasFormattedAddress = temp.location.address.hasFormattedAddress;

				loc.Location.TypeName = temp.location.typeName;
				loc.Location.PlaceName = temp.location.placeName;

				loc.Location.Coordinates = {};
				loc.Location.Coordinates.Latitude = temp.location.coordinates.latitude;
				loc.Location.Coordinates.Longitude = temp.location.coordinates.longitude;

				loc.Location.GeocodeMethod = temp.location.geocodeMethod;
				loc.Location.Properties = null;	

				loc.Location.BestMapView = null;

				loc.Location.TypeName = temp.location.typeName;

				//findNearby only
				if(temp.location.isMappable !== undefined) {
					loc.Location.Mappable = (temp.location.isMappable === 'Y' ? true : false);
					loc.Location.Total = 1;

					if(temp.location.properties && temp.location.properties.length>0) {
						loc.Location.Properties = this.mapPropsInResponse(temp.location.properties);
					}
				}	
				//end of findNearby only

				toRet.push(loc);		
			}
		}
		return toRet;
	},

	mapBestMapView: function(data) {
		var toRet = {};
		if(data) {
			toRet.MaxLatitude = data.maxLatitude;
			toRet.MinLongitude = data.minLongitude;
			toRet.MaxLongitude = data.maxLongitude;
			toRet.MinLatitude = data.minLatitude;

			toRet.NorthEast = {};
			toRet.NorthEast.Latitude = data.northEast.latitude;
			toRet.NorthEast.Longitude = data.northEast.longitude;

			toRet.SouthWest = {};
			toRet.SouthWest.Latitude = data.southWest.latitude;
			toRet.SouthWest.Longitude = data.southWest.longitude;

			toRet.NorthWest = {};
			toRet.NorthWest.Latitude = data.northWest.latitude;
			toRet.NorthWest.Longitude = data.northWest.longitude;

			toRet.SouthEast = {};
			toRet.SouthEast.Latitude = data.southEast.latitude;
			toRet.SouthEast.Longitude = data.southEast.longitude;

			if(data.centroid) {
				toRet.Centroid = {};
				toRet.Centroid.Latitude = data.centroid.latitude;
				toRet.Centroid.Longitude = data.centroid.longitude;
			}

			toRet.DistanceAcrossInMiles = data.distanceAcrossInMiles;
		}

		return toRet;
	},

  // called when receive Ambiguous Matches from search box… creates unordered list with links.
  showHint: function(data){
    
    var hints = jQuery.map(data.MatchedLocations, function (item, i){
      var href = rison.encode({
        page: 'results',
        params: { query: item.Location.PlaceName } // item.Location.PlaceName
      });
	  
	  return { 
	  	hint: item.Location.PlaceName, 
	  	href: href,
	  	coords: item.Location.Coordinates.Latitude +','+item.Location.Coordinates.Longitude,
	  	count: (i%2 == true) ? 'even' : 'odd' 
	  };
    });
		
    language.data.hints = hints;
    dust.render('searchDidYouMean', language.data, function (err, out){
      hint.$element.html(out);
      hint.show();
    });
  },

  smsRequest: function() {
		 // make default object for SMS return url
	   request = {
	   	driving: search.recentHash.atm,
	    waypoints: {
	    	1: search.recentHash.waypoint
	    },
	    culture: config.culture,
	    token: config.token
	  };
    return request;
	},

  showResults: function(data){
    var params = this.requestParams.get(),
        transformed = transform.results(data, params);
			
			// this is where the url was getting cleared of the language… wahoo!  found it…
			// need to not clear, or else add language to this...
    hash.set({
      page: 'results',
      params: {
        query: search.query
      }
    });
    
    publisher.publish('search/success', this, transformed, params);
  }
};

/*
 * private helpers
*/
function submitHint (element){
  var $element = jQuery(element);
  search.coords = $element.attr('coords') ? $element.attr('coords') : '';
  var href = $element.attr('href').replace(/^#/, '');
  var decoded = rison.decode(href);
  hint.$input.val(decoded.params.query);

  //get index of suggestion selected
  var $list = $element.closest('ul').find('li');
  var indexSelected = $list.index($element.closest('li'))-1; //the first list is 'Did you mean..'
  if(search.matchedLocationCache_formatted && search.matchedLocationCache_formatted.length>0) {
  	search.matchedLocationCache_formatted = [search.matchedLocationCache_formatted[indexSelected]];
  }

  search.fetch();
}

/*
 * subscriptions
*/
hint.subscribe({
	'keyEnter': submitHint,
	'click': submitHint
});

publisher.subscribe('page/render/home', function (){
  setTimeout(function (){
    search.$input.focus();
  }, 1); // w/o the setTimeout, the input animates on page load (?)
});

/*
 * return the module
*/
return search;

});
