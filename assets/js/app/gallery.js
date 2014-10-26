/*jslint browser: true*/
/*globals alert, io*/

require(['jquery', 'lodash', 'knockout', 'Image'], function ($, _, ko, Image) {
  'use strict';

  // grab the stuff we're going to use
  var moon = $('#moon'),
    moonheight = parseInt(moon.css('height'), 10),
    trackheight = Math.floor($(window).height() * 0.9),
    trackspace = trackheight - moonheight,
    initSky = true,
    setupTrack = function () {
      trackheight = Math.floor($(window).height() * 0.9);
    },
    panSky = function () {
      // if the track height is larger than the moon, set it up for scrolling
      if (trackheight > moonheight) {
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
      }
    };

  // -----------------------
  //     SPACE EFFECTS
  // -----------------------

  // set the moon position
  panSky();

  // bind event to control background movement
  $(window).scroll(function () {
    // set the background position
    panSky();
  });

  $(window).resize(function () {
    setupTrack();
  });


  // -----------------------
  //     IMAGE GALLERY
  // -----------------------

  function GalleryViewModel() {
    var self = this;

    self.images = ko.observableArray([]);
    self.activeImage = ko.observable();

    self.nextImage = function () {
      var currImage = _.findIndex(self.images(), function (img) {
        return img.link === self.activeImage();
      });

      currImage++;

      if (currImage > self.images().length - 1) {
        currImage = 0;
      }

      self.activeImage(self.images()[currImage].link);
    };

    self.prevImage = function () {
      var currImage = _.findIndex(self.images(), function (img) {
        return img.link === self.activeImage();
      });

      currImage--;

      if (currImage < 0) {
        currImage = self.images().length - 1;
      }

      self.activeImage(self.images()[currImage].link);
    };

    self.openGallery = function (image) {
      self.activeImage(image.link);
    };

    io.socket.get('/gallery/show', function (response) {
      if (response.success) {
        self.images(response.images.map(function (image) {
          return new Image(image);
        }));
      } else {
        console.log(response);
        alert('error');
      }
    });
  }

  // Activates knockout.js
  ko.applyBindings(new GalleryViewModel());

});