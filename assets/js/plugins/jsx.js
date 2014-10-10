/**
 * JSX plugin for using react with require.js
 */

define(['JSXTransformer', 'text'], function (JSXTransformer, text) {
  'use strict';

  var buildMap = {};

  var jsx = {
    version: '0.3.0',

    load: function (name, req, onLoadNative, config) {
      var fileExtension = config.jsx && config.jsx.fileExtension || '.js';

      var transformOptions = (config.jsx && config.jsx.harmony) ? { harmony: true } : null;

      var onLoad = function (content) {
        try {
          if (-1 === content.indexOf('/** @jsx React.DOM */\n')) {
            content = "/** @jsx React.DOM */\n" + content;
          }
          content = JSXTransformer.transform(content, transformOptions).code;
        } catch (err) {
          onLoadNative.error(err);
        }

        if (config.build) {
          buildMap[name] = content;
        } else if (typeof location !== 'undefined') {
          content += "\n//# sourceURL=" + location.protocol + "//" + location.hostname + config.baseUrl + name + fileExtension;
        }

        onLoadNative.fromText(content);
      };

      text.load(name + fileExtension, req, onLoad, config);
    },

    write: function (pluginName, moduleName, write) {
      if (buildMap.hasOwnProperty(moduleName)) {
        var content = buildMap[moduleName];
        write.asModule(pluginName + "!" + moduleName, content);
      }
    }
  };

  return jsx;
});