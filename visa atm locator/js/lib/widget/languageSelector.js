define([
  'lib/hash'
], function (hash){  
  return {
    init: function (selector){
      this.$element = jQuery(selector);
      this.$element.bind('change', jQuery.proxy(this.onChange, this));
      
    },

    onChange: function (){
      var state = hash.get();
      state.language = this.$element.val() || 'english';
      hash.set(state);
      window.location.reload(true);
    }
  }

});