var config = require('config');
var fs = require('fs');
var jwt = require('jwt-simple');
var multer = require('multer');

var logger = require('../lib/logger');
var utils = require('../lib/util');
var CommonService = require('../services/CommonService');
var LocaleService = require('../services/LocaleService');

// --- Begin: LocaleController
module.exports.controller = function(app, passport) {

  // --- Begin '/api/v1/ma/locale/:lang?'
  app.get('/api/v1/ma/locale/:lang?', function(req, res, next) {
      var searchString = req.params.lang;
      LocaleService.getLocale(searchString, function(resObj) {
        utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
      });
  });
  // --- End '/api/v1/ma/locale/:lang?'

  // --- Begin '/api/v1/ma/locale/create'
  app.post('/api/v1/ma/locale/create', function(req, res, next) {
    if(req.headers.token && req.headers.token !== 'null' && req.body.lang && req.body.data) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          LocaleService.createLocale(req.body, tokenDecodedData.decodedTokenData, function(resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/LocaleController.js at get API - /api/v1/ma/locale/create: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Un-known Error in controllers/LocaleController.js at get API - /api/v1/ma/locale/create: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/LocaleController.js, at get API -' +
      '/api/v1/ma/locale/create: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // --- End '/api/v1/ma/locale/create'

  // --- Begin '/api/v1/ma/locale/update/:recordId': Update Locale object
  app.put('/api/v1/ma/locale/update/:recordId', function(req, res, next) {
    if(req.headers.token && req.headers.token !== 'null' && req.params.recordId && req.body.data) {
      CommonService.refreshUserToken(req.headers.token, res, function (tokenDecodedData) {
        if (tokenDecodedData && !tokenDecodedData.expStatus) {
          LocaleService.updateLocale(req.params.recordId, req.body, tokenDecodedData.decodedTokenData, function(resObj) {
            utils.sendResponse(res, resObj.httpCode, resObj.statusCode, resObj.result);
          });
        } else if (tokenDecodedData && tokenDecodedData.expStatus) {
          logger.error('There was an Error in controllers/LocaleController.js at put API - /api/v1/ma/eu/locale/update/:recordId: Token expired');
          utils.sendResponse(res, 400, '9995', {});
        } else {
          logger.error('There was an Un-known Error in controllers/LocaleController.js at put API - /api/v1/ma/eu/locale/update/:recordId: Token decode failed');
          utils.sendResponse(res, 400, '9996', {});
        }
      });
    } else {
      logger.error('There was an Error in controllers/LocaleController.js, at put API -' +
        '/api/v1/ma/eu/locale/update/:recordId: Missing mandatory fields data');
      utils.sendResponse(res, 400, '9998', {});
    }
  });
  // --- End '/api/v1/ma/locale/update/:recordId': Update Locale object
}
// --- End: LocaleController