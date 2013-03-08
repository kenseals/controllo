// 
// 
// Controllo
// ----------------------------------------------------------------------
	
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
			
	if ($targets == undefined) {
		var $targets = $(elem).find('[data-component|="target"]');
	} else {
		$targets = $targets;
	}
		
	if ($controllers == undefined) {
		var $controllers = $(elem).find('[data-component|="controller"]');
	} else {
		$controllers = $controllers;
	}
		
	var defaultScreenExists = $targets.filter('[data-hub='+defaultScreen+']').length;
		
	this.defaultScreenPrep = function(){
		console.log('there is a default screen set!');
		$(elem).find('[data-hub='+defaultScreen+']').show().addClass('active');
	}
		
	this.screenPrep = function(){
		var first = $controllers.first().attr('data-hub');
			
		$(elem).find('[data-hub='+first+']').show().addClass('active');
	}
	this.screenFade = function(trigger){
		var $activeComponents = $targets.filter('.active'),
			$incomingComponents = $targets.filter('[data-hub='+trigger+']');
				
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
			
		// If auto prep is turned off and there is no default screen present, set an active class so animations will run
		if (autoPrep == false && defaultScreenExists == 0) {
			var first = $controllers.first().attr('data-hub');
			
			$(elem).find('[data-hub='+first+']').show().addClass('active');
		}
			
		// Run animations!
		setAnimation($activeComponents, $incomingComponents);
			
	}
	this.trigger = function(context){
		var $context = context;
		var $triggerID = $context.attr('data-hub');
			
		obj.screenFade($triggerID);
	}
	this.screenTrigger = function(){	
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
		
	// If autoPrep is on, show default screen
	if (autoPrep == true) {
		this.screenPrep();
	} 
		
	// If autoPrep is off and a default screen exists, show default screen
	if (autoPrep == false && defaultScreenExists !== 0) {
		this.defaultScreenPrep();
	}
		
	// Init triggers
	this.screenTrigger();
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