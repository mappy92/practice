define(['lib/vendor/publisher','lib/remote/language'], function(publisher, language) {
	var config = {};
	
	jQuery.extend(config,  {

		// Get token
		// hostname: window.location.protocol + "//" + window.location.host,
		// ip6v: '', // TODO GREG - do we need this anymore? // 3ffe:1900:4545:3:200:f8ff:fe21:67cf
		// userAgent: window.visa.clientUserAgent,
	  // Bing Maps credentials.
	  // Should be changed to VISA Staging/Production credentials at first opportunity.
	  // credentials: 'AiQaVI10XPeFru4S1BtvkuUGVz-BGFkJQT8CC48Um6qCRG72XhUxOfwP-FYiKvrs',
	  culture: 'en-US', // We could try and get this from the client's HTTP call to us. navigator.userLanguage or navigator.language
	   
	  // SpatialPoint VISA ATM Locator API entry-point.
	  // apiUrl: 'https://atmlocator.visa.com/LocatorService.asmx', // production
//	  apiUrl: 'https://atmlocator.dev.visa.com/LocatorService.asmx', // developer
//        apiUrl: 'http://staging2.visa.spatialpoint.com/LocatorAPI/LocatorService.asmx', // staging
//          apiUrl: 'https://staging-visa.spatialpoint.com/LocatorAPI/LocatorService.asmx', // another https staging server instance 	  
		
		// apiUrl: 'http://staging.tacpoint.net/atmlocator_services/rest/', //tacpoint staging
		// apiUrl: 'http://projects.visa.stage.qts.visa.com/atmlocator_services/rest/', //visa staging
		apiUrl: 'http://www.visa.com/atmlocator_services/rest/', //visa prod


	  // SMS API URL
	  // smsUrl: 'http://atmlocator.messaging.visa.com/MessageService.asmx', // production
//	  smsUrl: 'https://atmlocator.messaging.dev.visa.com/MessageService.asmx', // developer 
//	  smsUrl: 'http://staging2.visa.spatialpoint.com/SMSAPI/MessageService.asmx', //  staging
//	  smsUrl: 'https://staging-visa.spatialpoint.com/SMSAPI/MessageService.asmx', //  another https staging server URL
	  
		// url prefix for bitly long url
		// smsBitly: window.location.protocol + "//" + window.location.host+'/atmlocator/mobile/index.jsp', // production
//  smsBitly: window.location.protocol + "//" + window.location.host+'/mobile/index.jsp', // develop/staging setting		
	  
	  // # of result items per "page".
	  countPerPage: 10, // if this changes, then the pages don't work correctly.  They start at multiple's of 10
	  // Total # of results items to show.
	  totalCount: 100, // I only set it this high to test for speed.
	  totalPages: 10,
	  
	  // tokenTimeout: 120000, // get new token every 14 minutesâ€¦ expires every 20 at SpatialPoint (maybe lessâ€¦)
	  // tokenReset: false, // set default
	  
	 //  bitlyLogin: 'clockfour',
		// bitlyAPIKey: 'R_88a4b25b90ed5606ffdad48676070807'
  
	});
	
	// parse Accept-Language Header - doesn't work quite right...
	config.parseLanguage = function(iLangHeader) {
		var regex = /([a-z]{1,8}(-[a-z]{1,8})?)\s*(;\s*q\s*=\s*(1|0\.[0-9]+))?/ig;
		
		var acceptLanguage = config.match_all(regex, iLangHeader);
		var browserLanguages = { "af":"Afrikaans","ar":"Aragonese","ar-ae":"Arabic (U.A.E.)","ar-bh":"Arabic (Bahrain)","ar-dz":"Arabic (Algeria)","ar-eg":"Arabic (Egypt)","ar-iq":"Arabic (Iraq)","ar-jo":"Arabic (Jordan)","ar-kw":"Arabic (Kuwait)","ar-lb":"Arabic (Lebanon)","ar-ly":"Arabic (Libya)","ar-ma":"Arabic (Morocco)","ar-om":"Arabic (Oman)","ar-qa":"Arabic (Qatar)","ar-sa":"Arabic (Saudi Arabia)","ar-sy":"Arabic (Syria)","ar-tn":"Arabic (Tunisia)","ar-ye":"Arabic (Yemen)","as":"Assamese","ast":"Asturian","az":"Azerbaijani","be":"Belarusian","bg":"Bulgarian","bn":"Bengali","br":"Breton","bs":"Bosnian","ca":"Catalan","ce":"Chechen","ch":"Chamorro","co":"Corsican","cr":"Cree","cs":"Czech","cv":"Chuvash","cy":"Welsh","da":"Danish","de":"German (Standard)","de-at":"German (Austria)","de-ch":"German (Switzerland)","de-de":"German (Germany)","de-li":"German (Liechtenstein)","de-lu":"German (Luxembourg)","el":"Greek","en":"English","en-au":"English (Australia)","en-bz":"English (Belize)","en-ca":"English (Canada)","en-gb":"English (United Kingdom)","en-ie":"English (Ireland)","en-jm":"English (Jamaica)","en-nz":"English (New Zealand)","en-ph":"English (Philippines)","en-tt":"English (Trinidad & Tobago)","en-us":"English (United States)","en-za":"English (South Africa)","en-zw":"English (Zimbabwe)","eo":"Esperanto","es":"Spanish","es-ar":"Spanish (Argentina)","es-bo":"Spanish (Bolivia)","es-cl":"Spanish (Chile)","es-co":"Spanish (Colombia)","es-cr":"Spanish (Costa Rica)","es-do":"Spanish (Dominican Republic)","es-ec":"Spanish (Ecuador)","es-es":"Spanish (Spain)","es-gt":"Spanish (Guatemala)","es-hn":"Spanish (Honduras)","es-mx":"Spanish (Mexico)","es-ni":"Spanish (Nicaragua)","es-pa":"Spanish (Panama)","es-pe":"Spanish (Peru)","es-pr":"Spanish (Puerto Rico)","es-py":"Spanish (Paraguay)","es-sv":"Spanish (El Salvador)","es-uy":"Spanish (Uruguay)","es-ve":"Spanish (Venezuela)","et":"Estonian","eu":"Basque","fa":"Persian","fa-ir":"Persian/Iran","fi":"Finnish","fj":"Fijian","fo":"Faeroese","fr":"French (Standard)","fr-be":"French (Belgium)","fr-ca":"French (Canada)","fr-ch":"French (Switzerland)","fr-fr":"French (France)","fr-lu":"French (Luxembourg)","fr-mc":"French (Monaco)","fur":"Friulian","fy":"Frisian","ga":"Irish","gd":"Gaelic (Scots)","gd-ie":"Gaelic (Irish)","gl":"Galacian","gu":"Gujurati","he":"Hebrew","hi":"Hindi","hr":"Croatian","hsb":"Upper Sorbian","ht":"Haitian","hu":"Hungarian","hy":"Armenian","id":"Indonesian","is":"Icelandic","it":"Italian (Standard)","it-ch":"Italian (Switzerland)","iu":"Inuktitut","ja":"Japanese","ji":"Yiddish","ka":"Georgian","kk":"Kazakh","km":"Khmer","kn":"Kannada","ko":"Korean","ko-kp":"Korean (North Korea)","ko-kr":"Korean (South Korea)","ks":"Kashmiri","ky":"Kirghiz","la":"Latin","lb":"Luxembourgish","lt":"Lithuanian","lv":"Latvian","mi":"Maori","mk":"FYRO Macedonian","ml":"Malayalam","mo":"Moldavian","mr":"Marathi","ms":"Malay","mt":"Maltese","my":"Burmese","nb":"Norwegian (Bokmal)","ne":"Nepali","ng":"Ndonga","nl":"Dutch (Standard)","nl-be":"Dutch (Belgian)","nn":"Norwegian (Nynorsk)","no":"Norwegian","nv":"Navajo","oc":"Occitan","om":"Oromo","or":"Oriya","pa":"Punjabi","pa-in":"Punjabi (India)","pa-pk":"Punjabi (Pakistan)","pl":"Polish","pt":"Portuguese","pt-br":"Portuguese (Brazil)","qu":"Quechua","rm":"Rhaeto-Romanic","ro":"Romanian","ro-mo":"Romanian (Moldavia)","ru":"Russian","ru-mo":"Russian (Moldavia)","sa":"Sanskrit","sb":"Sorbian","sc":"Sardinian","sd":"Sindhi","sg":"Sango","si":"Singhalese","sk":"Slovak","sl":"Slovenian","so":"Somani","sq":"Albanian","sr":"Serbian","sv":"Swedish","sv-fi":"Swedish (Finland)","sv-sv":"Swedish (Sweden)","sw":"Swahili","sx":"Sutu","sz":"Sami (Lappish)","ta":"Tamil","te":"Teluga","th":"Thai","tig":"Tigre","tk":"Turkmen","tlh":"Klingon","tn":"Tswana","tr":"Turkish","ts":"Tsonga","tt":"Tatar","uk":"Ukrainian","ur":"Urdu","ve":"Venda","vi":"Vietnamese","vo":"Volapuk","wa":"Walloon","xh":"Xhosa","zh":"Chinese","zh-cn":"Chinese (PRC)","zh-hk":"Chinese (Hong Kong)","zh-sg":"Chinese (Singapore)","zh-tw":"Chinese (Taiwan)","zu":"Zulu" };

		for (var i in acceptLanguage) { // works for first valueâ€¦ need to make work for any number of possibilities
			try {
				return browserLanguages[acceptLanguage[i].lang];
    	} catch(e){
      	alert(e);
      	return 'English';
    	}
			
		}

	};

	
	// returns an array of language arrays like (language: en-us, ver: 0.8)
	config.match_all = function(regex, haystack) {
	
		var iMatch = haystack.match(regex);
		
		matched = new Array();
		
		for (var i in iMatch) {
			if (typeof iMatch[i] == 'string') {
				var lang = iMatch[i].split(';');
				matched[i] = new Array();
				matched[i]['lang'] = lang[0];
				matched[i]['ver'] = lang[1] ? lang[1].replace('q=', '') : '1';
			}
			
		}
		return matched;
	};
	
	// config.setTokenURL = function() {	
		
	// 	if (window.location.host == 'clockfourdev.atmlocator') // needs to run on this virtual host for local testing purposes to hit token validator correctly...
	// 		config.tokenUrl = config.hostname+'/atmlocatortoken/atmlocatortoken?site='+escape(config.hostname)+'&ip4v='+config.clientIP+'&ip6v='+config.ip6v+'&userAgent='+escape(config.userAgent); 
	// 	else
	// 		config.tokenUrl = config.hostname+'/atmlocatortoken/atmlocatortoken?site='+escape(config.hostname)+'&ip4v='+config.clientIP+'&ip6v='+config.ip6v+'&userAgent='+escape(config.userAgent);

 //                //alert("Token URL: "+config.tokenUrl);
	
	// 	config.getToken();
	// },
	
	// config.setHeaders = function() {

	// 		//config.clientIP = (window.visa.clientIP != 'null' && window.visa.clientIP != 'undefined') ? window.visa.clientIP : '182.72.210.110';
	// 		//config.clientIP = (window.visa.clientIP != 'null' && window.visa.clientIP != 'undefined') ? window.visa.clientIP : '67.188.200.175';
 //                        if (window.visa.clientIP != 'null' && window.visa.clientIP != 'undefined') {
 //                           config.clientIP = window.visa.clientIP;
 //                          // alert("Using referral IP : "+config.clientIP);
 //                        }
 //                        else { 
 //                           alert("Using hard coded IP : "+config.clientIP);
 //                           config.clientIP = '67.188.200.175';
 //                        }

	// 		//config.clientIP = (window.visa.clientIP != 'null' && window.visa.clientIP != 'undefined') ? window.visa.clientIP : '216.75.239.34';
	// 		//config.clientIP = (window.visa.clientIP != 'null' && window.visa.clientIP != 'undefined') ? window.visa.clientIP : '67.164.196.67';
	// 		//config.clientLanguage = 'English'; // need to parse this better before using.
	// 		config.clientGeo = window.visa.clientGeo != 'null' ? window.visa.clientGeo : 'georegion=286,country_code=US,region_code=UT,city=SANDY,dma=770,msa=7160,areacode=801,county=SALTLAKE,fips=49035,lat=40.5769,long=-111.8884,timezone=MST,zip=84070+84090-84094,continent=NA,throughput=vhigh,bw=2000,asnum=32808,location_id=0';
			
	// 		// config.setTokenURL(); //we dont need token anymore
	// };

	

	// set Header vars and getToken
	// config.setVars = function() {
	// 	config.setHeaders();
	// };
	
	// config.getToken = function(iExpired) {
	// 		// set iExpired default
	// 		iExpired = typeof iExpired !== 'undefined' ? iExpired : false;
	
	// 		jQuery.ajax({
	// 		url: config.tokenUrl,
	// 		cache: false,
	// 		dataType: "text",
 //      success: function(data, textStatus, XMLHttpRequest){
 //      	config.token = data;
 //      	if (iExpired == true) {
 //      		publisher.publish('newToken', data);
	// 			}
 //      	setTimeout(function() {
	// 				config.getToken();
	// 			}, config.tokenTimeout); //get new token before expiration happens
			
	// 		},
 //      error: function(data, textStatus, errorThrown) {
        	        	
 //      	if (data.status == 200 && data.statusText == 'OK') {
 //      		// sometimes the token gets through and still passes an ajax error, soâ€¦ set it anyway and move on.
 //      		config.token = data.responseText;
 //      		if (iExpired == true) {
 //      			publisher.publish('newToken', data);
	// 				}
 //      		setTimeout(function() {
	// 					config.getToken();
	// 				}, config.tokenTimeout); //get new token and set new Timeout (recursively) before expiration happens
 //      		return;
 //      	}
 //      	if (data.status == 0 || data.status == 12029 || data.status == 12007) {
 //      		// Network connectivity issue
 //      		alert(language.data.networkConnectionError); // TODO
 //      	}

 //      	else if (data.status !== 200 || data.statusText !== 'parsererror') {
 //      		// error logging, need language file here for alert...
 //      		alert(language.data.atmServiceError); // TODO
 //      	}
      
 //      }
     
 //     });
	// }
	
	// set token and headers
	// config.setVars();
	
	// console.log('config', config);
	return config;
}
);