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

//=====================================
// Closure so that variables don't get
// involved with variables in your code
//=====================================
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

			this._setParams(settings);
			this.currentIndex = 0;
			this.direction = 1;

			if(this.params.hasArrows) {
				this.arrows = this.root.find('.arrow');
				this._setArrowEvents();
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
		// Will set the click events on the arrows.
		//=====================================================================
		_setArrowEvents : function() {
			this.arrows.on('click.neutrino', function(e){
				clearTimeout(this.timer);

				this.direction = $(e.target).data('direction');

				this._initSlides(e);
			}.bind(this))
		},

		//=====================================================================
		// _initSlides : Private Function
		//
		// @params : e
		//		If not defined, it means no click event was done to get here
		//		therefore, the direction should be 1, which is equal to right
		//		to left. Please note that not all of the animations will make
		//		use of the direction parameter. i.e. Fade in/out
		//=====================================================================
		_initSlides : function(e){
			if(!e)
				this.direction = 1;

			this.currentSlide = this.slides.eq(this.currentIndex);
			this.nextIndex = this.currentIndex + this.direction;
			
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

			this.slides.hide();
			this.currentSlide.show();

			var animation;

			if(this.params.transitionType == 'slide')
				animation = this._slide();
			else
				alert('Only the SLIDE effect is working right now.');

			animation.done(function(){
				this._setArrowEvents();
				this._setTimer();
			}.bind(this))
		},

		//=====================================================================
		// _slide : Private Function
		//
		// Function to be called when the transitionType property is set to
		// 'slide'. Returns a $.Deferred();
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