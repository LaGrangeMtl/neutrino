Neutrino
========
Neutrino is a flexible jQuery based slideshow plugin that requires minimum markup.


Dependencies
------------
- [jQuery](http://jquery.com) {Use jQuery < 2.0 if you want to support IE8}
- [TweenMax](http://www.greensock.com/gsap-js/)


Basic usage
-----------

First, be sure to include all the above libraries. Then, include Neutrino :
````html
<script src="js/neutrino.jquery.js" type="text/javascript"></script>
````

To set up Neutrino, simply add a div tag with the class "neutrino" and then add as many slides as you want by
adding div tags with the class "slide". You need to have at least to slides for Neutrino to work because it 
would be quite silly to make a slideshow with only one slide, wouldn't it?
````html
<div id="neutrino">
	<div class="slide"></div>
	<div class="slide"></div>
</div>
````

Using jQuery, setup Neutrino on the selected element :
````js
$(".neutrino").neutrino();
````

You can customize WhatsNearby using an settings argument (more details on all settings will follow):
````js
$(".neutrino").neutrino({ zoom:14, address:"Montréal, Qc" });
````

Options
-------
````js
settings: {
	transitionType: 'slide', // A string representing the type of transition, currently, only 'slide' is supported.
	transitionTime: 0.75, // The time in SECONDS that the animation between each slides will take.
	timer: 3500, // The time in MILLISECONDS between each animations. 3500 is default. If set to 0, there will not be a timed loop.
	hasArrows: false, // False is default. If set to true, Neutrino will add arrows on each sides of the slideshow.
	hasNav: false // False is default. If set to true, Neutrino will add a navigation (button styled list) at the bottom of the slideshow.
}
````