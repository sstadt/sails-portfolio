/*jslint browser: true*/
/*globals define, confirm, alert*/

/**
 * Character List Component
 *
 * Encapculates the character list view and
 * invokes that character-view, and 
 * character-creater components, which sync
 * with the master character list view to
 * maintain character data across the app.
 *
 * To link the character list data to another
 * component use the knockout component binding
 * and pass the following parameters:
 *
 *   characterList: characters
 *   selectedCharacter: selectedCharacter
 */

define([
  'jquery',
  'knockout',
  'Character',
  'text!./template.html'
], function ($, ko, Character, html) {
  'use strict';

  function CharacterListViewModel() {
    // cache this to avoid conflicts later
    var self = this;

    // list data
    this.characters = ko.observableArray([]);
    this.selectedCharacter = ko.observable();

    /**
     * Sort the character list by a passed parameter.
     *
     * By doing a simple javascript sort on the existing characters
     * observable array, and reassigning that sorted array back to
     * the observable, we can easily modify the page content through
     * data bindings.
     * 
     * @param  {string}       sortBy    The name of the character property to sort by
     * @param  {object}       modelView The model view object - unused; passed in by knockout
     * @param  {jQuery.event} event     The event object
     * @return {void}
     */
    self.sortCharacterList = function (sortBy, modelView, event) {
      var btn = $(event.target),
        order = btn.find('i').hasClass('glyphicon-chevron-up') ? 'desc' : 'asc',
        newicon = (order === 'asc') ? 'glyphicon-chevron-up' : 'glyphicon-chevron-down',
        sorted;

      // set icons
      btn.find('i').attr('class', 'glyphicon ' + newicon);
      btn.closest('[class^="col-"').siblings().find('i').each(function () {
        $(this).attr('class', 'glyphicon');
      });

      // sort the observable
      sorted = this.characters().sort(function (prev, curr) {
        var movement = 0,
          prevVal = (typeof prev[sortBy] === 'function') ? prev[sortBy]() : prev[sortBy], // hand off value in case this is computed
          currVal = (typeof curr[sortBy] === 'function') ? curr[sortBy]() : curr[sortBy]; // hand off value in case this is computed

        if (prevVal < currVal) {
          movement = (order === 'desc') ? 1 : -1;
        } else if (prevVal > currVal) {
          movement = (order === 'asc') ? 1 : -1;
        }

        return movement;
      });

      this.characters(sorted);
    };

    // set the selected character - this will be watched by the character-viewer component
    /**
     * Set the currently selected character.
     *
     * There is precious little functionality here as the child
     * component will take care of the heavy lifting. By linking
     * the child component to the selected character observable
     * through the 'component' data binding parameters, we've
     * essentially linked the two modules through the selectedCharacter
     * observable. Any updates made here, will automatically
     * reflect in the child component.
     * 
     * @param  {object} character The character object being passed from knockout
     * @return {void}
     */
    self.viewCharacter = function (character) {
      self.selectedCharacter(character);
    };

    /**
     * Remove an existing character.
     *
     * This will delete a character from the character list after an
     * ajax call to the back-end.
     * 
     * @param  {object} character The character object being passed from knockout
     * @return {void}
     */
    self.removeCharacter = function (character) {
      if (confirm('Are you sure you want to delete this character?')) {
        // delete the character from sails
        $.ajax({
          type: 'POST',
          url: '/character/destroy',
          dataType: 'json',
          data: { id: character.id },
          cache: false,
          success: function (response) {
            if (response.success) {
              // update the character list
              self.characters.destroy(character);
            } else {
              alert('error');
              console.log(response.err);
            }
          }
        });
      }
    };

    /**
     * Show a new character element.
     *
     * Bound using afterAdd on the parent element, allows
     * you to control the behavior of how to element is added
     * to the DOM.
     * 
     * @param  {element} element jQuery element being added
     * @return {void}
     */
    self.showCharacterElement = function (element) {
      if (element.nodeType === 1) {
        $(element).hide().slideDown();
      }
    };

    /**
     * Remove an existing character element.
     *
     * Bound using beforeRemove on the parent element, allows
     * you to control how the element is removed from the DOM.
     * 
     * @param  {element} element jQuery element being removed
     * @return {void}
     */
    self.hideCharacterElement = function (element) {
      if (element.nodeType === 1) {
        $(element).slideUp(function () {
          $(element).remove();
        });
      }
    };

    // populate initial characters from sails
    $.ajax({
      type: 'GET',
      url: '/character/getlist',
      dataType: 'json',
      cache: false,
      success: function (response) {
        if (response.success) {
          if (response.characters.length > 0) {
            var mappedCharacters = $.map(response.characters, function (c) {
              return new Character(c);
            });

            self.characters(mappedCharacters);
          }
        } else {
          alert('error');
          console.log(response.err);
        }
      }
    });

  } /* End of View Model */

  /**
   * Register child components.
   *
   * The child components will be instantiated and linked to their
   * data-bind in the markup. Any parameters passed in from the
   * data-binding in the markup will be passed into the child
   * component's view model
   */

  // create character component
  ko.components.register('character-creater', { require: 'components/knockout/character-creater/component' });

  // view/edit character component
  ko.components.register('character-viewer', { require: 'components/knockout/character-viewer/component' });

  return {
    viewModel: CharacterListViewModel,
    template: html
  };
});

