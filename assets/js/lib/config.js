/*jslint browser: true*/
/*globals requirejs, alert, confirm, io*/

requirejs.config({

  paths: {
    // plugins
    'text': 'vendor/requirejs-text/text',

    // vendor
    'sails': 'vendor/sails.io.js/dist/sails.io',
    'jquery': 'vendor/jquery/dist/jquery',
    'fittext': 'vendor/fittext/fittext',
    'lodash': 'vendor/lodash/dist/lodash',
    'bootstrap': 'vendor/bootstrap/dist/js/bootstrap',
    'bsvalidate': 'vendor/bootstrapValidator/dist/js/bootstrapValidator',
    'knockout': 'vendor/knockout/dist/knockout',
    'dropzone': 'vendor/dropzone/downloads/dropzone',
    'hotkeys': 'vendor/bootstrap-wysiwyg/external/jquery.hotkeys',
    'wysiwyg': 'vendor/bootstrap-wysiwyg/bootstrap-wysiwyg',

    // classes
    'Post': 'lib/classes/Post',
    'Skill': 'lib/classes/Skill',
    'Project': 'lib/classes/Project',
    'Link': 'lib/classes/Link',
    'Image': 'lib/classes/Image'
  },

  shim: {
    'bootstrap': {
      deps: ['jquery']
    },
    'bsvalidate': {
      deps: ['bootstrap']
    },
    'hotkeys': {
      deps: ['jquery']
    },
    'wysiwyg': {
      deps: ['jquery', 'hotkeys', 'bootstrap']
    },
    'fittext': {
      deps: ['jquery']
    }
  }

});



