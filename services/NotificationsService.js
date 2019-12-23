var EU_NotificationsDAO = require('../daos/NotificationsDAO');

// --- Begin: EU-NService
module.exports = {

  // --- Begin: getUserNotifications
  getUserNotifications: function(searchString, decodedTokenData, callback) {
    EU_NotificationsDAO.getUserNotifications(searchString, decodedTokenData, function (resObj) {
      callback(resObj);
    });
  },
  // --- End: getUserNotifications

  // --- Begin: getUserUnreadNotificationsCount
  getUserUnreadNotificationsCount: function(decodedTokenData, callback) {
    EU_NotificationsDAO.getUserUnreadNotificationsCount(decodedTokenData, function (resObj) {
      callback(resObj);
    });
  }
  // --- End: getUserUnreadNotificationsCount
}
