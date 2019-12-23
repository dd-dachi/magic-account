var config = require('config');
var moment = require('moment');
var logger = require('../lib/logger');

var CommonService = require('./CommonService');
var AuditingInfoDAO = require('../daos/AuditingInfoDAO');
var UsersProfileDAO = require('../daos/UsersProfileDAO');
var UsersLoginDAO = require('../daos/UsersLoginDAO');
var lookupsData = require('../config/lookupsData');

// --- Begin: UsersProfileService
module.exports = {

  // --- Begin userMagicAccountUpdate
  userMagicAccountUpdate: function (updateUserObj, decodedTokenData, res, callback) {    
    UsersProfileDAO.userMagicAccountUpdate(updateUserObj, decodedTokenData, function (resObj) {
      if (resObj.statusCode === '0000') {
        CommonService.tokenGeneration(resObj.result, res, function (token) {
          if (token) {
            var collectionObj = { name: config.collectionUsers, id: decodedTokenData.iss, value: updateUserObj.name }
            AuditingInfoDAO.euAuditing(decodedTokenData, config.auditAction.update, collectionObj, updateUserObj);
            callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
          } else {
            logger.error('There was an Error in controllers/UsersProfileService.js at setEndUserProfileUpdate token Generation');
            callback({ httpCode: 500, statusCode: '9999', result: {} });
          }
        });
      } else {
        callback(resObj);
      }
    });
  },

  // --- Begin endUserProfileUpdate
  endUserProfileUpdate: function (req, res, decodedTokenData, userIconLocation, callback) {
    if (userIconLocation) {
      setEndUserProfileUpdate(req.body, res, userIconLocation, decodedTokenData, function (resObj) {
        callback(resObj);
      });
    } else {
      setEndUserProfileUpdate(req.body, res, userIconLocation, decodedTokenData, function (resObj) {
        callback(resObj);
      });
    }
  },

  updateUserProfilePassword: function (profilePasswordObj, tokenDecodedData, callback) {
   var currentPassword = profilePasswordObj.currentPassword;
    var newPassword = profilePasswordObj.newPassword;
    UsersLoginDAO.isUserExist(tokenDecodedData.ua, function (resObj) {
      if (resObj.statusCode == '0000') {
        var userObj = resObj.result;
        if (userObj.userStatus == lookupsData.userStatuses.active
          && userObj.password && userObj.passwordSalt) {
          CommonService.passwordEncryption(currentPassword, userObj.passwordSalt, function (passwordObj) {
            if (passwordObj && passwordObj.passwordHash
              && passwordObj.passwordHash == userObj.password) {
              var currentUTC = CommonService.currentUTCObj();
              CommonService.saltGeneration(config.saltSize, function (salt) {
              CommonService.passwordEncryption(newPassword, salt, function (pswObj) {
                if (pswObj && pswObj.passwordHash) {
                    console
                    var updateUserPasswordObj = {
                      password: pswObj.passwordHash,
                      passwordSalt: pswObj.salt,
                      updatedAt: currentUTC.currentUTCDateTimeNumber,
                      updatedOn: currentUTC.currentUTCDateTimeString,
                      updatedBy: tokenDecodedData.ua
                    };
                    UsersProfileDAO.updateUserProfilePassword(updateUserPasswordObj, tokenDecodedData, function (pswUpdateResObj) {
                      callback(pswUpdateResObj);
                    });
                  } else {
                    callback({ httpCode: 400, statusCode: '', result: {} }); // New Status Code
                  }
                });
              });
            } else {
              callback({ httpCode: 400, statusCode: '9979', result: {} }); // New Status Code
            }
          });
        } else if (userObj.userStatus == lookupsData.userStatuses.inactive) {
          callback({ httpCode: 400, statusCode: '9951', result: {} });
          // } else if(userObj.userStatus == lookupsData.userStatuses.blocked) {
          //   callback({httpCode: 400, statusCode: '9952', result: {}});
        } else {
          callback({ httpCode: 400, statusCode: '9979', result: {} }); // New Status Code
        }
      } else {
        callback(resObj);
      }
    });
  },

  updateUserPreferenceData: function (reqObj, tokenDecodedData, callback) {
    var currentUTC = CommonService.currentUTCObj();
    var userPreferenceObj = {
      preferences: {
        defaultTimezone: reqObj.defaultTimezone,
        dateFormat: reqObj.dateFormat,
        updatedBy: tokenDecodedData.ua,
        updatedAt: currentUTC.currentUTCDateTimeNumber,
        updatedOn: currentUTC.currentUTCDateTimeString
      }
    };
    UsersProfileDAO.updateUserPreferenceData(tokenDecodedData, userPreferenceObj,
      function (error, resObj) {
        if (error) {
          logger.error('There was an Un-known Error in controllers/Users ProfileService.js',
            ' at updateUserPreferenceData:', error);
          callback({ httpCode: 500, statusCode: resObj.statusCode, result: resObj.result });
        } else if (resObj.statusCode === '0000') {
          callback({ httpCode: 200, statusCode: resObj.statusCode, result: resObj.result });
        } else {
          callback({ httpCode: 400, statusCode: resObj.statusCode, result: resObj.result });
        }
      });
  },
  // --- End endUserProfileUpdate
};

