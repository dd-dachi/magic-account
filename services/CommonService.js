var config = require('config');
var jwt = require('jwt-simple');
var moment = require('moment');

var logger = require('../lib/logger');

'use strict';
const crypto = require('crypto');

const ENCRYPTION_KEY = 'MyEncriptionKey';

module.exports = {

  // --- Begin tokenGeneration: Token Generation Code
  tokenGeneration: function(userObj, res, callback) {
    try {
      var expires = moment().add(config.loginUserExpireTime, config.loginUserExpireTimeType).valueOf();
      var payload = {
        iss: userObj._id,
        ua: userObj.userAccount,
        ue: userObj.email,
        un: userObj.name,
        umn: userObj.mobileNumber,
        ur: userObj.userRole,
        nt: userObj.deviceNotifyToken,
        uprf: userObj.preferences,
        exp: expires
      };

      var jwtToken = jwt.encode(payload, config.jwtSecretKey);
      res.header('token', jwtToken);

      callback(jwtToken);
    } catch(error) {
      logger.error('There was an Un-Known Error occured in services/CommonService.js,' +
      ' at tokenGeneration:', error);
      callback(null);
    }
  },
  // --- End tokenGeneration: Token Generation Code

  loginOTPTokenGeneration: function(eurObj, otpType, res, callback) {
    try {
      var otpExpires = moment().add(config.smsUserRegOTPExpireTime, config.smsUserRegOTPExpireTimeType).valueOf();
      var payload = {
        iss: eurObj.mobileNumber ? eurObj.mobileNumber : '',
        ise: eurObj.email ? eurObj.email : '',
        _id: eurObj._id ? eurObj._id : '',
        un: eurObj.name ? eurObj.name : '',
        ot: otpType,
        nt: eurObj.nToken ? eurObj.nToken : '',
        exp: otpExpires
      };
      var jwtToken = jwt.encode(payload, config.jwtSecretKey);
      res.header('otp_token', jwtToken);
      callback(jwtToken);
    } catch(error) {
      logger.error('There was an Un-Known Error occured in services/CommonService.js,' +
      ' at loginOTPTokenGeneration:', error);
      callback(null);
    }
  },

  refreshUserToken: function(currentToken, res, callback) {
    try {
      var currentTime = moment().valueOf();
      var expires = moment().add(config.loginUserExpireTime, config.loginUserExpireTimeType).valueOf();
      var decodedTokenData = jwt.decode(currentToken, config.jwtSecretKey);
      if(decodedTokenData.exp >= currentTime) {
        var jwtToken = jwt.encode({
          iss: decodedTokenData.iss,
          ua: decodedTokenData.ua,
          ue: decodedTokenData.ue,
          un: decodedTokenData.un,
          umn: decodedTokenData.umn,
          ur: decodedTokenData.ur,
          nt: decodedTokenData.nt,
          uprf: decodedTokenData.uprf,
          exp: expires
        }, config.jwtSecretKey);

        if (res) res.header('token', jwtToken);
        callback({'decodedTokenData': decodedTokenData, 'expStatus': false});
      } else {
        if (res) res.header('token', currentToken);
        callback({'decodedTokenData': decodedTokenData, 'expStatus': true});
      }
    } catch(error) {
      logger.error('There was an Un-Known Error occured in services/CommonService.js,' +
      ' at refreshUserToken:', error);
      callback(null);
    }
  },

  tokenExpireValidation: function(token, callback) {
    try {
      var currentTime = moment().valueOf();
      var decodedTokenData = jwt.decode(token, config.jwtSecretKey);
      if(decodedTokenData.exp >= currentTime) {
        callback({'decodedTokenData': decodedTokenData, 'expStatus': false});
      } else {
        callback({'decodedTokenData': decodedTokenData, 'expStatus': true});
      }
    } catch(error) {
      logger.error('There was an Un-Known Error occured in services/CommonService.js,' +
        ' at tokenExpireValidation: ', error);
      callback(null);
    }
  },

  /**
   * Begin saltGeneration: Salt Generation Code.
   * @param {String} length giving length of salt for password encryption.
   * @param {function} callback return callback function.
   */
  saltGeneration: function(length, callback) {
    try {
      callback(crypto.randomBytes(Math.ceil(length/2))
        .toString('hex') // convert to hexadecimal format
        .slice(0, length)); // return required number of characters
    } catch(error) {
      logger.error('There was an Un-Known Error occured in services/CommonService.js,' +
      ' at saltGeneration:', error);
      callback(config.defaultSalt);
    }
  },
  // --- End saltGeneration: Salt Generation Code.

  /**
   * Begin passwordEncryption: Pasword Encryption Code.
   * @param {String} password given password for encryption.
   * @param {String} salt given salt for encryption.
   * @param {function} callback return callback function.
   */
  passwordEncryption: function(password, salt, callback) {
    try {
      var hash = crypto.createHmac('sha512', salt); // Hashing algorithm sha512
      hash.update(password);
      var value = hash.digest('hex');
      callback({salt: salt, passwordHash: value});
    } catch(error) {
      logger.error('There was an Un-Known Error occured in services/CommonService.js,' +
      ' at passwordEncryption:', error);
      callback({salt: '', passwordHash: ''});
    }
  },
  // --- End passwordEncryption: Pasword Encryption Code.

  currentUTCObj: function() {
    // new Date(moment.utc().format('YYYY-MM-DD HH:mm:ss'));
    // var utcMoment = moment.utc().add(5, 'hours');
    var utcMoment = moment.utc();
    var currentUTCDateTimeString = utcMoment.format('YYYY-MM-DD HH:mm:ss');
    var currentUTCDateTimeNumber = moment(currentUTCDateTimeString, 'YYYY-MM-DD HH:mm:ss').valueOf();
    var currentUTCDateTime = new Date(currentUTCDateTimeString);
    return {
      'currentUTCDateTimeString': currentUTCDateTimeString,
      'currentUTCDateTimeNumber': currentUTCDateTimeNumber,
      'currentUTCDateTime': currentUTCDateTime
    };
  },

  currentUTC: function(type) {
    var utcMoment = moment.utc();
    var currentUTCDateTimeString = utcMoment.format('YYYY-MM-DD HH:mm:ss');
    switch(type) {
      case 'number':
        var currentUTCDateTimeNumber = moment(currentUTCDateTimeString, 'YYYY-MM-DD HH:mm:ss').valueOf();
        return currentUTCDateTimeNumber;
        break;
      case 'datetime':
        return currentUTCDateTimeString;
        break;
      default:
        return currentUTCDateTimeString;
        break;
    }
  },

  isJsonObjectEmpty: function(obj) {
    for(var key in obj) {
      if(obj.hasOwnProperty(key))
        return false;
    }
    return true;
  },

  orderSecureCodeGeneration: function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  },
  decrypt, encrypt
}

/**
 * @param {string} data string
 * @return {string}
 */
function encrypt(data) {
  var cipher = crypto.createCipher('aes-256-cbc', ENCRYPTION_KEY);
  var crypted = cipher.update(data, 'utf-8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
}

/**
 * @param {string} data string
 * @return {string}
 */
function decrypt(data) {
  var decipher = crypto.createDecipher('aes-256-cbc', ENCRYPTION_KEY);
  var decrypted = decipher.update(data, 'hex', 'utf-8');
  decrypted += decipher.final('utf-8');
  return decrypted;
}
