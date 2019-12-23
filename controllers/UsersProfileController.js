var dotenv = require('dotenv').config();
var logger = require('../lib/logger');
var utils = require('../lib/util');
var multer = require('multer');
var CommonService = require('../services/CommonService');
var UsersProfileService = require('../services/UsersProfileService');
var UsersLookupService = require('../services/UsersLookupService');

// --- Begin: UsersProfileController
module.exports.controller = function (app, passport) {

  // --- Begin '/api/v1/ma/user/deposit':
  app.put('/api/v1/ma/user/deposit', function (req, res, next) {
    if(req.headers.token && req.headers.token !== 'null') {
      if (req.body.amount < 0) utils.sendResponse(res, 400, '2004', {});
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          UsersLookupService.getUserById(tokenDecodedData.decodedTokenData, function(resObj){
            if (resObj && resObj.result){
              var userAccount = resObj.result;
              var magicAccount = userAccount.magicAccount;
              var isUserDepositWindow = true;
              // US-MA-7: User can deposit only once per day
              if (magicAccount.depositUpdatedAt) isUserDepositWindow = (new Date().toLocaleDateString() > new Date(magicAccount.depositUpdatedAt).toLocaleDateString());
              var isUserDepositAvailable = (magicAccount.depositBalance + req.body.amount) <= 500; // US-MA-6: User deposits cannot be more that 500

              // Check if any flags before updating deposit account
              if (req.body.amount != 100) utils.sendResponse(res, 400, '2000', {}); // US-MA-7: User can deposit only 100 Kr per day
              else if (!isUserDepositWindow) utils.sendResponse(res, 400, '2001', {});
              else if (!isUserDepositAvailable) utils.sendResponse(res, 400, '2002', {});
              else{
                var userUpdateObj = updateMagicAccountDeposit(userAccount, req.body.amount);
                UsersProfileService.userMagicAccountUpdate(userUpdateObj, tokenDecodedData.decodedTokenData, res, function(resObj) {
                  utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
                });
              }
            }else{
              utils.sendResponse(res, 400, '9997', {});
            }
        });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/UsersProfileController.js at put API - /api/v1/ma/user/deposit: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Un-known Error in controllers/UsersProfileController.js at put API - /api/v1/ma/user/deposit: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/UsersProfileController.js at put API - /api/v1/ma/user/deposit: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // --- End '/api/v1/ma/user/deposit'

  // --- Begin '/api/v1/ma/user/withdraw':
  app.put('/api/v1/ma/user/withdraw', function (req, res, next) {
    if(req.headers.token && req.headers.token !== 'null' && req.body.amount > 0) {
      if (req.body.amount < 0) utils.sendResponse(res, 400, '2004', {});
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          UsersLookupService.getUserById(tokenDecodedData.decodedTokenData, function(resObj){
            if (resObj && resObj.result){
              var userAccount = resObj.result;
              var magicAccount = userAccount.magicAccount;
              
              // US-MA-5: User can only withdraw money they have deposited
              var isValidWithdrawRequest = req.body.amount <= magicAccount.depositBalance;
              // Check if any flags before updating deposit account
              if (!isValidWithdrawRequest) utils.sendResponse(res, 400, '2003', {});
              else{
                var userUpdateObj = updateMagicAccountWithdraw(userAccount, req.body.amount);
                UsersProfileService.userMagicAccountUpdate(userUpdateObj, tokenDecodedData.decodedTokenData, res, function(resObj) {
                  utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
                });
              }
            }else{
              utils.sendResponse(res, 400, '9997', {});
            }
        });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/UsersProfileController.js at put API - /api/v1/ma/user/withdraw: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Un-known Error in controllers/UsersProfileController.js at put API - /api/v1/ma/user/withdraw: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/UsersProfileController.js at put API - /api/v1/ma/user/withdraw: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // --- End '/api/v1/ma/user/withdraw'

  // --- Begin '/api/v1/ma/user/balances':
  app.get('/api/v1/ma/user/balances', function (req, res, next) {
    if(req.headers.token && req.headers.token !== 'null') {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          UsersLookupService.getUserById(tokenDecodedData.decodedTokenData, function(resObj){
            if (resObj && resObj.result){
              utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result.magicAccount);
            }else{
              utils.sendResponse(res, 400, '9997', {});
            }
        });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/UsersProfileController.js at put API - /api/v1/ma/user/balances: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Un-known Error in controllers/UsersProfileController.js at put API - /api/v1/ma/user/balances: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/UsersProfileController.js at put API - /api/v1/ma/user/balances: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // --- End '/api/v1/ma/user/balances'

  // --- Begin '/api/v1/ma/user/profile':
  app.put('/api/v1/ma/user/profile', function (req, res, next) {
    if(req.headers.token && req.headers.token !== 'null') {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
            UsersProfileService.endUserProfileUpdate(req, res, tokenDecodedData.decodedTokenData, null, function(resObj) {
              utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
            });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/UsersProfileController.js at put API - /api/v1/ma/user/profile: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Un-known Error in controllers/UsersProfileController.js at put API - /api/v1/ma/user/profile: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/UsersProfileController.js at put API - /api/v1/ma/user/profile: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // --- End '/api/v1/ma/user/profile'

  // Begin -- EU Change Password
  app.put('/api/v1/ma/profile/changepassword', function (req, res, next) {
    if (req.body.currentPassword && req.body.newPassword
        && req.headers.token && req.headers.token != 'undefined') {
         CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
            if (tokenDecodedData && !tokenDecodedData.expStatus) {
                UsersProfileService.updateUserProfilePassword(req.body,
                    tokenDecodedData.decodedTokenData, function (resObj) {
                        utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
                    });
            } else if (tokenDecodedData && tokenDecodedData.expStatus) {
                logger.error('There was an Error in controllers/EU- ProfileController.js at post API -' +
                    ' /api/v1/ma/profile/changepassword: Token expired');
                utils.sendResponse(res, 400, '9995', {});
            } else {
                logger.error('There was an Error in controllers/EU- ProfileController.js at post API -' +
                    ' /api/v1/ma/profile/changepassword: Token decode failed');
                utils.sendResponse(res, 400, '9996', {});
            }
        });
    } else {
        logger.error('There was an Error in controllers/EU- ProfileController.js at post API -',
            '/api/v1/ma/profile/changepassword: Missing mandatory fields data');
        utils.sendResponse(res, 400, '9998', {});
    }
  });

  app.put('/api/v1/ma/user/profile/preference', function (req, res, next) {
    if (req.body.defaultTimezone && req.body.dateFormat && req.headers.token && req.headers.token != 'undefined') {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
            if (tokenDecodedData && !tokenDecodedData.expStatus) {
              UsersProfileService.updateUserPreferenceData(req.body,
                  tokenDecodedData.decodedTokenData, function (resObj) {
                      utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
                    });
            } else if (tokenDecodedData && tokenDecodedData.expStatus) {
                logger.error('There was an Error in controllers/UsersProfileController.js at put API -',
                    ' /api/v1/ma/user/profile/preference/: Token expired');
                utils.sendResponse(res, 400, '9995', {});
            } else {
                logger.error('There was an Un-known Error in controllers/UsersProfileController.js at put API -',
                    ' /api/v1/ma/user/profile/preference/: Token decode failed');
                utils.sendResponse(res, 400, '9996', {});
            }
        });
    } else {
        logger.error('There was an Error in controllers/UsersProfileController.js at put API -',
            ' /api/v1/ma/user/profile/preference/:id: Missing mandatory fields data');
        utils.sendResponse(res, 400, '9998', {});
    }
  });

};
// --- End: UsersProfileController

/**
 * Updates relevant magic account details of the user
 * @param {*} userAccount 
 * @param {*} depositAmount 
 */
function updateMagicAccountDeposit(userAccount, depositAmount){
  var magicAccount = userAccount.magicAccount;
  var depositBalance = magicAccount.depositBalance + depositAmount;
  var multipliedBalance = magicAccount.multipliedBalance + (depositAmount * magicAccount.depositMultiplierFactor);
  var availableBalance = multipliedBalance + magicAccount.promotionBalance;
  var updatedMagicAccount = {
    depositBalance : depositBalance,
    multipliedBalance: multipliedBalance,
    depositMultiplierFactor: magicAccount.depositMultiplierFactor,
    availableBalance: availableBalance,
    withdrawableBalance: depositBalance,
    promotionBalance: magicAccount.promotionBalance,
    depositUpdatedAt: CommonService.currentUTCObj().currentUTCDateTime
  }
  userAccount.magicAccount = updatedMagicAccount;
  return userAccount;
}

/**
 * Updates relevant magic account details of user
 * @param {*} userAccount 
 * @param {*} amount 
 */
function updateMagicAccountWithdraw(userAccount, amount){
  var magicAccount = userAccount.magicAccount;
  var depositBalance = magicAccount.depositBalance - amount;
  var multipliedBalance = magicAccount.multipliedBalance - (amount * magicAccount.depositMultiplierFactor);
  var availableBalance = multipliedBalance + magicAccount.promotionBalance;
  var updatedMagicAccount = {
    depositBalance : depositBalance,
    multipliedBalance: multipliedBalance,
    depositMultiplierFactor: magicAccount.depositMultiplierFactor,
    availableBalance: availableBalance,
    withdrawableBalance: depositBalance,
    promotionBalance: magicAccount.promotionBalance
  }
  userAccount.magicAccount = updatedMagicAccount;
  return userAccount;
}