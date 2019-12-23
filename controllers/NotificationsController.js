var logger = require('../lib/logger');
var utils = require('../lib/util');
var CommonService = require('../services/CommonService');
var NotificationsService = require('../services/NotificationsService');

// --- Begin: EU-NotificationsController
module.exports.controller = function(app, passport) {

  // --- Begin '/api/v1/ma/eu/user/notifications/:searchString?'
  app.get('/api/v1/ma/eu/user/notifications/:searchString?', function(req, res, next) {
    if(req.headers.token && req.headers.token !== 'null') {
      var searchString = req.params.searchString ? req.params.searchString : '';
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          NotificationsService.getUserNotifications(searchString, tokenDecodedData.decodedTokenData, function(resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/EU-NotificationsController.js at get API - /api/v1/ma/eu/user/notifications/:searchString?: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Un-known Error in controllers/EU-NotificationsController.js at get API - /api/v1/ma/eu/user/notifications/:searchString?: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/EU-NotificationsController.js, at get API -' +
        '/api/v1/ma/eu/user/notifications/:searchString?: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // --- End '/api/v1/ma/eu/user/notifications/:searchString?'

  // --- Begin '/api/v1/ma/eu/user/unread/notifications/count'
  app.get('/api/v1/ma/eu/user/unread/notifications/count', function(req, res, next) {
    if(req.headers.token && req.headers.token !== 'null') {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          NotificationsService.getUserUnreadNotificationsCount(tokenDecodedData.decodedTokenData, function(resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/EU-NotificationsController.js at get API - /api/v1/ma/eu/user/unread/notifications/count: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Un-known Error in controllers/EU-NotificationsController.js at get API - /api/v1/ma/eu/user/unread/notifications/count: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/EU-NotificationsController.js, at get API -' +
        '/api/v1/ma/eu/user/unread/notifications/count: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // --- End '/api/v1/ma/eu/user/unread/notifications/count'
}
// --- End: EU-NotificationsController
