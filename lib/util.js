var conf = require('./configuration');

var responseTemplate = {
    statusCode: '1',
    statusMessage: 'Success',
    statusResult: {}
};

exports.sendResponse = function(response, httpCode, statusCode, statusResult) {
    responseTemplate.statusCode = statusCode;
    responseTemplate.statusMessage = conf.get(statusCode);
    if (statusResult != null || !statusResult) {
        responseTemplate.statusResult = statusResult;
    } else {
        responseTemplate.statusResult = {};
    }
    response.status(httpCode).send(responseTemplate);
};

