var config = require('config');
var async = require('async');

var logger = require('../lib/logger');
var Users = require('../models/Users');

// --- Begin: UsersDAO
module.exports = {

  // --- Begin: getUserObject
  getUserInfo: function(userObj, callback) {
    var query = {
      _id: userObj,
      isDeleted: false
    };
    Users.findOne(query).exec(function(error, resObj) {
      if(error) {
          logger.error('There was an Un-known Error occured in daos/UsersDAO.js,' +
            ' at getUserInfo:', error);
          callback({ httpCode: 500, statusCode: '9999', result: [] });
      } else if(resObj && resObj._id) {
          callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
          callback({ httpCode: 400, statusCode: '9997', result: [] });
      }
    });
  },
  // --- End: getUserObject

  // --- Begin: getUsersBySearch
  getUsersBySearch: function(searchString, decodedTokenData, callback) {
    var query = {
      '_id': {'$nin': [decodedTokenData.iss]},
      '$or': [
        {firstName: {$regex: searchString, $options: 'i'}},
        {lastName: {$regex: searchString, $options: 'i'}},
        {userAccount: {$regex: searchString, $options: 'i'}},
        {email: {$regex: searchString, $options: 'i'}}
      ],
      'isDeleted': false
    };
    Users.find(query).exec(function(error, resObj) {
      if(error) {
          logger.error('There was an Un-known Error occured in daos/UsersDAO.js,' +
            ' at getUsersBySearch:', error);
          callback({ httpCode: 500, statusCode: '9999', result: [] });
      } else if(resObj && resObj.length > 0) {
          callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
          callback({ httpCode: 400, statusCode: '9997', result: [] });
      }
    });
  },
  // --- End: getUsersBySearch

  // --- Begin: getUserRightsPoints
  getUserRightsPoints: function(decodedTokenData, callback) {
    var query = {
      _id: decodedTokenData.iss,
      isDeleted: false
    };
    Users.findOne(query, {noSwaggRights: 1, noPoints: 1}).exec(function(error, resObj) {
      if(error) {
          logger.error('There was an Un-known Error occured in daos/UsersDAO.js,' +
            ' at getUserRightsPoints:', error);
          callback({ httpCode: 500, statusCode: '9999', result: [] });
      } else if(resObj && resObj._id) {
          callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
          callback({ httpCode: 400, statusCode: '9997', result: [] });
      }
    });
  },
  // --- End: getUserRightsPoints

}
// --- End: UsersDAO