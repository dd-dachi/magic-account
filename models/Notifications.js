var config = require('config');
var mongoose = require('mongoose');
var uuid = require('node-uuid');

mongoose.createConnection(config.mongoDBConnection, { useNewUrlParser: true });

var Schema = mongoose.Schema;

// Define schema for 'End Users - Notifications' model
var euNotificationsSchema = new Schema({
    _id: { type: String, default: uuid.v1 },
    euUserObj: { type: String, required: true, ref: config.collectionUsers }, // User Record ID(_id)
    euUserAccount: { type: String, required: true, trim: true },

    nTitle: { type: String, required: true, trim: true },
    nMessage: { type: String, required: true, trim: true },
    nLabel: [{
        name: { type: String, required: false, trim: true },
        value: { type: String, required: false, trim: true }
    }],
    nUrl: { type: String, required: false, trim: true },
    nBody: { type: Object, required: false },
    nStatus: { type: String, required: true, trim: true }, // Read, Unread

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

euNotificationsSchema.index({ '$**': 'text' });

module.exports = mongoose.model(config.collectionNotifications, euNotificationsSchema);
