define([
  'lib/vendor/publisher',
  'lib/pages/layout'
], function (publisher, layout){

  // Publisher these methods
  publisher.advise(layout)
    .after('render', 'layout/render')
    .before('init', 'layout/before/init');

  // Subscribe to these channels
  layout['ready'] = function (){
    layout.init('#visaATMTarget');
  };

  layout['controller/route'] = function (controller){
    var name = controller.currentPage.name,
        lastName = controller.lastPage.name;
    this.$element.removeClass('visaATMPage-' + lastName).addClass('visaATMPage-' + name);
  };
    
  layout['search/fetch'] = function (){
    this.$element.addClass('visaATMSearchFetching');
  };

  layout['search/fetchComplete'] = function (){
    this.$element.removeClass('visaATMSearchFetching');
  };

  layout['page/render/before'] = function (page){
    layout.$element.addClass('visaATMBeforeRender');
  };

  layout['page/render'] = function (){
    setTimeout(function (){
      layout.$element.removeClass('visaATMBeforeRender');
    }, 200);
  };

  // subscriptions / advice
  publisher.subscribe([
    'ready',
    'controller/route',
    'search/fetch',
    'search/fetchComplete',
    'page/render/before',
    'page/render'
  ], layout);

  return layout;

});
