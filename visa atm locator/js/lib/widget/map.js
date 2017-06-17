/*
	* This object wraps the entire Microsoft.Maps API.
*/
define(['src/views', 'lib/page', 'lib/widget/sort','lib/widget/search'], function(dust, page, sort,search) {	
  /*
   * Dumps the microsoft map onto the page
   */
  return {
  bingThis: null,
  init: function (element){
//     this.bing = new Microsoft.Maps.Map(element, {
//       credentials: 'AnELANul_dv_NEsaShJK2-ItSDLwEm7C4HCWZD-rmaYhO1LvBcZrV2dye5NSUnY9',
//       useInertia: false,
//       tileBuffer: 0,
//       mapTypeId: Microsoft.Maps.MapTypeId.road,
//       disableBirdseye: true,
//       enableClickableLogo: false,
//       enableSearchLogo: false,
//       showMapTypeSelector: false,
//       showScalebar: false,
//       height: 730,
//       width: 1264,
// //		showDashboard: false,
//       fixedMapPosition: true,
//       animate: false,
//       center: new Microsoft.Maps.Location(37.75334401310657, -96.41601562500001),
//       zoom: 3
      
//     });

	this.bing = new google.maps.Map(element, {
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		mapTypeControl: false,
		// zoomControl: true,
		// zoomControlOptions: {
		//     position: google.maps.ControlPosition.RIGHT_TOP
		// },
		center: new google.maps.LatLng(37.75334401310657, -96.41601562500001),
		zoom: 3,
		height: 730,
		width: 1264   
    });

    this.bing.entities = [];
   
    bingThis = this;
    this.dragged = false;
    this.multidragged = false;

    this.defineEntity('route');
    this.defineEntity('atms');
    this.defineEntity('endPoints');
    this.loaded = true;
    this.attachToggle();

    // this.attachDragging(); //map dragging on result list page ##disableRefetchWhenDragging

    return this;
  },


	attachDragging: function() {
	  	//trigger re-fetch when moving the map
	    //prevent if it's a simple click on the map
	    // this.mousedownOnMapHandler = Microsoft.Maps.Events.addHandler(this.bing, 'mousedown',function(){
	    // 	bingThis.isDragging = false;
	    // 	// console.log('map mousedown, isDragging = ' + bingThis.isDragging);
	    // });
	    // this.mousemoveOnMapHandler = Microsoft.Maps.Events.addHandler(this.bing, 'mousemove',function(){  
	    // 	bingThis.isDragging = true;
	    // 	// console.log('map mousemove, isDragging = ' + bingThis.isDragging);
	    // });
	    // this.mouseupOnMapHandler = Microsoft.Maps.Events.addHandler(this.bing, 'mouseup',function(){
	    // 	// console.log('map mouseup, isDragging = ' + bingThis.isDragging);
	    // 	if(bingThis.isDragging === true) {
	    // 		search.isMapDragging = true;

	    // 		//1 degree of latitude = 69.172 miles,
	    // 		//in case some pushpins are on the edge of boundary that users cannot see (set bounds can fix it, but here it's not an option), so * 0.75
	    // 		//the backend doesn't take float, need parseInt
	    // 		search.radius = parseInt(bingThis.bing.getBounds().height *0.75 * 69.172/2); //caculate degree (lat) to miles, backend does not take float
	    // 		bingThis.getMapCenter();
	    // 	}
	    // });
	    var that = this;
	    if(this.mapDragHandler) {}
	    else {
		    this.mapDragHandler = google.maps.event.addListener(this.bing, "dragend", function() {
				search.isMapDragging = true;
				if(that.dragged == true) {
					that.multidragged = true;
				} else {
					that.dragged = true;					
				}
				search.radius = parseInt(bingThis.bing.getBounds().height *0.75 * 69.172/2); //caculate degree (lat) to miles, backend does not take float
		    	bingThis.getMapCenter();
			});
		}
	},

	detachDragging: function() {
		// if(Microsoft.Maps.Events.hasHandler(this.bing, 'mousedown')) {
		// 	Microsoft.Maps.Events.removeHandler(this.mousedownOnMapHandler);
		// }
		// if(Microsoft.Maps.Events.hasHandler(this.bing, 'mousemove')) {
		// 	Microsoft.Maps.Events.removeHandler(this.mousemoveOnMapHandler);
		// }
		// if(Microsoft.Maps.Events.hasHandler(this.bing, 'mouseup')) {
		// 	Microsoft.Maps.Events.removeHandler(this.mouseupOnMapHandler);
		// }

		// google.maps.event.removeListener(this.mousedownOnMapHandler);
		// google.maps.event.removeListener(this.mousemoveOnMapHandler);
		// google.maps.event.removeListener(this.mouseupOnMapHandler);

		if(this.mapDragHandler) {
			google.maps.event.removeListener(this.mapDragHandler);
			this.mapDragHandler = null;
		}
	},

  	/* toggle map view b/w road and automatic*/
  attachToggle: function() {
	  jQuery('.visaATMViewLinks button').click(function(){
	  	if($(this).find('span').hasClass('visaATMSortCurrent')) {
	  		return false;
	  	}

		bingThis.toggleMapView();
		if(this.name == "Street") {
			jQuery(".ariel span").removeClass('visaATMSortCurrent');
			jQuery(".street span").addClass('visaATMSortCurrent');
		}
		else {
		  jQuery(".street span").removeClass('visaATMSortCurrent');
		  jQuery(".ariel span").addClass('visaATMSortCurrent');
		}
	});
  },
  toggleMapView: function(){
	  if(this.bing.getMapTypeId() === google.maps.MapTypeId.ROADMAP)
		  // this.bing.setMapType(Microsoft.Maps.MapTypeId.aerial);
		this.bing.setMapTypeId(google.maps.MapTypeId.SATELLITE)
	  else
		  // this.bing.setMapType(Microsoft.Maps.MapTypeId.road);
		this.bing.setMapTypeId(google.maps.MapTypeId.ROADMAP)
  },
  /*
   * Entities, or "layers" to add pins to and otherwise, manipulate
   * Do them in order, the last one added is the topmost
  */
  entities: {},
  entityCount: 0,
  defineEntity: function (name){
    // this.entities[name] = new Microsoft.Maps.EntityCollection({zIndex: ++this.entityCount});
    this.entities[name] = {};
    // this.entities[name].zIndex = ++this.entityCount;

    this.entities[name].pins = [];
    this.entities[name].pindata = [];
    this.bing.entities.push(this.entities[name]);
  },

  /*
 attachEvent: function()
  {
	  alert("in attach event");
	  Microsoft.Maps.Events.addHandler(this.bing, 'viewchange',bingThis.getCenter());
  },

 */
  getMapCenter:function(){
	  var latlon = this.bing.getCenter();
	  this.bing.zoomLevel = this.bing.getZoom();
	  jQuery('.visaATMSearchWrap input').val(latlon.lat() + ',' + latlon.lng());
	  
	  search.setCoordinates(latlon);
  	//alert('Lat/Long: ' + latlon.latitude +'/' + latlon.longitude);
  }
  ,
  /*
   * Clears the pins / direction etc. from an entity
  */
  clearEntity: function(entity){
    if (!this.entities[entity]) return;
    // this.entities[entity].clear();
    this.setMapOnAll(null, entity);
    this.entities[entity].pins.length = 0;
    
  },

  
  // * Adds a pin to a layer
  
  addPin: function(latitude, longitude, text, entity, path, pindata) {
  
  	// do we have accurate location data for this address?
		var showPin = '';
 		if (typeof pindata == 'object') {
	 		showPin = pindata.Mappable ? '' : 'hide';
 		}

		var location = new google.maps.LatLng(latitude, longitude);
		var pin = new google.maps.Marker({
			position: location,
			map: this.bing,
			label: '',
        	icon: (text == 'A' || text == 'B') ? (path || page.assetURL+'/pushpin.png') : (path || page.assetURL + '/orange-pins/'+text+'.png')
        });
        pin.set('id', text); 
        pin.set('class', (text == 'A' || text == 'B') ? 'visaATMFlagPin' : showPin);

        if(pin.get('class') === 'hide') {
        	pin.setVisible(false);
        }
  

		// var pin = new Microsoft.Maps.Pushpin(location, {
	 //      text: text,
	 //      height: (text == 'A' || text == 'B') ? 60 : 39,
	 //      overflow: "inherit",
		//   icon: path || page.assetURL+'/pushpin.png',
	 //      typeName: (text == 'A' || text == 'B') ? 'visaATMFlagPin' : showPin
	 //    });
    
		// add pin data to array for hover state
		this.entities[entity].pindata[text] = pindata;

		// Microsoft.Maps.Events.addHandler(pin, 'mouseover', this.pinMouseOver );
		// Microsoft.Maps.Events.addHandler(pin, 'mouseout', this.pinMouseOut);
		var that = this;
		google.maps.event.addListener(pin, "mouseover", function() {
			that.pinMouseOver(pin);
		});
		google.maps.event.addListener(pin, "mouseout", function() {
			that.pinMouseOut(pin);
		});

		// this.entities[entity].push(pin);
		this.entities[entity].pins.push(pin);
	},
	
	/* start infoBox functions */
	pinInfobox: null,
	
	displayInfobox: function (pin) {
			// make sure we clear any infoBox timer that may still be active
			// build or display the infoBox
			
			this.stopInfoboxTimer(pin);
			
			if(pin.get('id') == 'A' || pin.get('id') =='B') {
				return;
			}
			var pindata = bingThis.entities.atms.pindata[pin.get('id')];
			var pinhtml = '';
			
			// render infobox
			pindata.assetURL = page.assetURL;
			pindata.distanceShow = (sort.distanceType == "Miles") ? pindata.distance : pindata.distanceKm;
			pindata.distanceText = page.locals.resultsDistance;
			
			// get pin html
			dust.render('pinData', pindata, function (err, html){
		        pinhtml = html;
		    });

			if (pin != null) {
				// Create the info box for the pushpin
				var location = pin.getPosition();
 
				var options = {
					position: location,
					content: pinhtml,

					disableAutoPan: true,
					maxWidth: 0,
					alignBottom: true,
					// pixelOffset: new google.maps.Size(-15, 0),
					zIndex: null,
					boxStyle: {
	                    height: 125,
	   					width: 250,
	                },
	    			closeBoxURL: "",
	    			isHidden: false,
	    			enableEventPropagation: false
				};

				// destroy infobox if exists
				if (this.pinInfobox != null) {
					delete bingThis.bing.entities.infobox;
					// if (Microsoft.Maps.Events.hasHandler(this.pinInfobox, 'mouseleave'))
					// 	Microsoft.Maps.Events.removeHandler(this.pinInfobox.mouseLeaveHandler);
					// if (Microsoft.Maps.Events.hasHandler(this.pinInfobox, 'mouseenter'))
					// 	Microsoft.Maps.Events.removeHandler(this.pinInfobox.mouseEnterHandler);
					
					jQuery('.infoBox').unbind();
					this.pinInfobox.close();
					this.pinInfobox = null;
			}
				
				// create the infobox
				this.pinInfobox = new InfoBox(options);
				this.pinInfobox.open(this.bing, pin);
				var that = this;
			
				// push infobox to map
				bingThis.bing.entities.infobox = this.pinInfobox;
				jQuery('.visaATM_InfoBox').parent().parent().parent().parent().css('z-index', 999);	

				this.pinInfobox.addListener('domready', function() { //wait until html load
					
					//Google map event does not support mouseenter/mouseleave
					jQuery('.infoBox').on('mouseenter', function(e){
		                that.pinInfoboxMouseEnter();
		            }).on('mouseleave', function(e){
		                that.pinInfoboxMouseLeave();
		            });

					jQuery(".visaAtmInfoBoxCrossButton").click(function(){
						// jQuery(".visaATM_InfoBox").hide();
						// return false;
						that.pinInfobox.close();
					});

					// add click event to pinInfoBox
					that.pinInfoBoxClick();
				});
				
				
			}
	},

	pinInfoBoxClick: function() {
		jQuery('.visaATM_InfoBox').click(function() {
			jQuery('.MapPushpinBase').hide();
			var infoBoxIndex = jQuery(this).data('index');
			jQuery('.MapPushpinBase').eq(infoBoxIndex-1).show();
			jQuery('.visaATMPrintInfo').find('*[data-index]').each(function(index) {
				if (infoBoxIndex == (index+1)) {
					var thisBox = jQuery(this);
					jQuery(this).click();
				}
			});
		});
	},

	hideInfobox: function (e)
	{
		if (this.pinInfobox != null)
			this.pinInfobox.setVisible(false);
	},

	startInfoboxTimer: function (e) {
		// start a count-down timer to hide the popup.
		// This gives the user time to mouse-over the popup to keep it open for clickable-content.
		if (this.pinInfobox) {

			if (this.pinInfobox.pinTimer != null) {
				clearTimeout(this.pinInfobox.pinTimer);
			}
			// give 300ms to get over the popup or it will disappear
			this.pinInfobox.pinTimer = setTimeout(this.timerTriggered, 300);
		}
	},
	
	stopInfoboxTimer: function (e) {
		if (this.pinInfobox != null && this.pinInfobox.pinTimer != null) {
			clearTimeout(this.pinInfobox.pinTimer);
		}
	},
	
	mapViewChange: function (e) {
		bingThis.stopInfoboxTimer(e);
		bingThis.hideInfobox(e);
	},
	
	pinMouseOver: function (pin) {
		bingThis.displayInfobox(pin);
	},
	pinMouseOut: function (pin) {
		//	TODO: detect if the mouse is already over the infoBox
		//	This can happen when the infobox is shown overlapping the pin where the mouse is at
		//	In that case, we shouldn't start the timer.
		bingThis.startInfoboxTimer(pin);
	},
	pinInfoboxMouseLeave: function (e) {
		bingThis.hideInfobox(e);
	},
	pinInfoboxMouseEnter: function (e) {
		// NOTE: This won't fire if showing infoBox ends up putting it under the current mouse pointer.
		bingThis.stopInfoboxTimer(e);
	},
	timerTriggered: function (e) {
		bingThis.hideInfobox(e);
	},
	/* end infoBox stuff */

  dispose: function (){
    this.bing.dispose();
  },

  setView: function (arguments){
    // this.bing.setView.apply(this.bing, arguments);
    this.bing.setCenter(arguments.bounds.getCenter());
    this.bing.fitBounds(arguments.bounds);


    //some of the markers not showing up until map moved 
    var cnt = this.bing.getCenter();
    cnt.e+=0.000001;
    this.bing.panTo(cnt);
    cnt.e-=0.000001;
    this.bing.panTo(cnt);
	
    },

  setViewFromPins: function(entity){
  	var bounds = new google.maps.LatLngBounds();
  	for(var i=0; i<this.entities[entity].pins.length; ++i) {
  		bounds.extend(this.entities[entity].pins[i].getPosition());
  	}
  	// var argument = {
  	// 	bounds: Microsoft.Maps.LocationRect.fromLocations(this.entities[entity].pins),
   //    	padding: 100,
  	// }
  	var argument = {
  		bounds: bounds
  	};
  	// if(this.bing.getZoom() !== null && this.bing.getZoom() !== undefined) {
  	// 	argument.zoom = this.bing.getZoom();

  	// 	// argument.center = new Microsoft.Maps.Location(argument.bounds.center.latitude, argument.bounds.center.longitude);
  	// 	delete argument.bounds; //bounds conflict with zoomLevel, the map will always take bounds when it exists

  	// 	delete this.bing.zoomLevel;
  	// }
  	// else if(this.mapSpec && this.mapSpec.zoomLevel) { //after dragging
  	// 	argument.zoom = this.mapSpec.zoomLevel;
  	// 	argument.center = this.mapSpec.center;
  	// 	delete argument.bounds;

  	// 	delete this.mapSpec;
  	// }
  	if(!this.dragged) {
    	this.setView(argument); 
  	}
  	if(!this.multidragged) {
    	this.dragged = false;  		  		
  	}	else {
  		this.multidragged = false;
  	}
  },

  location: function (latitude, longitude){
    // accept object {latitude: lat, longitude: lon}
    if (typeof latitude === 'object')
      return this.location(latitude.latitude, latitude.longitude);
    return new google.maps.LatLng(latitude, longitude);
  },

  route: function (data){
    var locations = [];
    jQuery(".visaATM_InfoBox").hide();
    for (var i = 0, l = data.path.length; i < l; i++)
      locations.push(this.location(data.path[i].latitude, data.path[i].longitude));

    // this.entities.route.clear();
    // this.entities.atms.clear();
    // this.entities.endPoints.clear();

    this.setMapOnAll(null, 'all');
    this.entities.route.pins.length = 0;
    this.entities.atms.pins.length = 0;
    this.entities.endPoints.pins.length = 0;

    // var options = {strokeColor: new Microsoft.Maps.Color(255,0,0,255) }; 
    // this.entities.route.push(new Microsoft.Maps.Polyline(locations,options));

    var options = {
    	path: locations,
	    strokeColor: "#0000FF",
	    geodesic: true,
	    map: this.bing
    };
    this.entities.route.pins.push(new google.maps.Polyline(options));

    this.addPin(
      data.endPoints.start.latitude,
      data.endPoints.start.longitude,
      'A',
      'endPoints',
      page.assetURL+'/Start_Bubble.png'
    );

    this.addPin(
      data.endPoints.finish.latitude,
      data.endPoints.finish.longitude,
      'B',
      'endPoints',
      page.assetURL+'/Finish_Bubble.png'
    );


    var bounds = new google.maps.LatLngBounds();
  	for(var i=0; i<locations.length; ++i) {
  		bounds.extend(locations[i]);
  	}
  	var argument = {
  		bounds: bounds
  	};
  	this.setView(argument);

    return locations;
  },

  setMapOnAll: function(map, entity) {
  	if(entity === 'all') {
	  	for (var entity in this.entities){
		  	for (var i = 0; i < this.entities[entity].pins.length; i++) {
			    this.entities[entity].pins[i].setMap(map);
			}
		}
	}
	else {
		for (var i = 0; i < this.entities[entity].pins.length; i++) {
		    this.entities[entity].pins[i].setMap(map);
		}
	}
	this.detachDragging();
  },

  tearDown: function(){
    if (!this.bing) return;
    // this.bing.dispose();
    this.setMapOnAll(null, 'all');
    this.loaded = false;
    for (var entity in this.entities){
      this.entities[entity].pins.length = 0;
    }
  }
  
};
});