define([
  'lib/vendor/publisher',
  'lib/page',
  'lib/hash',
  'lib/remote/language',
  'src/views',
  'lib/widget/dropdown'
], function (publisher, page, hash, language, views, dropdown){

  var layout = {

    filters: {},

    init: function (selector, copy){
      var self = this;

      this.$element = jQuery(selector);    
      this.locals = language.data;
      
      this.locals.assetURL = this.$element.data('asseturl');
    
      this.locals[language.language + 'Language'] = 'selected'; // todo: this is a ghetto way of setting the right language as "selected"
      page.setLocals(this.locals); // give all pages the language file too
      this.render();
      
    },

    render: function (){
      var self = this;
      var date = new Date();
      var currentYear = date.getFullYear();
      this.locals.footerCopyright = this.locals.footerCopyrightLeft + currentYear + this.locals.footerCopyrightRight; 
      
      views.render('layout', this.locals, function (err, out){
    	self.$element.html(out);
        self.filter();
        // set props for all pages to use
        page.$element = jQuery('#visaATMContent');
        page.assetURL = self.locals.assetURL;
      });
      // For custom dropdown
      var dropdownElement = jQuery(".visaATMHeaderActions");
      dropdown.customDropdown(dropdownElement,this.locals.language);
   
    },
 
    // borrow some stuff from page
    defineFilter: function (){
      return page.defineFilter.apply(this, arguments);
    },

    filter: function (){
      page.filter.apply(this, arguments);
    }
  };

  return layout;

});
