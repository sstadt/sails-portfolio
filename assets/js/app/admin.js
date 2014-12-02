/*jslint browser: true*/

require([
	'knockout',
  'components/blog-editor/component',
	'components/skill-list/component',
	'components/project-list/component',
	'components/link-list/component',
	'components/gallery-list/component'
], function (ko, BlogEditor, SkillList, ProjectList, LinkList, GalleryList) {
  'use strict';

  ko.components.register('blog-editor', BlogEditor);

  ko.components.register('skill-list', SkillList);

  ko.components.register('project-list', ProjectList);

  ko.components.register('link-list', LinkList);

  ko.components.register('gallery-list', GalleryList);

  // apply character list view model to the dom
  ko.applyBindings();
});