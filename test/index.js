'use strict';

exports.require = (filename) => {
  const path = filename.replace('/test/', '/').replace('.test.js', '');
  if(require('fs').existsSync(path + '.js')) {
    return require(path);
  } else {
    throw new Error('Can not find relevant path' + path + '.js'); 
  }
};


