// 
// 
// Controllo
// ----------------------------------------------------------------------
	
(function($){	
	var Controllo = function(element, options){
	    var elem = $(element),
	    	obj = this,
			animation = '';
			
		var defaults = {
			animation: 'fade',
			speedIn: '400',
			speedOut: '200',
			controllers: undefined,
			targets: undefined,
			click: true,
			defaultScreen: 'default-screen',
			autoPrep: true
		};
			
		var config = $.extend(defaults, options || {});
		
		var animation = config.animation,
			speedIn = parseInt(config.speedIn),
			speedOut = parseInt(config.speedOut),
			$controllers = config.controllers,
			$targets = config.targets,
			defaultScreen = config.defaultScreen,
			autoPrep = config.autoPrep;	
			
			
		// If autoPrep is off
		if (autoPrep == false) {
			console.log('autoPrep is off');
				
			var placeholderControllee = $(elem).append('<div data-controllo-component="controllee" data-controllo-group="controllo-placeholder" class="active">');
		}
			
		if ($targets == undefined) {
			var $targets = $(elem).find('[data-controllo-component|="controllee"]');
		} else {
			$targets = $targets;
		}
		
		if ($controllers == undefined) {
			var $controllers = $(elem).find('[data-controllo-component|="controller"]');
		} else {
			$controllers = $controllers;
		}
		
		var defaultScreenExists = $targets.filter('[data-controllo-group='+defaultScreen+']').length;
		
		this.prep = function(){
			
			// If autoPrep is on, set first to first set of items
			if (autoPrep == true) {
				var first = $controllers.first().attr('data-controllo-group');
			} 
		
			// If autoPrep is off and a default screen exists, set first screen to the default screen
			if (autoPrep == false && defaultScreenExists !== 0) {
				var first = defaultScreen;
				
				$placeholderControllee.remove();
			}
			
			if (autoPrep == false)
			
			$(elem).find('[data-controllo-group='+first+']').show().addClass('active');
			
		}
		this.animate = function(trigger){
			var $activeComponents = $targets.filter('.active'),
				$incomingComponents = $targets.filter('[data-controllo-group='+trigger+']');
				
			function setAnimation(active, incoming){
				
				if (animation === 'fade'){
					active.fadeOut(speedOut, function() {
						active.removeClass('active');
				    	incoming.fadeIn(speedIn, function() {
				    		incoming.addClass('active');
				    	});
				    });
				} 
				else if (animation === 'slide') {
					active.slideUp(speedOut, function() {
						active.removeClass('active');
				    	incoming.slideDown(speedIn, function() {
				    		incoming.addClass('active');
				    	});
				    });
				} 
				else if (animation === 'none') {
					active.hide(0, function() {
						active.removeClass('active');
				    	incoming.show(0, function() {
				    		incoming.addClass('active');
				    	});
				    });
				} 
				else {
					active.fadeOut(speedOut, function() {
						active.removeClass('active');
				    	incoming.fadeIn(speedIn, function() {
				    		incoming.addClass('active');
				    	});
				    });
				}
			}	
			
			// Run animations!
			setAnimation($activeComponents, $incomingComponents);
			
		}
		this.trigger = function(context){
			var $context = context;
			var $triggerID = $context.attr('data-controllo-group');
			
			obj.animate($triggerID);
		}
		this.setTrigger = function(){	
			if (config.click == true) {
				$controllers.click(function(){
					$activeController = $controllers.filter('.active');
					$incomingController = $(this),
					$context = $(this);
					
					
					if ($(this).hasClass('popper active') == true) {
						$(this).removeClass('active');
					} else {
						obj.trigger($context);
						$activeController.removeClass('active');
						$incomingController.addClass('active');
				
						return false;
					}
					
				});
			}		
		}
		this.reset = function(){
			obj.screenFade(defaultScreen);
		}
		
		// Hide all targets
		$targets.hide();
		
		// Prep
		this.prep();
		
		// Init triggers
		this.setTrigger();
	  };

	  $.fn.controllo = function(options){
	    return this.each(function(){
	      var element = $(this);

	      // Return early if this element already has a plugin instance
	      if (element.data('controllo')) return;

	      // pass options to plugin constructor
	      var controllo = new Controllo(this, options);

	      // Store plugin object in this element's data
	      element.data('controllo', controllo);
	    });
	  };
})(jQuery);