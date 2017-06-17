define([
  'lib/vendor/publisher',
  'lib/widget/search'
], function (publisher, search) {

  search['sort/click'] = function (sort) {
    // sorting / filtering, want first page
    this.requestParams.page(0);
    this.fetch({sort: sort});
  };

  search['filter/check'] = function (filter) {
    this.requestParams.page(0);
    this.fetch({ filter: filter.active , filterByAttributeOperationName: filter.filterByAttributeOperationName});
  };

  search['page/tearDown/results'] = function () {
    this.requestParams.filter([]); // clears filters
  };

  search['layout/before/init'] = function (layout) {
    layout.defineFilter('search', jQuery.proxy(this, 'init'));
  };

  search['results/clickPage'] = function (results, $element) {
    this.fetchPageFromElement($element);
  };

  publisher.subscribe([
    'sort/click',
    'filter/check',
    'layout/before/init',
    'results/clickPage',
    'page/tearDown/results'
  ], search);

  return search;

});
