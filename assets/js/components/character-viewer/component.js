/*jslint browser: true*/
/*globals define, alert, confirm*/

/**
 * Character Viewer Component
 *
 * Encapculates the character view and edit
 * portions of the tracker.
 */

define([
  'jquery',
  'lodash',
  'knockout',
  'Character',
  'text!./template.html'
], function ($, _, ko, Character, html) {
  'use strict';

  function CharacterViewerViewModel(params) {
    // cache this to prevent potential conflicts without having to constantly pass context arguments
    var self = this;

    /**
     * Master character list
     *
     * By setting this to the passed in cahracter list parameter,
     * this component's character list becomes linked with the
     * parent component's character list, so any updates we make here
     * (i.e. updating a character) will be reflected in the parent
     * component.
     */
    self.characters = params.characterList;

    // selected character data
    self.selectedCharacter = params.selectedCharacter; // Linked to the selected character in the parent component
    self.selectedCharacterName = ko.observable();
    self.selectedCharacterBiography = ko.observable();

    /**
     * Subscribe to the selectedCharacter observable.
     *
     * This is done to keep editable data synced to the selected character.
     * Using the master selectedCharacter observable, you are unable to
     * perform updates so we watch for updates to the linked selectedCharacter
     * observable and update the simple observables that can retrieved and
     * used later.
     * 
     * @param  {object} selectedCharacter The updated selectedCharacter, passed by knockout
     * @return {void}
     */
    self.selectedCharacter.subscribe(function (selectedCharacter) {
      self.selectedCharacterName(selectedCharacter.name);
      self.selectedCharacterBiography(selectedCharacter.bio);
    });

    /**
     * Update an existing character.
     *
     * Sends an ajax call to the back-end, and update the character list.
     * 
     * @return {void}
     */
    self.updateCharacter = function () {
      // set up the updated character object for sails
      var updatedChar = {
        id: self.selectedCharacter().id,
        name: self.selectedCharacterName,
        bio: self.selectedCharacterBiography
      };

      // post character updates to sails
      $.ajax({
        type: 'POST',
        url: '/character/update',
        dataType: 'json',
        data: updatedChar,
        cache: false,
        success: function (response) {
          if (response.success) {
            // get the index of the character that was updated
            var charIndex = _.findIndex(self.characters(), function (c) {
              return c.id === response.character[0].id;
            });

            // update characters
            self.characters.replace(self.characters()[charIndex], new Character(response.character[0]));

            // hide the bootstrap modal
            $('#characterModal').modal('hide');
          } else {
            alert('error');
            console.log(response.err);
          }
        },
      });
    };
  }

  return {
    viewModel: CharacterViewerViewModel,
    template: html
  };
});

