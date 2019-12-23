var config = require('config');
var AuditingInfoDAO = require('./AuditingInfoDAO');
var logger = require('../lib/logger');
var EU_Notifications = require('../models/Notifications')
var CommonService = require('../services/CommonService');

// --- Begin: EU-NotificationsDAO
module.exports = {

  getUserNotifications: function(searchString, decodedTokenData, callback) {
    var query = {
      'euUserObj': decodedTokenData.iss,
      '$or': [
        {nTitle: {$regex: searchString, $options: 'i'}},
        {nMessage: {$regex: searchString, $options: 'i'}}
      ],
      'isDeleted': false
    }
    EU_Notifications.find(query).sort({createdAtNumber: -1}).exec(function(error, resObj) {
      if(error) {
        logger.error('There was an Un-known Error occured in daos/EU-NotificationsDAO.js,' +
          ' at getUserNotifications:', error);
        callback({ httpCode: 500, statusCode: '9999', result: [] });
      } else if(resObj && resObj.length > 0) {
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9997', result: [] });
      }
    });
  },

  // Begin: getUserUnreadNotificationsCount
  getUserUnreadNotificationsCount: function(decodedTokenData, callback) {
    var query = {
      'euUserObj': decodedTokenData.iss,
      'nStatus': config.notesStatus.unread,
      'isDeleted': false
    }
    EU_Notifications.countDocuments(query).exec(function(error, unCount) {
      if(error) {
        logger.error('There was an Un-known Error occured in daos/EU-NotificationsDAO.js,' +
          ' at getUserUnreadNotificationsCount:', error);
        callback({ httpCode: 500, statusCode: '9999', result: 0 });
      } else if(unCount) {
        callback({ httpCode: 200, statusCode: '0000', result: unCount });
      } else {
        callback({ httpCode: 400, statusCode: '9997', result: 0 });
      }
    });
  },

  // --- Begin: sendNotification
  sendNotification: function(noteObj, decodedTokenData) {
    new EU_Notifications(noteObj).save(function(error, resObj) {
      if(error) {
        logger.error('There was an Un-known Error occured in daos/EU-NotificationsDAO.js,' +
          ' at sendNotification:', error);
        // callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if(resObj && resObj._id) {
        var collectionObj = { name: config.collectionEUNotifications, id: resObj._id, value: resObj.euUserAccount };
        AuditingInfoDAO.euAuditing(decodedTokenData, config.auditAction.create, collectionObj, resObj);
        // callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        logger.error('There was an Error occured in daos/EU-NotificationsDAO.js, at sendNotification:', error);
        // callback({ httpCode: 400, statusCode: '9993', result: {} });
      }
    });
  }
  // --- End: sendNotification

};
// --- End: EU-NotificationsDAO
