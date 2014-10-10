/*jslint browser: true*/

require([
  'react',
  'jsx!components/react/Characterlist',
  'jsx!components/react/CharacterCreater'
], function (React, CharacterList, CharacterCreater) {
  'use strict';

  React.renderComponent(
    CharacterList({ url: '/character/getlist', pollInterval: 2000 }),
    document.getElementById('characterListContainer')
  );

  React.renderComponent(
    CharacterCreater({ url: '/character/create' }),
    document.getElementById('characterCreaterContainer')
  );

});



