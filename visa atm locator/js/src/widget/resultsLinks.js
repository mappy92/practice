define([
  'lib/vendor/publisher',
  'lib/widget/resultsLinks'
], function (publisher, resultsLinks){
  
  publisher.advise(resultsLinks).after({
    'handler': 'resultsLinks/click',
    'mouseenter': 'resultsLinks/mouseenter',
    'mouseleave': 'resultsLinks/mouseleave'
  });

  return resultsLinks;
});
