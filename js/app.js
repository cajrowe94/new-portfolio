$("#about-link").click(function(){
	$([document.documentElement, document.body]).animate({
		scrollTop: $(".section-about").offset().top
	}, 1000);
});
