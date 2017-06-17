/*
 * This logs the arguments for published events
*/
define(['lib/vendor/publisher'], function (publisher){
  return {
    /*
     * if true, it will log, if false, it won't.  Set to false before deploying
    */
    on: false,

    /*
     * Takes a string or array of strings representing published channels to log
    */
    log: function (channel){
      if (!this.on) return;

      if (typeof channel !== 'string'){
        for (var i = 0; i < channel.length; i ++) {
          this.log(channel[i]);
        }
        return;
      }

      publisher.subscribe(channel, function (){
        if (console) console.log(channel, arguments);
      });
    }
  };
});
