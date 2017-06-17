define([
  'lib/util/object',
  'src/page'
], function (object, page){
	  
  var toggles = {

    create: function (selector){
      var instance = object.create(this);
      return instance.init.apply(instance, arguments);
    },

    init: function (selector){
      this.$toggles = jQuery(selector).find('.visaATMToggle');
      this.$toggles.each(jQuery.proxy(this.createToggle, this));
      if (page.templateName == 'about') toggles.initPrivacyJump();
    },
    
   	initPrivacyJump: function() {
   		jQuery('.visaATMPrivacyPolicy_Jump').click(function() {
      	jQuery('.visaATM_PrivacyPolicy').click();
      	return false;
      });
   	},
   	
   	scrollWin: function (iEl){
   		jQuery('html,body').animate({
				scrollTop: iEl.offset().top - 50
				}, 500);
		},
   	
    openAllToggles: function() {
    	$toggler = jQuery('.visaATMToggler');
    	// open toggles if they are closed
    	if ( !$toggler.hasClass('visaATMTogglerToggled') )
    		$toggler.click();
    },
    
    closeAllToggles: function() {
    	$toggler = jQuery('.visaATMToggler');
    	// close toggles if they are open
    	
    	jQuery.each($toggler, function(i, val) {
    	
    		var iElement = jQuery(val);
    		if (iElement.hasClass('visaATMTogglerToggled'))
    			iElement.click();
    	});
  	},
    
    nextState: 'show',
    
    createToggle: function (index, element){
      
      var $element = jQuery(element),
          $toggler = $element.find('.visaATMToggler'),
          $togglee = $element.find('.visaATMTogglee'),
          height = $togglee.outerHeight(),
          animating = false,
          nextState = 'show',
          states = {
            show: { /*height: height */ },
            hide: {display: 'none'/*height: 0 */}
          },
          opposites = {show: 'hide', hide: 'show'};
          
			//initial setup after results are loaded
      $togglee.css(states.hide);
			
      $toggler.bind('click.visaATM', function (){
        if (animating) return;
        animating = true;
        
        toggles.closeAllToggles();

        $toggler.toggleClass('visaATMTogglerToggled');
        
        var toggled = $toggler.hasClass('visaATMTogglerToggled');        
        
        if (toggled)
	        $togglee.slideDown(500, function() {
	        	animating = false;
	        	if (page.templateName !== 'results')
							toggles.scrollWin($toggler);
	        });
				else
					$togglee.slideUp(500, function() {
						animating = false;
					});
        
      });
    }
  };
  
  return toggles;
});
