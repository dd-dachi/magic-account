var config = require('config');
var mongoose = require('mongoose');
var uuid = require('node-uuid');

mongoose.createConnection(config.mongoDBConnection, { useNewUrlParser: true });

var Schema = mongoose.Schema;

// Define schema for 'Locale' model
var localeSchema = new Schema({
    _id: { type: String, default: uuid.v1 },

    lang: { type: String, required: true, trim: true }, // en, iw, de etc...
    data: { type: String, required: true, trim: true }, // Raw json object

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

localeSchema.index({ '$**': 'text' });

module.exports = mongoose.model(config.collectionLocale, localeSchema);