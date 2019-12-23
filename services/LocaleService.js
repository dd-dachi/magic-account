var config = require('config');
var fs = require('fs');
var uuid = require('node-uuid');
var CommonService = require('./CommonService');
var logger = require('../lib/logger');
var LocaleDAO = require('../daos/LocaleDAO');

// --- Begin: LocaleService
module.exports = {

  // --- Begin getContests: Code to get contests list
  getLocale: function(lang, callback) {
    LocaleDAO.getLocale(lang, function (resObj) {
      // FIXME Add deflate and inflate using zlib or similar libraries
      callback(resObj);
    });
  },
  // --- End getContests: Code to get contests list

  // --- Begin: createLocale
  createLocale: function(reqBody, decodedTokenData, callback) {
    var currentUTC = CommonService.currentUTCObj();
    var recordId = uuid.v1();
    var localeObj = setLocaleData(recordId, reqBody, currentUTC, decodedTokenData);
    LocaleDAO.createLocale(localeObj, function (resObj) {
      callback(resObj);
    });
  },
  // --- End: createLocale

  // --- Begin: updateLocale
  updateLocale: function(recordId, reqBody, decodedTokenData, callback) {
    var currentUTC = CommonService.currentUTCObj();
    var localeObj = setLocaleData(recordId, reqBody, currentUTC, decodedTokenData);
    LocaleDAO.updateLocale(recordId, localeObj, function (resObj) {
      callback(resObj);
    });
  },
  // --- End: createLocale
};
// --- End: LocaleService

/**
 * @param {object} reqBody object
 * @param {object} currentUTC object
 * @param {object} decodedTokenData object
 * @param {string} recordId string
 * @return {object} object
 */
function setLocaleData(recordId, reqBody, currentUTC, decodedTokenData) {
  return {
    _id: recordId,
    lang: reqBody.lang,
    data: JSON.stringify(reqBody.data),
    isDeleted: false,
    createdBy: decodedTokenData.ua,
    createdByObj: decodedTokenData.iss,
    createdAt: currentUTC.currentUTCDateTime,
    createdAtNumber: currentUTC.currentUTCDateTimeNumber,
    createdAtString: currentUTC.currentUTCDateTimeString,
    updatedBy: decodedTokenData.ua,
    updatedByObj: decodedTokenData.iss,
    updatedAt: currentUTC.currentUTCDateTime,
    updatedAtNumber: currentUTC.currentUTCDateTimeNumber,
    updatedAtString: currentUTC.currentUTCDateTimeString
  };
}