/*jslint node: true*/

/**
* Project.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  schema: true,
  attributes: {
    name: {
      type: 'string',
      required: true
    },
    image: {
      type: 'string',
      required: true
    },
    link: {
      type: 'string'
    },
    skills: {
      type: 'array'
    },
    description: {
      type: 'string'
    },
    image: {
      type: 'string'
    }
  }
};

