/*jslint browser: true*/

require(['jquery'], function ($) {
  'use strict';

  // grab the stuff we're going to use
  var thumbs = $('.thumbnail'),
    viewer = $('#image_viewer'),
    overlay = $('#modal_overlay'),
    img_content = $('#tabs'),
    moon = $('#moon'),
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
    },
    alignImage = function (view) {
      var height = view.css('height'),
        img = view.find('img'),
        imgheight = img.get(0).height,
        hpadding = (parseInt(height, 10) - parseInt(imgheight, 10)) / 2;

      if (hpadding > 0 && imgheight > 0) {
        img.css('margin-top', hpadding);
      }
      // else if (imgheight === 0) {
      //   console.log('image align error(' + img.attr('src').substr(img.attr('src').lastIndexOf('/')+1) + '): the image height has returned as 0');
      // }
    },
    easedur = 400,
    gallery_thumbs = 15,
    newview;

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

    if (thumbs.length > 0) {
      $(window).resize(function () {
        // set the background position
        panSky();
        alignImage(viewer);
      });
    } else {
      $(window).resize(function () {
        // set the background position
        panSky();
      });
    }
  } else if (thumbs.length > 0) {

    $(window).resize(function () {
      // set the background position
      alignImage(viewer);
    });
  }

  // -----------------------
  //     IMAGE GALLERY
  // -----------------------

  if (thumbs.length > 0) {

    // set up the thumbnails
    thumbs.each(function () {
      var that = $(this);

      that.bind('click', function () {

        // grab the image location
        var img = $(this).find('img').attr('src'),
          fullimg = img.substr(0, img.indexOf('thumbs')) + img.substr(img.lastIndexOf('/') + 1);

        // place the image in the viewer
        viewer.empty();
        viewer.append('<img src="' + fullimg + '" />');

      });

    });

    // set up thumbnail tabs
    img_content.find('.tab').hide(0, function () {
      img_content.find('#img_tab1').show();
    });

    // set up thumbnail navigation
    img_content.prev().find('p').text('page 1 of ' + Math.ceil(thumbs.length / gallery_thumbs)).prev().bind('click', function () {
      // previous image button

      // change the image page
      img_content.children().each(function () {
        var that = $(this);

        if (that.css('display') !== 'none') {

          that.fadeOut(easedur, function () {

            // determine what the next view is
            if (that.prev().attr('id') !== undefined) {
              newview = that.prev();
            } else {
              newview = that.siblings(':last');
            }

            // initialize the next view
            var nav_text = 'page ' + newview.attr('id').substr(7) + ' of ' + Math.ceil(thumbs.length / gallery_thumbs);
            img_content.prev().find('p').text(nav_text);
            newview.fadeIn(easedur);
          });

          return false;
        }
      });

      return false;
    }).prev().bind('click', function () {
      // next image button

      // change the image page
      img_content.children().each(function () {
        var that = $(this);

        if (that.css('display') !== 'none') {

          that.fadeOut(easedur, function () {

            // determine what the next view is
            if (that.next().attr('id') !== undefined) {
              newview = that.next();
            } else {
              newview = that.siblings(':first');
            }

            // initialize the next view
            var nav_text = 'page ' + newview.attr('id').substr(7) + ' of ' + Math.ceil(thumbs.length / gallery_thumbs);
            img_content.prev().find('p').text(nav_text);
            newview.find('img').each(function () {
              newview.fadeIn(easedur);
            });
          });

          return false;
        }
      });

      return false;
    });

    // set up viewer controls
    viewer.parent().find('#viewer_next').bind('click', function () {
      // viewer next button

      // get the next image
      var viewerimg = viewer.find('img').attr('src'),
        nextimg = viewerimg.substr(0, viewerimg.lastIndexOf('/')) + '/thumbs' + viewerimg.substr(viewerimg.lastIndexOf('/'));

      var index = 0;

      // find the next image and navigate to it
      thumbs.each(function () {
        var thumbimg = $(this).find('img').attr('src');

        if (thumbimg === nextimg) {
          if (index + 1 > thumbs.length - 1) {
            nextimg = $(thumbs[0]).find('img').attr('src');
          } else {
            nextimg = $(thumbs[index + 1]).find('img').attr('src');
          }
          nextimg = nextimg.substr(0, nextimg.indexOf('thumbs')) + nextimg.substr(nextimg.lastIndexOf('/') + 1);

          // place the image in the viewer
          viewer.fadeOut(easedur, function () {
            viewer.empty();
            viewer.append('<img src="' + nextimg + '" />');
          });

          return false;
        }

        index++;
      });

      return false;
    }).next().bind('click', function () {
      // viewer previous button

      // get the next image
      var viewerimg = viewer.find('img').attr('src'),
        nextimg = viewerimg.substr(0, viewerimg.lastIndexOf('/')) + '/thumbs' + viewerimg.substr(viewerimg.lastIndexOf('/'));

      var index = 0;

      // find the next image and navigate to it
      thumbs.each(function () {
        var thumbimg = $(this).find('img').attr('src');

        if (thumbimg === nextimg) {
          if (index === 0) {
            nextimg = $(thumbs[thumbs.length - 1]).find('img').attr('src');
          } else {
            nextimg = $(thumbs[index - 1]).find('img').attr('src');
          }
          nextimg = nextimg.substr(0, nextimg.indexOf('thumbs')) + nextimg.substr(nextimg.lastIndexOf('/') + 1);

          // place the image in the viewer
          viewer.fadeOut(easedur, function () {
            viewer.empty();
            viewer.append('<img src="' + nextimg + '" />');
          });

          return false;
        }

        index++;
      });

      return false;
    }).next().bind('click', function () {
      // viewer close button

      // hide the viewer
      viewer.parent().fadeOut(easedur);
      overlay.fadeOut(easedur);

      return false;
    });

  }

});