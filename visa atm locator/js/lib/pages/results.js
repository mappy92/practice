/*
 * Needs some major dependency refactoring into the publisher.advise model!
*/
define([
  'lib/page',
  'lib/vendor/publisher',
  'lib/util/array',
  'src/widget/search',
  'src/views',
  'src/widget/map',
  'src/widget/filter',
  'src/widget/toggles',
  'src/widget/sort',
  'src/widget/resultsLinks',
  'lib/remote/language',
  'src/widget/getDirections',
  'lib/remote/spatialPoint'
], function (
  page,
  publisher,
  array,
  search,
  dust,
  map,
  filter,
  toggles,
  sort,
  resultsLinks,
  language,
  getDirections,
  spatialPoint
){

  var results =  page.create('results');

  jQuery.extend(results, {
    setMapView: function (callback){
      // if the resultsMap filter hasn't fired yet, try again later
      var attempts = 0;
      if (!map.loaded) {
        if (++attempts > 7) {
          throw results.locals.bingMapsError; //"Could not load Bing Maps";
        }
        setTimeout(function (){
          results.setMapView.call({}, callback);
        }, 200);
        return;
      }

      callback();
      map.setViewFromPins('atms');
    },
   
		// back From Directions
		backToResults: function() {	
      // map.attachDragging();	##disableRefetchWhenDragging
			results.renderResults();
		},

    renderResults: function (){
    	// clear map results
    	map.clearEntity('route');
    	map.clearEntity('endPoints');
    
      results.printType = 'results';
      
	  // show filters if hidden
      jQuery('.visaATMFilters .visaATMToggle').show();
      results.setMapView(function (){
      
        	map.clearEntity('atms');
          map.attachDragging();

    			var resultsLength = results.locals.searchResults.items.length;
    			
    			// add print info - for static image from Bing api
    			results.locals.print = results.locals.appData['search/success'];
    			var locationsCount = results.locals.appData['search/success'].items.length;
    			results.locals.print.pp = '';
    			for (var i = 0; i < locationsCount; i ++) {
    				results.locals.print.pp = results.locals.print.pp + 'pp='+results.locals.print.items[i].Coordinates.Latitude+','+results.locals.print.items[i].Coordinates.Longitude+';34;'+(i+1)+'&';
    			}
    		
    		// end print info			
    				
          for (var i = 0, coords; i < resultsLength; i ++) {
              
          	results.locals.searchResults.items[i].NotMappable = results.locals.searchResults.items[i].Mappable ? "" : results.locals.searchResults.items[i].NotMappable = results.locals.mapUnclear;
          	
      			coords = results.locals.searchResults.items[i].Coordinates;
      			indexPin = results.locals.searchResults.items[i].indexPin;
      			map.addPin(coords.Latitude, coords.Longitude, (indexPin) + '', 'atms', '', results.locals.searchResults.items[i]);
      			jQuery('.MicrosoftMap .hide').hide();
          }
    		
        //no longer doing it here since it's not support in findNearby call. The availability of attributes are now in findNearbyTotals
    		// enable and disable props
    		// results.disableFilters(results.locals.appData['search/success'].items[0].unavailableProps);
		
    		dust.render('_searchResults', results.locals, function (err, html){
    			results.$directions.hide();
    			results.$results.html(html);
    			sort.changeDistanceType();
    			// open filters if closed when rendering results
    			// results.openFilters();
    			jQuery('.visaATMSearchedValue').show();
    			jQuery('#hideshowbutton').undelegate('a','click').delegate('a','click',function(event){
    				jQuery('.toggleButtonLeft').toggleClass('toggleButtonRight');
    				jQuery('.visaATMResultsInfo').toggleClass('animate');
    				jQuery('#hideshowbutton img').toggleClass('arrowanimate');
    				jQuery('.visaATMResultsDirections').toggleClass('hide');
    			});
    			
    			results.$searchResults.fadeIn(250, function() {
    			
    				// hide pagination if only one page.
    				if (results.locals.searchResults.pages.numberOfPages == 1) {
    				//	alert('hiding');
    					jQuery('.visaATMPagination').hide();
    				}
    			
    				if (!search.recentHash.waypoint) {
    					// do nothing… this works to find out if an object does not exist.
    				} else if (!results.smsBitly) {
    					// set some local info
    					results.locals.driving = search.recentHash.atm;	
    					// render directions once
    					spatialPoint.routeFromElement(search.smsRequest());
    					results.smsBitly = true;
    				}
    			
    			});
					
        });
      });
      jQuery('.MicrosoftMap').show();
    },
    
	// disableFilters: function(e) {
		
	// 	// reset all to enabled...
	// 	jQuery('.visaATMFiltersByAttribute li ').css("display", "block");/*removeClass('disabled').find('input').removeAttr('disabled');*/
	
	// 	for(var i=0; i<e.length; i++) {
	// 		//jQuery('.visaATM'+e[i].name).addClass('disabled').find('input').attr('disabled', 'disabled');
	// 		jQuery('.visaATM'+e[i].name).parent().css("display", "none");
	// 	}
	// },
	
	// openFilters: function() {
	// 	var element = jQuery('.visaATMFilters .visaATMTogglee');
	// 	if (element.css('display') == 'none')
	// 		jQuery('.visaATMFilters .visaATMToggler').click();    	
	// },

	renderDirections: function () {
    	results.locals.currentDirectionMode = getDirections.$distanceMode;
			// add print info - for static image from Bing api
			results.locals.print = results.locals.appData['search/success'];
			results.locals.travelMode = spatialPoint.DistanceMode;

			// make pins for directions
			results.locals.print.pp = 'wp.1='+results.locals.route.endPoints.start.latitude+','+results.locals.route.endPoints.start.longitude+'&'+
						'wp.2='+results.locals.route.endPoints.finish.latitude+','+results.locals.route.endPoints.finish.longitude+'&';
			// end print info...

      dust.render('_directions', results.locals, function (err, out) {
    	  if(results.locals.driving.Mappable === false)
    	  {
    		 
    		  jQuery(".MicrosoftMapDrawing").hide();
    		  jQuery(".visaATMFlagPin img").hide();
    		  jQuery(".visaATMFlagPin div").hide();
    	  }
    	  else
    	  {
    		  jQuery(".MicrosoftMapDrawing").show();
    		  jQuery(".visaATMFlagPin img").show();
    		  jQuery(".visaATMFlagPin div").show();
    	  }

    	  
        results.$searchResults.hide();
        results.$directions.html(out).hide();
        sort.changeDistanceType();
        results.filter(results.$directions);
        results.$directions.fadeIn(250);
        jQuery('.visaATMSearchedValue').hide();
        jQuery('.visaATMFilters .visaATMToggle').hide();
        jQuery(".visaATM_InfoBox_InfoArrow").hide();
      });

      // fix current distanceMode
      getDirections.setDirectionButtons();
  },

		// click event for print button on either results or directions view.
	printPage: function() {
		window.print();
	},

  clickPage: function (event) {
    return jQuery(event.currentTarget);
  }

  });

  results.defineFilter({
    resultsMap: {
      setup: function (el){
        map.init(el[0]);
      },

      tearDown: function (){
        map.tearDown();
      }
    },

    // Render results if we have them (search initiated on other page, not the results page)
    resultsList: function (element){

    	if (results.locals.searchResults) {
    		results.renderResults();
    	}

      results.$element.undelegate('.visaATMBackToResults', 'click').delegate('.visaATMBackToResults', 'click', jQuery.proxy(results, 'backToResults'));
      results.$element.undelegate('.visaATMPagination a', 'click').delegate('.visaATMPagination a', 'click', jQuery.proxy(results, 'clickPage'));
	  results.$element.undelegate('.visaATMPrintPage', 'click').delegate('.visaATMPrintPage', 'click', jQuery.proxy(results, 'printPage'));
	  // results.$element.undelegate('.visaATMSendResults', 'click').delegate('.visaATMSendResults', 'click', jQuery.proxy(sms, 'initSMS'));
      resultsLinks.init(element);
      window.scrollTo(0, 1); // scroll to top on results
    },
    

    directions: function (element){
      results.$directions = element;
    },

    getDirections: function($form){
      getDirections.init($form);
      results.printType = 'directions';
    },

    filterResults: 		jQuery.proxy(filter.init, filter),
    toggles:       		jQuery.proxy(toggles.create, toggles),
    sortResults:   		jQuery.proxy(sort.init, sort),
    distanceType: 		jQuery.proxy(sort.initDistance, sort),
    resultsLinks:  		jQuery.proxy(resultsLinks.init, resultsLinks)
  });


  /*
   * Mostly back-button support, when the parameters in the URL change
   * the atm result are fetched again, but not on the first load of the page
  */
  results.subscribe('setParams', function performQueryIfDifferent (){
  	
    var firstRender = true,
        lastQuery = null;

    return function (params){
      if (firstRender){
        // gets called on first render and we don't want to do anything
        firstRender = false;
        return;
      }

      if (params.query == lastQuery) return;

      // mostly happens with the back button
      search.$input.val(params.query);
      search.fetch();
      lastQuery = params.query;
    };
  }
  );

  results.subscribe('tearDown', function (){
    results.locals.searchResults = null;
  });

  return results;
});
