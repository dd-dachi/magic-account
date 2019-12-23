var logger = require('../lib/logger');
var utils = require('../lib/util');
var CommonService = require('../services/CommonService');
var UsersLoginService = require('../services/UsersLoginService');

// --- Begin: UsersLoginController
module.exports.controller = function(app, passport) {

  // --- Begin '/api/v1/ma/user/login': User login API to handle login authentication
  app.post('/api/v1/ma/user/login', function(req, res, next) {
    if(req.body.userID && req.body.password) {
      UsersLoginService.userLogin(req, res, next, passport, function(resObj) {
        utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
      });
    } else {
      logger.error('There was an Error in controllers/UsersLoginController.js, at post API -' +
        '/api/v1/ma/user/login: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // --- End '/api/v1/ma/user/login': User login API to handle login authentication

  // --- Begin '/api/v1/ma/user/login/status'
  app.put('/api/v1/ma/user/login/status', function(req, res, next) {
    if(req.headers.token && req.headers.token !== 'null') {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          UsersLoginService.userLoginStatusUpdate(tokenDecodedData.decodedTokenData, function(resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/UsersLoginController.js at put API - /api/v1/ma/user/login/status: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Un-known Error in controllers/UsersLoginController.js at put API - /api/v1/ma/user/login/status: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/UsersLoginController.js, at get API -' +
        ' /api/v1/ma/user/login/status: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // --- End '/api/v1/ma/user/login/status'

  // --- Begin '/api/v1/ma/user/signup/verify/userid': User ID Verification
  app.post('/api/v1/ma/user/signup/verify/userid', function(req, res, next) {
    if(req.body.userID) {
      UsersLoginService.userIDVerification(req.body.userID, function(resObj) {
        utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
      });
    } else {
      logger.error('There was an Error in controllers/UsersLoginController.js, at post API - ' +
        '/api/v1/ma/user/signup/verify/userid: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // --- End '/api/v1/ma//user/signup/verify/userid': User ID Verification

  // --- Begin '/api/v1/ma/user/signup': User Registration API
  app.post('/api/v1/ma/user/signup', function(req, res, next) {
    if(req.body.email && req.body.userID && req.body.password) {
      UsersLoginService.userRegistration(req, res, next, passport, function(resObj) {
        utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
      });
    } else {
      logger.error('There was an Error in controllers/UsersLoginController.js, at post API - ' +
        '/api/v1/ma/user/signup: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // --- End: '/api/v1/ma/user/signup': User Registration API

}
// --- End: UsersLoginController
