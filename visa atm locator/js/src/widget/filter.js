define([
  'lib/vendor/publisher',
  'lib/widget/filter'
], function (publisher, filter){

  publisher.advise(filter).after('check', 'filter/check');

  publisher.subscribe('page/tearDown/results', function () {
    this.active.length = 0;
  }, filter);

  publisher.subscribe('updateBankNameList', function() {
  	//clear bankNames in the filter.active
  	for(var i=0; i<this.active.length; ++i) {
  		var item = this.active[i];
  		if (item !== "AIRPORT_CD" && item !== "OPER_HRS" && item !== "WHEELCHAIR" 
        && item !== "BRAILLE_AUDIO" && item !== "ACCEPTS_PLUS_SHARED_DEPOSIT" && item !== "BALANCE_INQUIRY" 
        && item !== "PIN_CHANGE" && item !== "PLUS_ALLIANCE_NO_SURCHARGE_FEE" && item !== "V_PAY_CAPABLE" 
        && item !== "READY_LINK" && item!== "CHIP_CAPABLE"
        && item !== "ACPT_INTL_CRD_IND" && item !== "NO_ATM_ACCS_FEE_IND") {
  			//it's bankName
  			this.active.splice(i,1);
  			i--;
  		}
  	}
  }, filter);

  return filter;
});