/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    email: {
      type: 'string',
      email: true,
      required: true,
      unique: true
    },
    encryptedPassword: {
      type: 'string'
    },
    config: {
      type: 'json'
    },
    toJSON: function () {
      var obj = this.toObject();

      delete obj.password;
      delete obj.confirmation;
      delete obj.encryptedPassword;
      delete obj._csrf;

      return obj;
    }

  },

  beforeCreate: function (values, next) {
    if (!values.password || values.password !== values.confirmation) {
      return next({
        err: ["Passwords don't match"]
      });
    }

    require("bcrypt").hash(values.password, 10, function passwordEncryption(err, encryptedPassword) {
      if (err) {
        return next(err);
      }

      delete values.password;
      delete values.confirmation;
      values.encryptedPassword = encryptedPassword;
      next();
    });
  }
};

