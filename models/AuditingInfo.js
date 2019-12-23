var config = require('config');
var mongoose = require('mongoose');
var uuid = require('node-uuid');

mongoose.createConnection(config.mongoDBConnection, { useNewUrlParser: true });

var Schema = mongoose.Schema;

// Define schema for 'End Users - AuditingInfo' model
var euAuditingInfoSchema = new Schema({
    _id: { type: String, default: uuid.v1 },
    euUserObj: { type: String, required: true, ref: config.collectionUsers }, // User Record ID(_id)
    euUserAccount: { type: String, required: true, trim: true },

    actionType: { type: String, required: true }, // Create, Update, Delete
    collectionName: { type: String, required: true },
    collectionId: { type: String, required: true },
    collectionValue: { type: String, required: true },
    keysValuesObj: { type: Object, required: true },

    isDeleted: { type: Boolean, default: false },
    euCreatedBy: { type: String, required: true, trim: true }, // userAccount
    euCreatedByObj: { type: String, required: true, ref: config.collectionUsers }, // User Record ID(_id)
    createdAt: { type: Date, required: true }, // DateTime
    createdAtNumber: { type: Number, required: true }, // DateTime Number
    createdAtString: { type: String, required: true }, // DateTime String
    euUpdatedBy: { type: String, required: true, trim: true }, // userAccount
    euUpdatedByObj: { type: String, required: true, ref: config.collectionUsers }, // User Record ID(_id)
    updatedAt: { type: Date, required: true }, // DateTime
    updatedAtNumber: { type: Number, required: true }, // DateTime Number
    updatedAtString: { type: String, required: true } // DateTime String
});

euAuditingInfoSchema.index({ '$**': 'text' });

module.exports = mongoose.model(config.collectionAuditingInfo, euAuditingInfoSchema);
