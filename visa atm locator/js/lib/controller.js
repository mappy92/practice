define([
  'js/lib/vendor/jquery.ba-bbq.js', // fixes hashchange for ie 7
  'lib/hash',
  'lib/pages/allPages'
], function (bbq, hash, pages){

  return {
    init: function (defaultRoute){
      this.defaultRoute = defaultRoute;
      this.route();
      
      jQuery(window).bind('hashchange', jQuery.proxy(this.route, this));
    },

    route: function (){
      var route = this.getRoute(),
          nextPage = pages[route.page];

      if (nextPage === this.currentPage) {
        this.currentPage.setParams(route.params);
        return;
      }

      if (this.currentPage) this.currentPage.tearDown();

      nextPage.render(route.params);

      this.lastPage = this.currentPage || nextPage;
      this.currentPage = nextPage;
      this.state = route;

      return this.currentPage;
    },

    getRoute: function (){
      var route = hash.get();
      if (!route) {
        route = this.defaultRoute;
        hash.set(route);
      }
     
     // scroll to top on page change
    	window.scrollTo(0, 1); 
      return route;
    },

    setParam: function (name, value){
      var route = this.getRoute();
      (route.params || (route.params = {}))[name] = value;
      hash.set(route);
      return route;
    }
  };

});
