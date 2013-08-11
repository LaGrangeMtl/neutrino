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
		// This function initialize the slideshow process. Variables are set up 
		// here and the Parameters of the whole slideshow also. After the 
		// setting is done, it starts the slideshow.
		//=====================================================================
		init : function(settings) {
			this.root = $('.neutrino');
			this.slides = this.root.find('.slide');

			this._setParams(settings);
			this.currentIndex = 0;
			this.direction = 1;

			this._initSlides();
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
				slideWidth: settings.slideWidth || this.slides.eq(0).width(),
				timer: settings.timer || '3500',
				hasArrows: settings.hasArrows || false,
				hasNav: settings.hasNav || true
			};
		},

		//=====================================================================
		// _initSlides : Private Function
		//=====================================================================
		_initSlides : function(){
			this.currentSlide = this.slides.eq(this.currentIndex);
			this.nextIndex = this.currentIndex + this.direction;
			
			if(this.nextIndex >= this.slides.length)
				this.nextIndex = 0;
			else if (this.nextIndex < 0)
				this.nextIndex = this.slides.length - 1;

			this.nextSlide = this.slides.eq(this.nextIndex);

			this._animateSlides();
		},

		//=====================================================================
		// _animateSlides : Private Function
		//=====================================================================
		_animateSlides : function(){
			this.slides.hide();
			this.currentSlide.show();

			var animation;

			if(this.params.transitionType == 'slide')
				animation = this._slide();
			else
				alert('Only the SLIDE effect is working right now.');

			animation.done(function(){
				this._setTimer();
			}.bind(this))
		},

		//=====================================================================
		// _slide : Private Function
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
		//=====================================================================
		_setTimer : function(){
			this.timer = setTimeout(function(){
				this._initSlides();
			}.bind(this), this.params.timer);
		}
	}

	return neutrino;
};