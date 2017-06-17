define(function(){

	var captcha = {

			captchaReload: function(){
				var captchaImageUrl = "/atmlocatortoken/simpleCaptcha.png";
				
				var inputSimpleCaptcha = $("<input>")
				.attr("type","hidden")
				.attr("value","true");
				var imageCaptchaType = $("<input>")
				.attr("type","hidden")
				.attr("value","image")
				.attr("id","captchaType");
				
				var fieldset = $("<fieldset></fieldset>").attr("class","visaATMresponse");
				var inputResponse = $("<input>")
				.attr("class","response")
				.attr("name","answer")
				.attr("height","25")
				.attr("width","335");
				
				var image = $("<img>")
					.attr("id", "captchaImage")
					.attr("src", captchaImageUrl+'?'+new Date().getTime())
					.attr("width", "300")
					.attr("height", "100")
					.attr("alt", "CAPTCHA Challenge");
					$("#captchaInputContainer").empty();
					$("#captchaInputContainer").append(inputSimpleCaptcha);
					$("#captchaInputContainer").append(imageCaptchaType);
					fieldset.append(inputResponse);
					$("#captchaInputContainer").append(fieldset);
					$("#captchaContainer").empty().append(image);	

				$("#captchaAnswer").val("");
			},

			showImageCaptcha: function(){
				var focusOnReloadImage = false;

				if($("#reCaptcha").data("audio") == true) {
					focusOnReloadImage = true;
				}

				$("#reCaptcha").data("audio", false);

				this.captchaReload();

				$("#captchaControls").empty();

				$("<a/>")
				.on("click",function(){	captcha.captchaReload();})
				.attr("class", "captcha_reload")
				.text("reload image")
				.appendTo("#captchaControls")
				.wrap("<div class='control'/>");

				if(focusOnReloadImage) {
					$("#reloadImage").focus();
				}
			}
	}
	return captcha;		
});