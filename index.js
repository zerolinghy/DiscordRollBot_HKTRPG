"use strict";

require('dotenv').config();
require('fs').readdirSync(__dirname + '/modules/').forEach(async function (file) {
  if (file.match(/\.js$/) && file.match(/^core-/)) {
    var name = file.replace('.js', '');
    exports[name] = await require('./modules/' + file);
  }
});

process.on('warning', (warning) => {
  console.warn(warning.name); // Print the warning name
  console.warn(warning.message); // Print the warning message
  console.warn(warning.stack); // Print the stack trace
});
