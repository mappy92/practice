define([
  'lib/util/array',
  'src/widget/search'
], function (array, search){
  return {
    init: function (element){
      this.element = jQuery(element);
      this.active = [];
      this.filterByAttributeOperationName = 'and';
      this.attach();
    },

    attach: function (){
      this.element.undelegate('input:checkbox', 'click').delegate('input:checkbox', 'click', jQuery.proxy(this.clickHandler, this));
      this.element.undelegate('input:radio:checked', 'change').delegate('input:radio:checked', 'change', jQuery.proxy(this.changeHandler, this));
    },

    clickHandler: function (event){
      var target = jQuery(event.currentTarget);
      this.check(target);
    },

    changeHandler: function(event) {
      var target = jQuery(event.currentTarget);
      this.check(target);
    },

    check: function (element){
      var name = element.attr('name'),
          isOn = element.prop('checked'),
          inputType = element.attr('type');

      search.searchType = 'Filter';

      if(inputType === 'radio' && name === 'filterAndOr') {
        this.filterByAttributeOperationName = element.val();
      }
          
      else { 
        if (isOn) {
        	// fire Unica Tracking event
  		    // ntptEventTag("ev=filter"+name);
          dataLayer.push({'filter': name});
        }

        array[isOn ? 'include' : 'erase'](this.active, name);
      }
    }
  }
});