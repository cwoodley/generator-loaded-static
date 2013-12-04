(function($){
	
	$(document).ready(function(){
			
		// open external link in new tab/window
		// use rel="external" instead of target="_blank"
		$('a[rel="external"]').click( function() {
		  this.target = "_blank";
		});

	});

})(window.jQuery);