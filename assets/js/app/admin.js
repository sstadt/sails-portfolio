/*jslint browser: true*/

require([
	'knockout',
  'components/blog-editor/component',
	'components/skill-list/component',
	'components/project-list/component',
	'components/link-list/component',
	'components/gallery-list/component',
  'text!templates/wysiwyg/emphasis.html',
  'wysiwyg'
], function (ko, BlogEditor, SkillList, ProjectList, LinkList, GalleryList, EmphasisTemplate) {
  'use strict';

  var wysiwygTemplates = {
    emphasis: function (locale) {
      return EmphasisTemplate;
    }
  };

  /**
   * Custom binding for the bootstrap-wysihtml5
   *
   * https://github.com/nicholasjackson/knockoutjs-wysihtml5/blob/master/knockout.wysihtml5.js
   */
  ko.bindingHandlers.wysihtml5 = {
    init: function (element, valueAccessor) {

      var options = {
        customTemplates: wysiwygTemplates
      };
      var value = ko.utils.unwrapObservable(valueAccessor()) || {};
      var control;

      options.events = {
        "change": function () {
          var observable;
          var content = ko.utils.unwrapObservable(valueAccessor()) || {};

          if (content.data !== undefined) {
            observable = valueAccessor().data;
          } else {
            observable = valueAccessor();
          }

          observable(control.getValue());
        }
      };

      if (value.options) {
        ko.utils.extend(options, value.options);
        delete value.options;
      }

      // if the textarea has no id, generate one to keep wysihtml5 happy
      if ($(element).attr('id') === undefined || $(element).attr('id') === '') {
        $(element).attr('id', 'id_' + Math.floor(new Date().valueOf()));
      }

      control = $(element).wysihtml5(options).data("wysihtml5").editor;
    },
    update: function (element, valueAccessor) {
      var control = $(element).data("wysihtml5").editor;
      var content = ko.utils.unwrapObservable(valueAccessor()) || {};

      console.log(content);

      if (content.data !== undefined) {
        control.setValue(valueAccessor().data());
      } else {
        console.log(valueAccessor());
        control.setValue(valueAccessor()());
      }
    }
  };

  ko.components.register('blog-editor', BlogEditor);

  ko.components.register('skill-list', SkillList);

  ko.components.register('project-list', ProjectList);

  ko.components.register('link-list', LinkList);

  ko.components.register('gallery-list', GalleryList);

  // apply character list view model to the dom
  ko.applyBindings();
});