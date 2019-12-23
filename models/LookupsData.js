var config = require('config');
var mongoose = require('mongoose');
var uuid = require('node-uuid');

mongoose.createConnection(config.mongoDBConnection, {useNewUrlParser: true});

var Schema = mongoose.Schema;

// Define schema for 'Application - LookupsData' model
var lookupsDataSchema = new Schema({
    _id: {type: String, default: uuid.v1},

    lookupType: {type: String, required: true, trim: true}, // App Specific, Universal
    lookupTypeName: {type: String, required: true, trim: true}, // DateFormats, Currencies, Timezones, etc...
    lookupCode: {type: String, required: true, trim: true}, // EST, USD, etc...
    lookupName: {type: String, required: true, trim: true}, // Eastern Standard Time, US Dollar, etc...
    lookupValue: {type: String, required: false, trim: true}, // -04:00, $, etc...
    lookupDescription: {type: String, required: true, trim: true}, // EST - Eastern Standard Time(UTC-04:00), USD - US Dollar($), etc...
    lookupStatus: {type: String, required: true, trim: true}, // Active, Inactive

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

lookupsDataSchema.index({'$**': 'text'});

module.exports = mongoose.model(config.collectionLookupsData, lookupsDataSchema);
