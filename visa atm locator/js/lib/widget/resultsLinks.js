define(['lib/widget/toggles'], function (toggles){

  jQuery.fn.getCoordinates = function (){
    var $element = jQuery(this[0]);
    return {
      Latitude: $element.data('latitude'), // capital L for spatial points horrible names
      Longitude: $element.data('longitude')
    };
  };

  return {
    init: function(element){
      this.$element = jQuery(element);
      this.attach();
      this.searchResultsHint();
      toggles.closeAllToggles();
    },

    attach: function(){
      this.$element.undelegate('.visaATMDirectionsSignIcon', 'click').delegate('.visaATMDirectionsSignIcon', 'click', jQuery.proxy(this, 'handler')); // to remove notMappable locations add this to selector: :not(.noClick)
      this.$element.undelegate('.visaATMResultListItem', 'mouseenter').delegate('.visaATMResultListItem', 'mouseenter', jQuery.proxy(this, 'mouseenter'));
      this.$element.undelegate('.visaATMResultListItem', 'mouseleave').delegate('.visaATMResultListItem', 'mouseleave', jQuery.proxy(this, 'mouseleave'));
      
    },
    
    searchResultsHint: function(){
  	  jQuery(".visaATMShowSearchResultsHintButton").click(function(){
  	  jQuery(".visaATMShowSearchResultsHintDiv").show();
  	  });
  	  jQuery(".visaATMShowSearchResultsHintDivCloseButton").click(function(){
  		  jQuery(".visaATMShowSearchResultsHintDiv").hide();
  	  });
  	  jQuery(".visaATMShowFaqResultsLink").click(function(){
  		  jQuery(".visaATMShowSearchResultsHintDiv").hide();
  		  setTimeout(function(){
  		  jQuery(".visaATMToggle h3").eq(1).addClass("visaATMTogglerToggled");
  		  jQuery(".visaATMToggle div").eq(1).show();
  		  },500);
  		  
  	  });
    },

    handler: function(event){
    	toggles.closeAllToggles(); // close toggle when directions link is clicked on if open	
    	return jQuery(event.currentTarget);
    },

    mouseenter: function(event) {
      return jQuery(event.currentTarget);
    },

    mouseleave: function(event) {
      return jQuery(event.currentTarget);
    }
  };
});