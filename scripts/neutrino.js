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

function Neutrino() {
	var neutrino = {
		params : {},

		//=====================================================================
		// init : Public Function
		//
		// @params : settings
		//		Custom settings of the user. May be an empty object.
		//
		// @params : context
		//		If defined, will be the root. This is to be able to have multiple
		//		neutrino slideshow in your page. Though I do not recommend it, it
		//		is possible.
		//
		// This function initialize the slideshow process. Variables are set up 
		// here and the Parameters of the whole slideshow also. After the 
		// setting is done, it starts the timer.
		//=====================================================================
		init : function(settings, context) {
			this.root = context || $('.neutrino');
			this.slides = this.root.find('.slide');
			this.arrows = this.root.find('.arrow');
			this.nav = this.root.find('nav');

			this._setParams(settings);
			this.currentIndex = 0;
			this.direction = 1;

			if(this.params.hasArrows) {
				this._createArrows();
			}

			if(this.params.hasNav) {
				this._createNav();
				this._updateNav();
			}

			this._setTimer();
		},

		//=====================================================================
		// _setParams : Private Function
		//
		// @params : settings
		//		Custom settings of the user. May be an empty object.
		//
		// If settings is defined, it's properties will be used and if not, the
		// default settings will be used instead. Settings might be omitted if
		// you want to use some defaults.
		//=====================================================================
		_setParams : function(settings) {
			this.params = {
				transitionType: settings.transitionType || 'slide',
				transitionTime: settings.transitionTime || '0.75',
				slideWidth: this.slides.eq(0).width(),
				timer: settings.timer || '3500',
				hasArrows: settings.hasArrows || false,
				hasNav: settings.hasNav || true
			};
		},

		//=====================================================================
		// _setArrowEvents : Private Function
		//
		// Will set the click events on the arrows. Direction is set by the
		// data attribute on the tags.
		//=====================================================================
		_setArrowEvents : function() {
			this.arrows.on('click.neutrino', function(e){
				clearTimeout(this.timer);

				this.direction = $(e.target).data('direction');

				this._initSlides(e);
			}.bind(this))
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
			this.navButtons.on('click.neutrino', function(e){
				// If is already active, wait for the timer to change slide
				if($(e.target).hasClass('active')){
					return;
				}
				else {
					clearTimeout(this.timer);

					this.direction = 0;

					this._initSlides(e);
				}
			}.bind(this))
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

			this._changeSlide();
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
			this.arrows.off('.neutrino');
			this.navButtons.off('.neutrino');

			this.slides.hide();
			this.currentSlide.show();

			var animation;

			if(this.params.transitionType == 'slide')
				animation = this._slide();
			else
				alert('Only the SLIDE effect is working right now.');

			animation.done(function(){
				if(this.params.hasNav){
					this._updateNav();
					this._setNavEvents();
				}

				if(this.params.hasArrows)
					this._setArrowEvents();
				
				this._setTimer();
			}.bind(this))
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
				.css({left: (this.params.slideWidth * this.direction)})
				.show();
				
			TweenMax.to(this.currentSlide, this.params.transitionTime, {
				left: "+="+(this.params.slideWidth * (this.direction * -1)),
				
				onComplete:function(){
					firstSlide.resolve();

					this.currentSlide
						.hide()
						.css({left:0});
				}.bind(this)
			});

			TweenMax.to(this.nextSlide, this.params.transitionTime, {
				left: "+="+(this.params.slideWidth * (this.direction * -1)),
				
				onComplete:function(){
					secondSlide.resolve();
				}
			});

			$.when(firstSlide, secondSlide).then(function(){
				this.currentIndex = this.nextIndex;

				animationDeferred.resolve();
			}.bind(this));

			return animationDeferred;
		},

		//=====================================================================
		// _setTimer : Private Function
		//
		// Sets the timeout function to call _initSlides after each tick.
		//=====================================================================
		_setTimer : function(){
			this.timer = setTimeout(function(){
				this._initSlides();
			}.bind(this), this.params.timer);
		}
	}

	return neutrino;
};