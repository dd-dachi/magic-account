var config = require('config');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var logger = require('../lib/logger');

module.exports = {
    // --- Begin sendEMail: Code to send an email
    sendEMail: function(toUserEmail, mailSubject, htmlContent, callback) {
        // SMTP Server details
        var transporter = nodemailer.createTransport(smtpTransport({
             host: config.mailServerHost,
             port: config.mailServerPort,
             auth: {
                user: config.fromUserEmail,
                pass: config.fromUserEmailPassword
             }
        }));
        var mailOptions = {
            from: config.fromUserEmail,
            to: toUserEmail,
            subject: mailSubject,
            html: htmlContent
        };
        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                logger.error('There was an Error in config/mail.js, at sendEMail function:', error);
                return callback(error, info);
            } else {
                return callback(error, info);
            }
        });
    }
    // --- End sendEMail: Code to send an mail

};

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
