/*
 * Any pages the controller needs access too must be defined here.
*/
define([
  'src/pages/about',
  'src/pages/faq',
  'src/pages/home',
  'src/pages/goMobile',
  'src/pages/results'
], function (){
  var pages = {};
  for (var i = 0, l = arguments.length; i < l; i++)
    pages[arguments[i].name] = arguments[i];
  return pages;
});
