/*
 * The `page` module is the prototype for all pages.
 * Something is up with publisher.advise where I can't advise `page` w/o
 * breaking all of the pages that inherit from it :(, so it simply publishes
 * here in this file.
*/
define([
  'lib/util/object',
  'lib/vendor/publisher',
  'src/views',
  'lib/util/encoder',
  'lib/hash'
], function (object, publisher, dust, encoder, hash){

  var page = {

    /**
     * Prototype element, need to set somewhere
    */
    $element: null,

    /**
     * Prototype assetURL, need to set somewhere
    */
    assetURL: '/img',

    locals: {},

    /**
     * Creates new instances of a page
    */
    create: function (){
      var o = object.create(this);
      o.init.apply(o, arguments);
      o.setLocals(this.locals);
      return publisher(o);
    },

    /**
     * Sets "instance" variables
    */
    init: function (name){
      this.name = name;
    },

    /**
     * Renders the template and sets the html of the element
    */
    render: function (params){
      var self = this;
      if (this.rendered) return;
      publisher.publish('page/render/before', page);
      if (params) this.setParams(params);
      page.templateName = this.name;
      dust.render(this.name, this.locals, function (err, out){
        self.$element.html(out);
        self.rendered = true;
        self.filter();
        publisher.publish('page/render', page, self);
        publisher.publish('page/render/' + self.name, self);
        page.setPageDefaults(self.name);
      });
    },

    reload: function (){
      this.tearDown();
      this.render();
    },
    
    setPageDefaults: function(iName) {
			
			jQuery('.visaATMGoToMobileLink').click(function() {
				  // fire Unica Tracking event
    			// ntptEventTag("ev=GoToMobile");
			});
			
			jQuery('.visaATMGoMobileLink').click(function() {
				  // fire Unica Tracking event
    			// ntptEventTag("ev=DownloadApp");
			});
			
			var searchInputVal = encoder.htmlDecode(page.locals.searchInputValue);
			
			switch(iName) {
				case "faq":
					jQuery('.visaATMSearch, .visaATMFilters').fadeIn();
					jQuery('.visaATMSearchWrap input').val(searchInputVal);
				break;
				
				case "about":
					var state = hash.get();
					if(state.title == "sms") {
						setTimeout(function(){
							jQuery(".visaATMToggle").eq(2).find('h3').addClass("visaATMTogglerToggled");
							jQuery(".visaATMToggle").eq(2).find('div.visaATMTogglee').show();
						},1000);
					}
					
					if(state.title == "privacy") {
						setTimeout(function(){
							jQuery(".visaATMToggle").eq(1).find('h3').addClass("visaATMTogglerToggled");
							jQuery(".visaATMToggle").eq(1).find('div.visaATMTogglee').show();
						},1000);
					}
					
					if(state.title == "terms") {
						setTimeout(function(){
							jQuery(".visaATMToggle").eq(0).find('h3').addClass("visaATMTogglerToggled");
							jQuery(".visaATMToggle").eq(0).find('div.visaATMTogglee').show();
						},1000);
					}
					
					jQuery('.visaATMSearch, .visaATMFilters').fadeIn();
					jQuery('.visaATMSearchWrap input').val(searchInputVal);
				break;
				
				case "results":
					jQuery('.visaATMSearch, .visaATMFilters').fadeIn();
				break;
				
				case "home":
					jQuery('.visaATMSearchWrap input').val(searchInputVal);
					jQuery('.visaATMSearch').fadeIn();
				break;
				
				default:
				break;
				
			}
			
		},

    /**
     * A place to remove events, stop timers, etc.
    */
    tearDown: function (){
      this.tearDownFilters();
      this.$element.empty();
      this.rendered = false;
      this.publish('tearDown');
      publisher.publish('page/tearDown/' + this.name, this);
    },

    /**
     * Set local variables for use in the view
     * name (string) the name of the local variable
     * value (mixed) the value of the local variable
    */
    setLocal: function (name, value){
      this.locals[name] = value;
    },

    /**
     * Accepts object literal of key value pairs to set multiple at once
     * pairs (object)
    */
    setLocals: function (pairs){
      for (var name in pairs) this.setLocal(name, pairs[name]);
    },

    setParams: function (params){
      this.setLocal('params', params);
      this.params = params;
      this.publish('setParams', params);
    },

    /**
     * Defines a filter for the page.
     * HTML:
     *   <div data-filter="foo"></div>
     *
     * JS:
     *  somePage.defineFilter('foo', {
     *    setup: function (element){ console.log(element) },
     *    tearDown: function (element){ console.log(element) }
     *  });
     *
     * The page will call setup for every filter when rendered
     * and tearDown (optional) when tearDown is called
     *
     * Note: since they are stored as properties of an object
     * they are not executed in any sort of order, if one
     * filter depends on another, you have to manage it
    */
    filters: {},
    defineFilter: function (name, methods){
      if (typeof name === 'object') {
        for (var i in name) this.defineFilter(i, name[i]);
        return;
      }

      if (typeof methods === 'function'){
        this.filters[name] = { setup: methods };
        return;
      }
      this.filters[name] = methods;
      return this;
    },

    filter: function ($element){
      var self = this;
      ($element || this.$element).find('[data-filter]').each(function(index, element){
        var $element = jQuery(element),
            filters = $element.data('filter').split(' ');

        for (var i = 0, l = filters.length, filter; i < l; i++){
          filter = self.filters[filters[i]];
          if (!filter) continue;
          filter.setup.call(self, $element);
          filter.$element = $element; // just realized this could get overwritten
          // the same filter could be applied to multiple elements :( ... 
          // either refactor this, or ensure a 1 to 1 relationship between filters
          // and elements on a page
        }
      });
    },

    tearDownFilters: function (){
      for (var filter in this.filters){
        if (!this.filters[filter].tearDown) continue;
        this.filters[filter].tearDown.call(this, this.filters[filter].$element); // phew, that's ugly
      }
    },

    /**
     * Shortcut to find elements in a template
    */
    find: function (selector){
      return this.$element.find(selector);
    }
  };

  page.defineFilter('cache', function (element) {
    this['$' + element.data('cache')] = element;
  });

  return page;
});