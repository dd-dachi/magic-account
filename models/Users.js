var config = require('config');
var mongoose = require('mongoose');
var uuid = require('node-uuid');
var CommonService = require('../services/CommonService');

mongoose.createConnection(config.mongoDBConnection, { useNewUrlParser: true });
var Schema = mongoose.Schema;

// Define schema for 'End Users - Users' model
var euUserSchema = new Schema({
    _id: { type: String, default: uuid.v1 },
    userAccount: { type: String, required: true, unique: true, trim: true }, // UserID
    displayName: { type: String, required: false, trim: true, default: 'Guest' },
    firstName: { type: String, required: false, trim: true },
    lastName: { type: String, required: false, trim: true },
    name: { type: String, required: false, trim: true },
    mobileNumber: { type: String, required: false, set: CommonService.encrypt, get: CommonService.decrypt, trim: true },
    alternateMobileNumber: { type: String, required: false, set: CommonService.encrypt, get: CommonService.decrypt, trim: true },
    mbnVerifyStatus: { type: String, required: false, trim: true }, // Verified, Not Verified
    email: { type: String, required: true, set: CommonService.encrypt, get: CommonService.decrypt, unique: true, trim: true },
    alternateEmail: { type: String, required: false, set: CommonService.encrypt, get: CommonService.decrypt, trim: true },
    emailVerifyStatus: { type: String, required: false, trim: true }, // Verified, Not Verified
    userIcon: { type: String, required: false, trim: true },
    userIconOriginalName: { type: String, required: false, trim: true },
    userIconPath: { type: String, required: false, trim: true },
    deviceNotifyToken: { type: String, required: false, trim: true },
    mPin: { type: String, required: false },
    mPinSalt: { type: String, required: false },
    password: { type: String, required: false },
    passwordSalt: { type: String, required: false },
    loginKey: { type: String, required: false }, // This field is used for user social logins
    otp: { type: String, required: false },
    otpSalt: { type: String, required: false },
    expoPushTokens: { type: [String], required: false }, // Comma separated expoPushTokens to send notifications to multiple devices
    userRole: { type: String, required: true, trim: true },
    userStatus: { type: String, required: true, trim: true }, // Active, Inactive, Hold, Blocked
    signupType: { type: String, required: false, index: true, trim: true }, // Local, Google, Facebook,
    signupUserId: { type: String, required: false, index: true, trim: true, default: uuid.v1 }, // Local, Google, Facebook - Record ID

    gender: { type: String, required: false, trim: true },
    dob: { type: String, required: false, trim: true },
    dobNumber: { type: Number, required: false },
    area: { type: String, required: false, trim: true }, // Area or Village
    areaLocality: { type: String, required: false, trim: true }, // Area Locality or Mandal
    city: { type: String, required: false, trim: true }, // City or District
    state: { type: String, required: false, trim: true },
    zip: { type: String, required: false, trim: true },
    country: { type: String, required: false, trim: true },
    address: { type: String, required: false, trim: true },
    landmark: { type: String, required: false, trim: true },
    geolocation: {
        area: { type: String, required: false, trim: true },
        areaLocality: { type: String, required: false, trim: true },
        city: { type: String, required: false, trim: true },
        state: { type: String, required: false, trim: true },
        zip: { type: String, required: false, trim: true },
        country: { type: String, required: false, trim: true },
        address: { type: String, required: false, trim: true },
    },
    preferences: {
        defaultLanguage: { type: String, default: 'English', trim: true },
        defaultTimezone: { type: String, default: 'EST - Eastern Standard Time(UTC-04:00)', trim: true },
        defaultCurrency: { type: String, default: 'Krone - Danish Krone(Kr)', trim: true },
        currencyFormat: { type: String, default: '#,###.##', trim: true },
        dateFormat: { type: String, default: 'MMM DD, YY', trim: true },
        rowsPerPage: { type: String, default: '20' }
    },

    magicAccount: {
        depositBalance: { type: Number, default: 0, required: false, trim: true }, // Encrypt this data with another function in CommonService for numbers
        depositMultiplierFactor: { type: Number, default: 3, required: false, trim: true },
        multipliedBalance: { type: Number, default: 0, required: false, trim: true },
        availableBalance: {type: Number, default: 0, required: false, trim: true },
        withdrawableBalance: {type: Number, default: 0, required: false, trim: true },
        promotionBalance: {type: Number, default: 0, required: false, trim: true },
        depositUpdatedAt: { type: Date, required: false }
    },

    loginStatus: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: String, required: true, trim: true }, // userAccount
    createdByObj: { type: String, required: true }, // User Record ID(_id)
    createdAt: { type: Date, required: true }, // DateTime
    createdAtNumber: { type: Number, required: true }, // DateTime Number
    createdAtString: { type: String, required: true }, // DateTime String
    updatedBy: { type: String, required: true, trim: true }, // userAccount
    updatedByObj: { type: String, required: true }, // User Record ID(_id)
    updatedAt: { type: Date, required: true }, // DateTime
    updatedAtNumber: { type: Number, required: true }, // DateTime Number
    updatedAtString: { type: String, required: true } // DateTime String
});

euUserSchema.index({ '$**': 'text' });
euUserSchema.index({ signupType: 1, signupUserId: 1 }, { unique: true });

module.exports = mongoose.model(config.collectionUsers, euUserSchema);
