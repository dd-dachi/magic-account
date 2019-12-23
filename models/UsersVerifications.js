var config = require('config');
var mongoose = require('mongoose');
var uuid = require('node-uuid');
var CommonService = require('../services/CommonService');

mongoose.createConnection(config.mongoDBConnection, { useNewUrlParser: true });
var Schema = mongoose.Schema;

// Define schema for 'End User - UsersVerifications' model
var euUsersVerificationsSchema = new Schema({
    _id: { type: String, default: uuid.v1 },

    fieldType: { type: String, required: true, trim: true }, // Mobile, Email
    fieldValue: { type: String, set: CommonService.encrypt, get: CommonService.decrypt, required: true, unique: true, trim: true }, // +15123456789, example@gmail.com
    verifyStatus: { type: String, required: true, trim: true }, // Verified, Not Verified
    verifyOtp: { type: String, required: true, trim: true },
    verifyOtpSalt: { type: String, required: true, trim: true },
    notes: { type: String, required: false, trim: true },

    isDeleted: { type: Boolean, default: false },
    createdBy: { type: String, required: true, trim: true }, // userAccount
    createdByObj: { type: String, required: true, ref: config.collectionUsers }, // User Record ID(_id)
    createdAt: { type: Date, required: true }, // DateTime
    createdAtNumber: { type: Number, required: true }, // DateTime Number
    createdAtString: { type: String, required: true }, // DateTime String
    updatedBy: { type: String, required: true, trim: true }, // userAccount
    updatedByObj: { type: String, required: true, ref: config.collectionUsers }, // User Record ID(_id)
    updatedAt: { type: Date, required: true }, // DateTime
    updatedAtNumber: { type: Number, required: true }, // DateTime Number
    updatedAtString: { type: String, required: true } // DateTime String
});

euUsersVerificationsSchema.index({ '$**': 'text' });

module.exports = mongoose.model(config.collectionUsersVerifications, euUsersVerificationsSchema);
