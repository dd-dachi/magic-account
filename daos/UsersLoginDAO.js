var config = require('config');

var AuditingInfoDAO = require('./AuditingInfoDAO');
var logger = require('../lib/logger');
var Users = require('../models/Users');

// --- Begin: UsersLoginDAO
module.exports = {

  // --- Begin isUserExist: Verify User Existance by UserID
  isUserExist: function(userID, callback) {
    Users.findOne({
      $or: [{ userAccount: userID }, { email: userID }],
      isDeleted: false
    }).exec(function(error, resObj) {
      if(error) {
        logger.error('There was an Un-known Error occured in daos/UsersLoginDAO.js,' +
          ' at isUserExist of User query:', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if(resObj && resObj._id) {
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9950', result: {} });
      }
    });
  },
  // --- End isUserExist: Verify User Existance by UserID

  userLoginStatusUpdate: function(recordId, uUpdateObj, decodedTokenData, callback) {
    Users.findOneAndUpdate({_id: recordId, isDeleted: false, loginStatus: false},
    {$set: uUpdateObj}, {new: true}).exec(function(error, resObj) {
      if(error) {
        logger.error('There was an Un-known Error occured in daos/UsersLoginDAO.js,' +
          ' at userLoginStatusUpdate:', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if(resObj && resObj._id) {
        var collectionObj = { name: config.collectionEUUsers, id: resObj._id, value: resObj.userAccount };
        AuditingInfoDAO.euAuditing(decodedTokenData, config.auditAction.update, collectionObj, uUpdateObj);
        callback({ httpCode: 200, statusCode: '0000', result: {} });
      } else {
        callback({ httpCode: 400, statusCode: '9992', result: {} });
      }
    });
  },

  setEUUserLogsData: function(userLogObj, callback) {
    userLogObj.save(function(error, resObj) {
      if(error) {
        logger.error('There was an Un-known Error occured in daos/UsersLoginDAO.js,' +
          ' at setEUUserLogsData of Create query:', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if(resObj && resObj._id) {
        var decodedTokenData = { iss: userLogObj.euUserObj, ua: userLogObj.euUserAccount };
        var collectionObj = { name: config.collectionEUUsersLogs, id: userLogObj._id, value: userLogObj.euUserAccount };
        AuditingInfoDAO.euAuditing(decodedTokenData, config.auditAction.create, collectionObj, userLogObj);
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9993', result: {} });
      }
    });
  },

  userRegistration: function(userObj, callback) {
    new Users(userObj).save(function(error, resObj) {
      if(error) {
        if(error.errmsg.indexOf('email_1') > 0) {
          logger.error('There was an Uniqueness(email) Error occured in daos/UsersLoginDAO.js,'+
            ' at userRegistration:', error);
          callback({ httpCode: 400, statusCode: '9954', result: {} });
        } else if(error.errmsg.indexOf('userAccount_1') > 0) {
          logger.error('There was an Uniqueness(userAccount_1) Error occured in daos/UsersLoginDAO.js,'+
            ' at userRegistration:', error);
          callback({ httpCode: 400, statusCode: '9953', result: {} });
        } else {
          logger.error('There was an Un-known Error occured in daos/UsersLoginDAO.js,' +
          ' at userRegistration of Create query:', error);
          callback({ httpCode: 500, statusCode: '9999', result: {} });
        }
      } else if(resObj && resObj._id) {
        var decodedTokenData = { iss: resObj._id, ua: resObj.userAccount };
        var collectionObj = { name: config.collectionEUUsers, id: resObj._id, value: resObj.userAccount };
        AuditingInfoDAO.euAuditing(decodedTokenData, config.auditAction.create, collectionObj, resObj);
        callback({ httpCode: 200, statusCode: '1001', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9993', result: {} });
      }
    });
  }

};
// --- End: UsersLoginDAO