// --- End: UsersProfileService

/**
 * @param {object} reqBody object
 * @param {object} res object
 * @param {object} fileData object
 * @param {string} fileOriginalName string
 * @param {object} decodedTokenData object
 * @return {function} callback
 */
function setEndUserProfileUpdate(reqBody, res, userIconLocation, decodedTokenData, callback) {
  var updateUserObj = setUserObj(reqBody, userIconLocation, decodedTokenData);
  UsersProfileDAO.endUserProfileUpdate(updateUserObj, decodedTokenData, function (resObj) {
    if (resObj.statusCode === '0000') {
      CommonService.tokenGeneration(resObj.result, res, function (token) {
        if (token) {
          var collectionObj = { name: config.collectionUsers, id: decodedTokenData.iss, value: updateUserObj.name }
          AuditingInfoDAO.euAuditing(decodedTokenData, config.auditAction.update, collectionObj, updateUserObj);
          callback({ httpCode: resObj.httpCode, statusCode: resObj.statusCode, result: resObj.result });
        } else {
          logger.error('There was an Error in controllers/UsersProfileService.js at setEndUserProfileUpdate token Generation');
          callback({ httpCode: 500, statusCode: '9999', result: {} });
        }
      });
    } else {
      callback(resObj);
    }
  });
}

/**
 * @param {object} reqBody object
 * @param {object} fileData object
 * @param {string} fileOriginalName string
 * @param {object} decodedTokenData object
 * @return {object} object
 */
function setUserObj(reqBody, userIconLocation, decodedTokenData) {
  var currentUTC = CommonService.currentUTCObj();
  if (userIconLocation) {
    var userObj = {
      // email: reqBody.email ? reqBody.email: "",
      mobileNumber: reqBody.mobileNumber ? reqBody.mobileNumber: "",
      firstName: reqBody.firstName ? reqBody.firstName: "",
      lastName: reqBody.lastName ? reqBody.lastName: "",
      displayName: reqBody.displayName ? reqBody.displayName: "",
      name: reqBody.firstName + ' ' + reqBody.lastName,
      dob: reqBody.dob ? reqBody.dob : '',
      dobNumber: reqBody.dob ? moment(reqBody.dob, 'YYYY-MM-DD').valueOf() : 0,
      // userAccount: reqBody.userAccount,
      address: reqBody.address,
      userIcon: "",
      userIconOriginalName: "",
      userIconPath: userIconLocation,
      updatedBy: decodedTokenData.ua,
      updatedByObj: decodedTokenData.iss,
      updatedAt: currentUTC.currentUTCDateTime,
      updatedAtNumber: currentUTC.currentUTCDateTimeNumber,
      updatedAtString: currentUTC.currentUTCDateTimeString
    };
  } else {
    var userObj = {
      //email: reqBody.email,
      mobileNumber: reqBody.mobileNumber,
      firstName: reqBody.firstName,
      lastName: reqBody.lastName,
      displayName: reqBody.displayName,
      name: reqBody.firstName + ' ' + reqBody.lastName,
      dob: reqBody.dob ? reqBody.dob : '',
      dobNumber: reqBody.dob ? moment(reqBody.dob, 'YYYY-MM-DD').valueOf() : 0,
      //  userAccount: reqBody.userAccount,
      address: reqBody.address,
      updatedBy: decodedTokenData.ua,
      updatedByObj: decodedTokenData.iss,
      updatedAt: currentUTC.currentUTCDateTime,
      updatedAtNumber: currentUTC.currentUTCDateTimeNumber,
      updatedAtString: currentUTC.currentUTCDateTimeString
    };
  }
  return userObj;
}
// // --- End: Users Profile Service
