var config = require('config');
var mongoose = require('mongoose');
var uuid = require('node-uuid');

mongoose.createConnection(config.mongoDBConnection, { useNewUrlParser: true });

var Schema = mongoose.Schema;

// Define schema for 'End Users - UsersKyc' model
var euUsersKycSchema = new Schema({
    _id: { type: String, default: uuid.v1 },
    euUserObj: { type: String, required: true, index: true, ref: config.collectionUsers }, // User Record ID(_id)
    euUserAccount: { type: String, required: true, trim: true },

    idType: { type: String, required: true, index: true, trim: true }, // Green Card, Passport, Driving License, etc...
    idNumber: { type: String, required: true, index: true, trim: true },
    nameOnId: { type: String, required: true, trim: true },
    idVerifyStatus: { type: String, required: true, trim: true }, // Verified, Inprogress, Not-Verified
    kycStatus: { type: String, required: true, trim: true }, // Active, Inactive
    kycImage: { type: String, required: true, trim: true },
    kycImageOriginalName: { type: String, required: true, trim: true },
    kycImagePath: { type: String, required: true, trim: true },

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

euUsersKycSchema.index({ '$**': 'text' });
euUsersKycSchema.index({ idType: 1, idNumber: 1 }, { unique: true });

module.exports = mongoose.model(config.collectionUsersKyc, euUsersKycSchema);
