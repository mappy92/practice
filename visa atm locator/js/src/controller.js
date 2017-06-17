define(['lib/vendor/publisher', 'lib/controller'], function (publisher, controller){

  publisher.advise(controller).after('route', 'controller/route');  

  controller['layout/render'] = function (layout){
    this.init({page: 'home'});
  };

  publisher.subscribe('layout/render', controller);

  return controller;

});
