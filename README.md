Neutrino
========
#####-  Neutrino currently requires jQuery 1.8.0+ and TweenMax (GSAP)
#####-  You must use jQuery < 2.0 if you want to support IE8 and older browsers.

Neutrino is a Slideshow "plugin" that requires, little to no knowledge in JavaScript and minimum markup.

Since I got out of school, I've wondered which slideshow plugin would best fit my needs and those of the company I work at. I've been wandering around some and always found that I'd need to tweak this or that or that it would require too much and/or very bizarre and non-semantic markup.

I then decided to make my own.

The goals of Neutrino
-----------------------------
#####-  Be flexible : 
> I want Neutrino to be able to integrate not only images as slides, but videos and content as well.

#####-  Require less, but more significant markup and CSS Classes : 
> Neutrino will make use semantic markup for its HTML5 version. It will also use classes that make sense and
 do not require 1 trillion characters length selectors such as "neutrino-base-container-lorem-ipsum-this-is-long-for-nothing"      

#####-  Be usable by people with little to no knowledge in JavaScript : 
> This means that every single setting will be changeable through a simple object. Therefore, Neutrino will look for 
 settings defined by the user. If it does not find any, it will use the default settings. I do not want the markup to 
 become messy, and therefore encourage you to learn a bit of JavaScript, to make it easier to learn and make Neutrino 
 work in the most efficient way for your project.
 
#####-  Be usable with and without jQuery, and also as an AMD module : 
> To speed up development, I will be starting Neutrino with jQuery, and later on make a version of it that is not
 dependant of jQuery. As time goes by, I will make it into an AMD module for it to be used with require.js
 
 
Patch notes
-----------------------------

#####-  0.3.1 : 
> - Updated README.md and reorganised the folders so that the demo is separated from the Neutrino folders

#####-  0.3.0 : 
> - Navigation is working.

#####-  0.2.0 : 
> - Arrows on each side are working.

#####-  0.1.0 : 
> - First working version. Only working with the slide animation right now.

#####-  0.0.2 : 
> - Updated README.md

#####-  0.0.1 : 
> - Started the project, and it feels awesome.