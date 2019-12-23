var conf = require('nconf');
conf.argv().env();

conf.update = function() {
    conf.file('config/statusCodes.js');
    return;
};

conf.update();

module.exports = conf;
