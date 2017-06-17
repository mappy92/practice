define({
  /*
   * Simplified prototypal inheritance, see http://javascript.crockford.com/prototypal.html
  */
  create: function (obj){
    function F() {}
    F.prototype = obj;
    return new F();
  },

  /*
   * Dynamic property setting
   * for example
   *   var o = {};
   *   object.set(o, 'a.b.c', 'foo');
   *   console.log(o) // {a: {b: { c: 'foo' }}}
  */
  set: function (obj, property, value) {
    var tree = obj,
        split = property.split('.'),
        last = split.pop(),
        next;

    while (next = split.shift()){
      if (typeof tree[next] !== 'object') tree[next] = {};
      tree = tree[next];
    }

    tree[last] = value;
  },

  /*
   * Dynamically delete properties of an object, similar to above
   * deletes the last property in the chain
   * for example:
   *   var o = {a: { b: { c: { d: 'foo' }}}}
   *   object.unset(o, 'a.b.c');
   *   o; // { a: {b: {} }}
  */
  unset: function (obj, property){
    var tree = obj,
        split = property.split('.'),
        last = split.pop();

    while (next = split.shift()) tree = tree[next];

    delete tree[last]
  }
});
