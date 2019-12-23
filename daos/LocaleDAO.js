var config = require('config');
var logger = require('../lib/logger');
var AuditingInfoDAO = require('../daos/AuditingInfoDAO');
var Locale = require('../models/Locale');

// --- Begin: LocaleDAO
module.exports = {

  getLocale: function(lang, callback){
    Locale.findOne({lang: lang, isDeleted: false}).exec(function(error, resObj) {
      if(error) {
        logger.error('There was an Un-known Error occured in daos/LocaleDAO.js,' +
          ' at getLocale:', error);
        callback({ httpCode: 500, statusCode: '9999', result: [] });
      } else if(resObj) {
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        callback({ httpCode: 400, statusCode: '9997', result: [] });
      }
    });
  },

  // --- Begin: createLocale
  createLocale: function(localeObj, callback) {
    new Locale(localeObj).save(function(error, resObj) {
      if(error) {
        logger.error('There was an Un-known Error occured in daos/LocaleDAO.js, at createLocale:', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if(resObj && resObj._id) {
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        logger.error('There was an Error occured in daos/LocaleDAO.js, at createLocale:', error);
        callback({ httpCode: 400, statusCode: '9993', result: {} });
      }
    });
  },
  // --- End: createLocale 

  // --- Start: updateLocale 
  updateLocale: function(recordId, localeObj, callback){
    Locale.findOneAndUpdate({'_id': recordId}, localeObj, {new: false}).exec(function(error, resObj) {
      if(error) {
        logger.error('There was an Un-known Error occured in daos/LocaleDAO.js,' +
        ' at updateLocale:', error);
        callback({ httpCode: 500, statusCode: '9999', result: {} });
      } else if(resObj) {
        var collectionObj = { name: config.collectionEUUsers, id: resObj._id, value: resObj.userAccount };
        AuditingInfoDAO.euAuditing(decodedTokenData, config.auditAction.update, collectionObj, localeObj);
        callback({ httpCode: 200, statusCode: '0000', result: resObj });
      } else {
        logger.error('There was an Error occured in daos/LocaleDAO.js, at updateLocale:', error);
        callback({ httpCode: 400, statusCode: '9992', result: {} });
      }
    });
  }
  // --- End: updateLocale 

};
// --- End: LocaleDAO
