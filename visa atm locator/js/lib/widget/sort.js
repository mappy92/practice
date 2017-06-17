define([], function (){
  return {
    defaults: {
      direction: 'asc',
      primary: 'distance',
      distanceType: 'Miles',
      currentClassName: 'visaATMSortCurrent'
    },

    opposites: {
      'asc': 'desc',
      'desc': 'asc'
    },

    init: function (element, selector, att){
      this.$element = jQuery(element);
      this.direction = this.defaults.direction;
      this.$sortElement = this.$element.find('button.' + this.defaults.currentClassName);

    	this.attach();
    },

    initDistance: function (element, selector, att){
			this.$distance_element = jQuery(element);
			this.distanceType = this.defaults.distanceType;

    	this.attachDistance();
    },

		attachDistance: function() {
			this.$distance_element.undelegate('button', 'click').delegate('button', 'click', jQuery.proxy(this.setDistanceType, this));
		},

    attach: function (){
     	this.$element.undelegate('button', 'click').delegate('button', 'click', jQuery.proxy(this.handler, this));
    },

    handler: function (event){
      var $target = jQuery(event.currentTarget),
          sameElement = $target[0] === this.$sortElement[0],
          dontReverse = $target.data('dont-reverse');

      if (sameElement && dontReverse) return;

      this.setElements($target);
      this.setSort();
    },

    setElements: function ($target){
      this.$lastSortElement = this.$sortElement;
      this.$sortElement = $target;
    },

    setSort: function (){
      this.last = this.primary;
      var nameType = this.$sortElement.attr('name');
      this.distanceSort = (nameType == 'Miles' || nameType == "Kilometers");
      this.primary = this.distanceSort ? this.primary : this.$sortElement.attr('name');

      if (!this.distanceSort) {
      	this.direction = this.getDirection();
				this.updateElements();
      }
    },

		changeDistanceType: function() {
			if (this.distanceType == "Miles") {
				jQuery('.visaATMScoreMi').show();
				jQuery('.visaATMScoreKm').hide();
			} else {
				jQuery('.visaATMScoreMi').hide();
				jQuery('.visaATMScoreKm').show();
			}
		},

		setDistanceType: function(event) {
			var $target = jQuery(event.currentTarget);
			this.distanceType = event.currentTarget.name;
				
			// change links…
			if(event.currentTarget.id == "visaATMMiles")
				{
				jQuery("#visaATMKilometers").find('span').removeClass(this.defaults.currentClassName);
				jQuery("#visaATMMiles").find('span').addClass(this.defaults.currentClassName);
				}
			else if (event.currentTarget.id == "visaATMKilometers")
				{
				jQuery("#visaATMMiles").find('span').removeClass(this.defaults.currentClassName);
				jQuery("#visaATMKilometers").find('span').addClass(this.defaults.currentClassName);
				}
			else
				{
			this.$distance_element.find('span').removeClass(this.defaults.currentClassName);
			jQuery(event.currentTarget).find('span').addClass(this.defaults.currentClassName);
				}
			
			this.changeDistanceType();
		},

    updateElements: function (){
			jQuery('.visaATMSort button').removeClass(this.defaults.currentClassName);
      this.$sortElement.addClass(this.defaults.currentClassName);
      this.$element[this.direction === 'desc' ? 'addClass' : 'removeClass']('visaATMSortReverse');
    },

    // Reverses the sort direction if it's a new field to sort on and that field
    // responds to being reversed (isn't in dontReverse)
    getDirection: function (){
      var newPrimary = (this.last !== this.primary),
          useDefault = newPrimary || this.$sortElement.data('dont-reverse');

      return useDefault ? this.defaults.direction : this.opposites[this.direction];
    }
  };
});