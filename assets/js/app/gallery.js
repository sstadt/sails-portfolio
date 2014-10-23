/*jslint browser: true*/

require(['jquery'], function ($) {
  'use strict';

  // grab the stuff we're going to use
  var moon = $('#moon'),
    moonheight = parseInt(moon.css('height'), 10),
    trackheight = Math.floor($(window).height() * 0.9),
    trackspace = trackheight - moonheight,
    initSky = true,
    panSky = function () {
      // adjust the position of the moon and stars
      var s = $(window).scrollTop(),
        d = $(document).height(),
        c = $(window).height(),
        scrollpos = s / (d - c),
        moonpos = trackspace - Math.floor(trackspace * scrollpos);

      if (initSky === true) {
        moon.css('top', moonpos);
        initSky = false;
      } else {
        moon.animate({
          'top': moonpos
        }, {
          queue: false,
          easing: 'linear'
        });
      }
    };

  // -----------------------
  //     SPACE EFFECTS
  // -----------------------

  // if the track height is larger than the moon, set it up for scrolling
  if (trackheight > moonheight) {

    // set the moon position
    panSky();

    // bind event to control background movement
    $(window).scroll(function () {
      // set the background position
      panSky();
    });
  }

  // -----------------------
  //     IMAGE GALLERY
  // -----------------------

});