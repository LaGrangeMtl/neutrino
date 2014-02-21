/*The MIT License (MIT)

Copyright (c) 2013 Nicolas Poirier-Barolet

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

;(function($) {
	// Polyfill for IE8
	if (typeof Object.create !== 'function') {
	    Object.create = function (o) {
	        function F() {}
	        F.prototype = o;
	        return new F();
	    };
	}

	var Neutrino = {
		//=====================================================================
		// init : Public Function
		//
		// @params : options
		//		Custom settings of the user. May be an empty object.
		//
		// @params : context
		//		Element that will be defined as the root of the slideshow
		//
		// This function initialize the slideshow process. Variables are set up 
		// here and the Parameters of the whole slideshow also. After the 
		// setting is done, it starts the timer.
		//=====================================================================
		init : function(options, context) {
			this.root = $(context);
			this.slides = this.root.find('.slide');

			if(this.slides.length <= 1){
				console.log("Neutrino : There is only " + this.slides.length + " slides set in the markup. Neutrino needs at least 2 slides to work.");
				return;
			}

			// Default values
			this.options = {
				transitionType: 'slide',
				transitionTime: 0.75,
				slideWidth: this.slides.eq(0).width(),
				timer: 3500,
				hasArrows: false,
				hasNav: false
			};

			this.options = $.extend({},this.options,options);
			
			this._build();

			return this;
		},

		//=====================================================================
		// _build : Private Function
		//
		// Sets various properties to the Neutrino object that will be used
		// later. Creates Navigation and Arrows if needed and starts the slider
		// with a timer or not, depending of the options. 
		//=====================================================================
		_build : function() {
			this.arrows = this.root.find('.arrow');
			this.nav = this.root.find('nav');
			this.navButtons = undefined;
			this.timer = undefined;

			this.currentIndex = 0;
			this.direction = 1;

			if(this.options.hasArrows) {
				this._createArrows();
			}

			if(this.options.hasNav) {
				this._createNav();
				this._updateNav();
			}

			if(this.options.timer > 0 || this.options == undefined) {
				this._initSlides();
				this._setTimer();
			}
			else {
				this.options.timer = false;
				this._initSlides();
			}
		},

		//=====================================================================
		// _setArrowEvents : Private Function
		//
		// Will set the click events on the arrows. Direction is set by the
		// data attribute on the tags.
		//=====================================================================
		_setArrowEvents : function() {
			var _self = this;
			this.arrows.on('click.neutrino', function(e){
				clearTimeout(_self.timer);

				_self.direction = $(e.target).data('direction');

				_self.arrows.off('.neutrino');
				_self._initSlides(e);
				_self._changeSlide();
			})
		},

		//=====================================================================
		// _createArrows : Private Function
		//
		// Creates the arrows for the slideshow. Uses <div> tags, 
		// and sets the direction by using the data attribute.
		//=====================================================================
		_createArrows : function(){
			var arrowsMarkup = '<div class="arrow left" data-direction="-1"></div>';
			arrowsMarkup += '<div class="arrow right" data-direction="1"></div>';

			this.root.append(arrowsMarkup);
			this.arrows = this.root.find('.arrow');

			this._setArrowEvents();
		},

		//=====================================================================
		// _setNavEvents : Private Function
		//
		// Will set the click events on the nav. If you click on an already
		// active slide, the function will return, thus making the whole
		// process wait for another click or the timer to change the slide.
		//=====================================================================
		_setNavEvents : function() {
			var _self = this;
			this.navButtons.on('click.neutrino', function(e){
				// If is already active, wait for the timer to change slide
				if($(e.target).hasClass('active')){
					return;
				}
				else {
					clearTimeout(_self.timer);

					_self.direction = 0;

					_self._initSlides(e);
					_self._changeSlide();
				}
			});
		},

		//=====================================================================
		// _updateNav : Private Function
		//
		// Updates the navButtons style.
		//=====================================================================
		_updateNav : function() {
			this.navButtons.removeClass('active');
			this.navButtons.eq(this.currentIndex).addClass('active');
		},

		//=====================================================================
		// _createNav : Private Function
		//
		// Creates the navigation for the slideshow. Uses <li> tags, 
		// and sets the width of the <ul> for it to be centered.
		//=====================================================================
		_createNav : function(){
			var nbOfSlides = this.slides.length;
			var nav = '<nav><ul>';

			for(var i=0; i < this.slides.length; i++) {
				nav += '<li></li>';
			}

			nav += '</ul></nav>';

			this.root.append(nav);
			this.nav = this.root.find('nav');
			this.navButtons = this.nav.find('li');

			var liWidth = this.navButtons.eq(0).width();
			var liMargin = this.navButtons.eq(1).css('margin-left');
			liMargin = liMargin.substring(0, liMargin.length - 2);

			this.nav.find('ul').css({width: (liWidth * nbOfSlides) + (liMargin * (nbOfSlides - 1)) + "px"})

			this._setNavEvents();
		},

		//=====================================================================
		// _initSlides : Private Function
		//
		// @params : e
		//		If not defined, it means no click event was done to get here
		//		therefore, the direction should be 1, which is equal to right
		//		to left. Please note that not all of the animations will make
		//		use of the direction parameter. i.e. Fade in/out
		//
		//		If e is defined, a click was made. If it was on the nav, the
		//		direction property will be of 0. The nextIndex will then become
		//		the targeted nav button. Otherwise, the direction will be equal
		//		to what the arrow event set it to [see _setArrowEvents()]
		//=====================================================================
		_initSlides : function(e){
			this.currentSlide = this.slides.eq(this.currentIndex);
			this.nextIndex = this.currentIndex + this.direction;

			if(e){
				// If this direction == 0, it means that we clicked on the nav
				// buttons
				if(this.direction == 0) {
					this.nextIndex = this.navButtons.index($(e.target));

					if(this.nextIndex < this.currentIndex)
						this.direction = -1;
					else
						this.direction = 1;
				}
			}
			else {
				this.direction = 1;
			}

			if(this.nextIndex >= this.slides.length)
				this.nextIndex = 0;
			else if (this.nextIndex < 0)
				this.nextIndex = this.slides.length - 1;

			this.nextSlide = this.slides.eq(this.nextIndex);

			this.slides.hide();
			this.currentSlide.show();
		},

		//=====================================================================
		// _changeSlide : Private Function
		//
		// This is where the slides are changed. For the whole process, the 
		// arrows and the nav buttons will be disabled. They will be enabled
		// again after the animations are done. Depending on the transitionType
		// property of the slideshow, it will call the right animation function
		//=====================================================================
		_changeSlide : function(){
			var animation;

			if(this.options.hasNav)
				this.navButtons.off('.neutrino');

			if(this.options.transitionType == 'slide')
				animation = this._slide();
			else
				alert('Only the SLIDE effect is working right now.');

			var _self = this;
			animation.done(function(){
				if(_self.options.hasNav){
					_self._updateNav();
					_self._setNavEvents();
				}

				if(_self.options.hasArrows)
					_self._setArrowEvents();
				
				if(_self.options.timer) {
					_self.direction = 1;
					_self._setTimer();
				}
			})
		},

		//=====================================================================
		// _slide : Private Function
		//
		// @returns : $.Deferred();
		//
		// Function to be called when the transitionType property is set to
		// 'slide'.
		//=====================================================================
		_slide : function(){
			var firstSlide = $.Deferred();
			var secondSlide = $.Deferred();
			var animationDeferred = $.Deferred();

			this.nextSlide
				.css({left: (this.options.slideWidth * this.direction)})
				.show();

			var _self = this;
			TweenMax.to(this.currentSlide, this.options.transitionTime, {
				left: "+="+(this.options.slideWidth * (this.direction * -1)),
				
				onComplete:function(){
					firstSlide.resolve();

					_self.currentSlide
						.hide()
						.css({left:0});
				}
			});

			TweenMax.to(this.nextSlide, this.options.transitionTime, {
				left: 0,
				
				onComplete:function(){
					secondSlide.resolve();
				}
			});

			_self = this;
			$.when(firstSlide, secondSlide).then(function(){
				_self.currentIndex = _self.nextIndex;

				animationDeferred.resolve();
			});

			return animationDeferred;
		},

		//=====================================================================
		// _setTimer : Private Function
		//
		// Sets the timeout function to call _initSlides after each tick.
		//=====================================================================
		_setTimer : function(){
			var _self = this;

			this.timer = setTimeout(function(){
				_self._initSlides();
				_self._changeSlide();
			}, this.options.timer);
		}
	};

	$.fn.neutrino = function(options) {
		if(this.length) {
			return this.each(function(){
				var neutrino = Object.create(Neutrino);
				neutrino.init(options, this);
				$.data(this, 'neutrino', neutrino);
			})
		}
	};
})(jQuery)