var CommonService = require('../services/CommonService');
var AuditingInfo = require('../models/AuditingInfo');

// --- Begining of AuditingInfoDAO
module.exports = {

    euAuditing: function(tokenDecodedData, actionType, collectionObj, keysValuesObj) {
        var currentUTC = CommonService.currentUTCObj();
        var euAuditObj = {
            euUserObj: tokenDecodedData.iss,
            euUserAccount: tokenDecodedData.ua,
            actionType: actionType,
            collectionName: collectionObj.name,
            collectionId: collectionObj.id,
            collectionValue: collectionObj.value,
            keysValuesObj: keysValuesObj,

            euCreatedBy: tokenDecodedData.ua,
            euCreatedByObj: tokenDecodedData.iss,
            createdAt: currentUTC.currentUTCDateTime,
            createdAtNumber: currentUTC.currentUTCDateTimeNumber,
            createdAtString: currentUTC.currentUTCDateTimeString,
            euUpdatedBy: tokenDecodedData.ua,
            euUpdatedByObj: tokenDecodedData.iss,
            updatedAt: currentUTC.currentUTCDateTime,
            updatedAtNumber: currentUTC.currentUTCDateTimeNumber,
            updatedAtString: currentUTC.currentUTCDateTimeString
        }
        new AuditingInfo(euAuditObj).save(function(err, resObj) {});
    }
}
// --- End of AuditingInfoDAO