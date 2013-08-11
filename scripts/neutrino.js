//=====================================
// Closure so that variables don't get
// involved with variables in your code
//=====================================
function Neutrino() {
	var neutrino = {
		params : {},

		init : function(settings) {
			this.root = $('.neutrino');
			this.slides = this.root.find('.slide');

			this._setParams(settings);
			this.currentIndex = 0;

			this._initSlide();
		},

		_setParams : function(settings) {
			this.params = {
				width: settings.width || this.root.width(),
				height: settings.height || this.root.height(),
				transitionType: settings.transitionType || 'slide',
				transitionTime: settings.transitionTime || '0.75',
				slideWidth: settings.slideWidth || this.slides.eq(0).width(),
				timer: settings.timer || '3500',
				hasArrows: settings.hasArrows || false,
				hasNav: settings.hasNav || true
			}
		},

		_initSlide : function(){
			
		}
	}

	return neutrino;
};