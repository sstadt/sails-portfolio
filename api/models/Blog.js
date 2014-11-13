/**
* Blog.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    title: {
      type: 'string',
      required: true
    },
    content: {
      type: 'string',
      required: true
    },
    tags: {
      type: 'array'
    },
    status: {
      type: 'string',
      defaultsTo: 'draft',
      enum: ['draft', 'published']
    },
    published: {
      type: 'date'
    }
  }
};

