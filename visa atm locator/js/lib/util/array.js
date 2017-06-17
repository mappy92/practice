define({
  erase: function (arr, item){
    for (var i = arr.length; i--;){
      if (arr[i] === item) arr.splice(i, 1);
    }
  },

  indexOf: function (arr, item, from){
    var len = arr.length;
    for (var i = (from < 0) ? Math.max(0, len + from) : from || 0; i < len; i++){
      if (arr[i] === item) return i;
    }
    return -1;
  },

  contains: function(arr, item, from){
    return this.indexOf(arr, item, from) != -1;
  },

  include: function(arr, item){
    if (!this.contains(arr, item)) arr.push(item);
  },

  map: function(arr, fn, bind){
    var results = [];
    for (var i = 0, l = arr.length; i < l; i++){
      if (i in arr) results[i] = fn.call(bind, arr[i], i, arr);
    }
    return results;
  }
});