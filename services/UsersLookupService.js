
var logger = require('../lib/logger');
var UsersLookupDAO = require('../daos/UsersLookupDAO');
var CommonService = require('../services/CommonService');

// --- Begin: AD-EUUsersService
module.exports = {

  // --- Begin: getEndUsersData
  getEndUsersData: function(searchString, decodedTokenData, callback) {
    UsersLookupDAO.getEndUsersData(searchString, decodedTokenData, function(resObj) {
      callback(resObj);
    });
  },

  getUserById: function(decodedTokenData, callback) {
    UsersLookupDAO.findUserById(decodedTokenData, function(resObj) {
      callback(resObj);
    });
  },
  // --- End: getEndUsersData
}
// --- End: AD-EUUsersService
  