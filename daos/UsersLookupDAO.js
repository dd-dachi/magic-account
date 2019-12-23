var logger = require('../lib/logger');
var Users = require('../models/Users');

// --- Begin: AD-EUUsersDAO
module.exports = {

  // --- Begin: getEndUsersData
  findUserById: function(decodedTokenData, callback) {
    var query = {
      _id: decodedTokenData.iss
    };
    Users.findById(query).exec(function(error, resObj) {
      if(error) {
          logger.error('There was an Un-known Error occured in daos/AD-EUUsersDAO.js,' +
            ' at getEndUsersData:', error);
          callback({ httpCode: 500, statusCode: '9999', result: null });
      } else if(resObj) {
          callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
          callback({ httpCode: 400, statusCode: '9997', result: null });
      }
    });
  },
  // --- End: getUsersBySearch

  // --- Begin: getEndUsersData
  getEndUsersData: function(searchString, decodedTokenData, callback) {
    var query = {
      '$or': [
        {firstName: {$regex: searchString, $options: 'i'}},
        {lastName: {$regex: searchString, $options: 'i'}},
        {userAccount: {$regex: searchString, $options: 'i'}},
        {email: {$regex: searchString, $options: 'i'}}
      ],
      'isDeleted': false
    };
    Users.find(query).sort({name: 1}).exec(function(error, resObj) {
      if(error) {
          logger.error('There was an Un-known Error occured in daos/AD-EUUsersDAO.js,' +
            ' at getEndUsersData:', error);
          callback({ httpCode: 500, statusCode: '9999', result: [] });
      } else if(resObj && resObj.length > 0) {
          callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
          callback({ httpCode: 400, statusCode: '9997', result: [] });
      }
    });
  },
  // --- End: getUsersBySearch
}
// --- End: AD-EUUsersDAO
