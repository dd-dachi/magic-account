var logger = require('../lib/logger');
var Users = require('../models/Users');
var AuditingInfoDAO = require('./AuditingInfoDAO');
var config = require('config');

// --- Begining of UsersProfileDAO
module.exports = {
  
  userMagicAccountUpdate: function (updateUserObj, tokenDecodedData, callback) {
    var query = { _id: tokenDecodedData.iss, isDeleted: false };
    Users.findOneAndUpdate(query, { $set: updateUserObj }, { new: true }, function (error, resObj) {
      if (error) {
        logger.error('There was an Error in controllers/UsersProfileDAO.js at userMagicAccountUpdate:', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj._id) {
        AuditingInfoDAO.euAuditing(tokenDecodedData, 'Update', { name: config.collectionUsers, id: tokenDecodedData.iss, value: tokenDecodedData.ua }, updateUserObj);
        callback({httpCode: 200, statusCode: '0000', result: resObj});
      } else {
        callback({ httpCode: 400, statusCode: '9992', result: {} });
      }
    });
  },
  
  endUserProfileUpdate: function (updateUserObj, tokenDecodedData, callback) {
    var query = { _id: tokenDecodedData.iss, isDeleted: false };
    Users.findOneAndUpdate(query, { $set: updateUserObj }, { new: true }, function (error, resObj) {
      if (error) {
        logger.error('There was an Error in controllers/UsersProfileDAO.js at endUserProfileUpdate:', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if (resObj && resObj._id) {
        var euUserObj = resObj;
        var decObj = {
          mobileNumber: resObj.mobileNumber,
          email: resObj.email,
          alternateMobileNumber: resObj.alternateMobileNumber.trim() ,
          alternateEmail: resObj.alternateEmail.trim(),
        };
        var resultObj = JSON.parse((JSON.stringify(euUserObj) + JSON.stringify(decObj)).replace(/}{/g, ','));
        callback({httpCode: 200, statusCode: '0000', result: resultObj});
      } else {
        callback({ httpCode: 400, statusCode: '9992', result: {} });
      }
    });
  },
  
  updateUserProfilePassword: function (updateUserPasswordObj, tokenDecodedData, callback) {
    var query = { _id: tokenDecodedData.iss, isDeleted: false };
    Users.updateOne(query, { $set: updateUserPasswordObj }, function (error, resObj) {
        if (error) {
            logger.error('There was an Un-Known Error occured in daos/UsersProfileDAO.js, at updateUserProfilePassword:', err);
            callback({ httpCode: 500, statusCode: '9999', result: {} });
        } else if (resObj.nModified == 1) {
            AuditingInfoDAO.euAuditing(tokenDecodedData, 'Update', { name: config.collectionUsers, id: tokenDecodedData.iss, value: tokenDecodedData.ua }, updateUserPasswordObj);
            callback({ httpCode: 200, statusCode: '1012', result: resObj });
        } else {
            callback({ httpCode: 400, statusCode: '9993', result: {} });
        }
    });
  },

  updateUserPreferenceData: function (tokenDecodedData, userPreferenceObj, callback) {
    Users.findOneAndUpdate({ _id: tokenDecodedData.iss, isDeleted: false },
    { $set: userPreferenceObj }, { new: true }, function (error, data) {
        if (error) {
            logger.error('There was an Un-konwn Error occured in daos/UsersProfileDAO.js, at updateUserPreferenceData:', error);
            callback(error, { statusCode: '9999', result: {} });
        } else if (data && data._id) {
            AuditingInfoDAO.euAuditing(tokenDecodedData, 'Update', { name: config.collectionUsers, id: data._id, value: data.userAccount }, userPreferenceObj);
            callback(error, { statusCode: '0000', result: data });
        } else {
            logger.error('There was an Error occured in daos/UsersProfileDAO.js,' +
                ' at updateUserPreferenceData: User Profile preference Update Failed');
            callback(error, { statusCode: '9992', result: {} });
        }
    });
  },
  
  updateUserExpoTokens: function (decodedTokenData, expoPushToken, callback) {
    Users.findById(decodedTokenData.iss, function(err, user){
      if (err) {
        logger.error('There was an Un-konwn Error occured in daos/UsersProfileDAO.js, at updateUserExpoTokens:', error);
        callback(error, { statusCode: '9999', result: {} });
      } else {
        if (!expoPushToken || '' == expoPushToken) {
          logger.warn('Expo token null, at updateUserExpoTokens:', expoPushToken);
          callback(err, { statusCode: '0000', result: user });
        }
        if (!user.expoPushTokens) user.expoPushTokens = [];
        // No need to update the expoPushToken if already exists
        if (user.expoPushTokens.indexOf(expoPushToken) >= 0) callback(null, { statusCode: '0000', result: user});
        else user.expoPushTokens.push(expoPushToken);
        var userObj = {
          expoPushTokens: user.expoPushTokens
        };
        Users.findOneAndUpdate({ _id: decodedTokenData.iss, isDeleted: false },
        { $set: userObj }, { new: true }, function (error, data) {
            if (error) {
                logger.error('There was an Un-konwn Error occured in daos/UsersProfileDAO.js, at updateUserExpoTokens:', error);
                callback(error, { statusCode: '9999', result: {} });
            } else if (data && data._id) {
                AuditingInfoDAO.euAuditing(decodedTokenData, 'Update', { name: config.collectionUsers, id: data._id, value: data.userAccount }, data);
                callback(error, { statusCode: '0000', result: data });
            } else {
                logger.error('There was an Error occured in daos/UsersProfileDAO.js,' +
                    ' at updateUserExpoTokens: User expo token Update Failed');
                callback(error, { statusCode: '9992', result: {} });
            }
        });
      }
    });
  },
};
// -----Ending of UsersProfileDAO
