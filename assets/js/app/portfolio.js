/*jslint browser: true*/

require([
  'jquery',
  'knockout',
  'components/contact-form/component',
  'fittext',
  'bsvalidate'
], function ($, ko, ContactForm) {
  'use strict';

  var btnTop = $('#scroll-top a');

  // set up the responsive header
  window.fitText($('h1'), 1.1);

  // set up the navigation scrolling
  $('#nav a').click(function (e) {
    e.preventDefault();

    var target = $($(this).attr('href')).offset().top;

    $("html, body").animate({ scrollTop: target }, 800);
  });

  btnTop.click(function (e) {
    e.preventDefault();

    $("html, body").animate({ scrollTop: 0 });
  });

  // set up the top button animations
  $(window).scroll(function () {
    if ($(window).scrollTop() >= 400) {
      btnTop.animate({ marginTop: -117 }, { queue: false });
    } else {
      btnTop.animate({ marginTop: 0 }, { queue: false });
    }
  });

  ko.components.register('contact-form', ContactForm);

  // apply character list view model to the dom
  ko.applyBindings();
});