var macaddress = require('macaddress');
var requestIp = require('request-ip');
var UAParser = require('ua-parser-js');
var uuid = require('node-uuid');

var logger = require('../lib/logger');
var EU_UsersLoginDAO = require('../daos/UsersLoginDAO');
var EU_UsersLogs = require('../models/UsersLogs');
var EU_UsersProfileDAO = require('../daos/UsersProfileDAO');
var CommonService = require('./CommonService');

// --- Begin: UsersLoginService
module.exports = {

  // --- Begin userLogin: Code to handle User Login credentials
  userLogin: function(req, res, next, passport, callback) {
    // --- This is to authenticate login credentials and gives the response using passport
    passport.authenticate('eu-local-login', function(resObj) {
      try {
        if(resObj.statusCode == '1000') {
          var recordID = resObj.result._id;
          var userAccount = resObj.result.userAccount;
          CommonService.tokenGeneration(resObj.result, res, function(token) {
            if(token) {
              macaddress.one(function (err, mac) {
                setEUUserLogs(req, mac, recordID, userAccount);                
              });
              CommonService.refreshUserToken(token, res, function (tokenDecodedData) {
                EU_UsersProfileDAO.updateUserExpoTokens(tokenDecodedData.decodedTokenData, req.body.expoPushToken, function(error, data){
                  if (error) logger.error('There was an Error in services/EU-UserLoginService.js,' +
                  ' at updateUserExpoTokens function of tokenGeneration:', error);                  
                });
              });
              setLoginCallback(resObj, function(resResultObj) {
                callback(resResultObj);
              });
            } else {
              logger.error('There was an Error in services/EU-UserLoginService.js,' +
              ' at userLogin function of tokenGeneration. Unable to refresh token.');
              callback({ httpCode: 500, statusCode: '9999', result: {} });
            }
          });
        } else {
          callback(resObj);
        }
      } catch (error) {
        logger.error('There was an Un-Known Error occured in services/EU-UserLoginService.js,' +
          ' at userLogin:', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      }
    })(req, res, next);
  },
  // --- End userLogin: Code to handle User Login credentials

  userLoginStatusUpdate: function(decodedTokenData, callback) {
    var currentUTC = CommonService.currentUTCObj();
    var uUpdateObj = {
      loginStatus: true,
      updatedBy: decodedTokenData.ua,
      updatedByObj: decodedTokenData.iss,
      updatedAt: currentUTC.currentUTCDateTime,
      updatedAtNumber: currentUTC.currentUTCDateTimeNumber,
      updatedAtString: currentUTC.currentUTCDateTimeString
    }
    EU_UsersLoginDAO.userLoginStatusUpdate(decodedTokenData.iss, uUpdateObj, decodedTokenData, function(resObj) {
      callback(resObj);
    });
  },

  userIDVerification: function(userID, callback) {
    EU_UsersLoginDAO.isUserExist(userID, function(resObj) {
      if(resObj.statusCode == '0000') {
        callback({ httpCode: 200, statusCode: '0000', result: {} });
      } else {
        callback(resObj);
      }
    });
  },

  userRegistration: function(req, res, next, passport, callback) {
    passport.authenticate('eu-local-signup', function(resObj) {
      callback(resObj);
    })(req, res, next);
  }

};
// --- End: UsersLoginService

/**
 * @param {object} resObj object
 * @param {function} callback function
 */
function setLoginCallback(resObj, callback) {
  var euObj = resObj.result;
  var decObj = {
    mobileNumber: resObj.result.mobileNumber,
    email: resObj.result.email,
    alternateMobileNumber: resObj.result.alternateMobileNumber.trim(),
    alternateEmail: resObj.result.alternateEmail.trim(),
  };
  euObj['_id'] = undefined;
  euObj['deviceNotifyToken'] = undefined;
  euObj['passwordSalt'] = undefined;
  euObj['password'] = undefined;
  euObj['loginKey'] = undefined;
  euObj['otp'] = undefined;
  euObj['otpSalt'] = undefined;
  if(!euObj._id && !euObj.passwordSalt && !euObj.password && !euObj.loginKey && !euObj.otp && !euObj.otpSalt) {
    var resultObj = JSON.parse((JSON.stringify(euObj) + JSON.stringify(decObj)).replace(/}{/g, ','));
    callback({ httpCode: 200, statusCode: resObj.statusCode, result: resultObj });
  }
}

/**
* @param {object} req object
* @param {string} macAddress string
* @param {string} recordId string
* @param {string} userAccount string
*/
function setEUUserLogs(req, macAddress, recordId, userAccount) {
  var currentUTC = CommonService.currentUTCObj();
  var ua = req.headers['user-agent'];
  var parser = new UAParser();
  var deviceType = req.device.type;
  var browserName = parser.setUA(ua).getBrowser().name;
  var fullBrowserVersion = parser.setUA(ua).getBrowser().version;
  var osName = parser.setUA(ua).getOS().name;
  var userAgent = parser.setUA(ua).getUA();
  var ipAddress = requestIp.getClientIp(req);
  var userLogObj = {
    _id: uuid.v1(),
    euUserObj: recordId,
    euUserAccount: userAccount,

    loginTime: currentUTC.currentUTCDateTime,
    loginTimeNumber: currentUTC.currentUTCDateTimeNumber,
    loginTimeString: currentUTC.currentUTCDateTimeString,
    appType: req.body.appType,
    deviceType: deviceType,
    deviceOs: osName ? osName : req.body.deviceOS,
    macAddress: macAddress,
    ipAddress: ipAddress,
    browserName: browserName,
    browserVersion: fullBrowserVersion,
    userAgent: userAgent,

    isDeleted: false,
    createdBy: userAccount,
    createdByObj: recordId,
    createdAt: currentUTC.currentUTCDateTime,
    createdAtNumber: currentUTC.currentUTCDateTimeNumber,
    createdAtString: currentUTC.currentUTCDateTimeString,
    updatedBy: userAccount,
    updatedByObj: recordId,
    updatedAt: currentUTC.currentUTCDateTime,
    updatedAtNumber: currentUTC.currentUTCDateTimeNumber,
    updatedAtString: currentUTC.currentUTCDateTimeString
  };
  var postObj = new EU_UsersLogs(userLogObj);
  EU_UsersLoginDAO.setEUUserLogsData(postObj, function (resObj) {});
}
