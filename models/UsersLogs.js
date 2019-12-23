var config = require('config');
var mongoose = require('mongoose');
var uuid = require('node-uuid');

mongoose.createConnection(config.mongoDBConnection, { useNewUrlParser: true });

var Schema = mongoose.Schema;

// Define schema for 'End User - UsersLogs' model
var euUsersLogsSchema = new Schema({
    _id: { type: String, default: uuid.v1 },
    euUserObj: { type: String, required: true, ref: config.collectionUsers }, // User Record ID(_id)
    euUserAccount: { type: String, required: true, trim: true },

    loginTime: { type: Date, required: true }, // DateTime
    loginTimeNumber: { type: Number, required: true }, // DateTime Number
    loginTimeString: { type: String, required: true }, // DateTime String
    logoutTime: { type: Date, required: false }, // DateTime
    logoutTimeNumber: { type: Number, required: false }, // DateTime Number
    logoutTimeString: { type: String, required: false }, // DateTime String
    logoutType: { type: String, required: false, trim: true }, // Own, System, Expired
    appType: { type: String, required: false, trim: true }, // Web App, Mobile App
    deviceType: { type: String, required: true, trim: true }, // Desktop, Mobile, Tab
    deviceOs: { type: String, required: false, trim: true },
    deviceId: { type: String, required: false, trim: true },
    macAddress: { type: String, required: true, trim: true },
    ipAddress: { type: String, required: true, trim: true },
    browserName: { type: String, required: false, trim: true },
    browserVersion: { type: String, required: false, trim: true },
    userAgent: { type: String, required: true, trim: true },

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

euUsersLogsSchema.index({ '$**': 'text' });


module.exports = mongoose.model(config.collectionUsersLogs, euUsersLogsSchema);
