var config = require('config');
var LocalStrategy = require('passport-local').Strategy;
var uuid = require('node-uuid');

var lookupsData = require('./lookupsData');
var UsersLoginDAO = require('../daos/UsersLoginDAO');
var logger = require('../lib/logger');
var CommonService = require('../services/CommonService');

// --- Begining of passport
module.exports = function(passport) {

  passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

// END USER LOCAL LOGIN =============================================================
  passport.use('eu-local-login', new LocalStrategy({
    usernameField: 'userID',
    passwordField: 'password',
    passReqToCallback: true
  }, function(req, userID, password, callback) {
    try {
      UsersLoginDAO.isUserExist(userID, function(resObj) {
        if(resObj.statusCode == '0000') {
          var userObj = resObj.result;
          if(userObj.userStatus == lookupsData.userStatuses.active && userObj.password && userObj.passwordSalt) {
            CommonService.passwordEncryption(password, userObj.passwordSalt, function(passwordObj) {
              if(passwordObj && passwordObj.passwordHash && passwordObj.passwordHash == userObj.password) {
                callback({ httpCode: 200, statusCode: '1000', result: userObj });
              } else {
                callback({ httpCode: 400, statusCode: '9950', result: {} });
              }
            });
          } else if(userObj.userStatus == lookupsData.userStatuses.inactive) {
            callback({ httpCode: 400, statusCode: '9951', result: {} });
          } else if(userObj.userStatus == lookupsData.userStatuses.blocked) {
            callback({ httpCode: 400, statusCode: '9952', result: {} });
          } else {
            callback({ httpCode: 400, statusCode: '9950', result: {} });
          }
        } else {
          callback(resObj);
        }
      });
    } catch(error) {
      logger.error('There was an Un-Known Error occured in config/passport.js,' +
      ' at Local Login:', error);
      callback({ httpCode: 500, statusCode: '9999', result: {} });
    }
  }));

// END USER LOCAL REGISTRATION =============================================================
  passport.use('eu-local-signup', new LocalStrategy({
    usernameField: 'userID',
    passwordField: 'password',
    passReqToCallback: true
  }, function(req, userID, password, callback) {
    try {
      setEndUserPassword(password, function(passwordObj){
        var userObj = setEndUserRegistrationData(req.body, passwordObj);
        UsersLoginDAO.userRegistration(userObj, function(resObj) {
          callback(resObj);
        });
      });
    } catch(error) {
      logger.error('There was an Un-Known Error occured in config/passport.js,' +
      ' at Local Signup/Registration:', error);
      callback({ httpCode: 500, statusCode: '9999', result: {} });
    }
  }));

}

/**
 * @param {string} password
 * @param {function} callback
 */
function setEndUserPassword(password, callback) {
  CommonService.saltGeneration(config.saltSize, function(salt) {
    CommonService.passwordEncryption(password, salt, function(passwordObj) {
      callback(passwordObj);
    });
  });
}

/**
 * @param {object} reqBody
 * @param {object} passwordObj
 * @returns {object}
 */
function setEndUserRegistrationData(reqBody, passwordObj) {
  var currentUTC = CommonService.currentUTCObj();
  const _id = uuid.v1();
  return {
    _id: _id,
    userAccount: reqBody.userID,
    displayName: reqBody.userID,
    firstName: reqBody.firstName,
    lastName: reqBody.lastName,
    name: reqBody.firstName + " " + reqBody.lastName,
    mobileNumber: reqBody.mobileNumber,
    alternateMobileNumber: ' ',
    mbnVerifyStatus: 'Not Verified',
    email: reqBody.email,
    alternateEmail: ' ',
    emailVerifyStatus: 'Not Verified',
    password: passwordObj.passwordHash,
    passwordSalt: passwordObj.salt,
    userRole: 'End User',
    userStatus: 'Active',
    signupType: 'Local',
    signupUserId: _id,
    isDeleted: false,
    // magicAccount:{
    //   // depositUpdatedAt: currentUTC.currentUTCDateTime,
    // },
    createdBy: reqBody.userID,
    createdByObj: _id,
    createdAt: currentUTC.currentUTCDateTime,
    createdAtNumber: currentUTC.currentUTCDateTimeNumber,
    createdAtString: currentUTC.currentUTCDateTimeString,
    updatedBy: reqBody.userID,
    updatedByObj: _id,
    updatedAt: currentUTC.currentUTCDateTime,
    updatedAtNumber: currentUTC.currentUTCDateTimeNumber,
    updatedAtString: currentUTC.currentUTCDateTimeString
  }
}
