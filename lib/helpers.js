/*
* Helpers for various tasks
* Author: Rukshan Dangalla
* Date: 15-09-2018
*/

//Dependencies
var crypto = require('crypto');
var config = require('./config');

//Container for the helpers
var helpers = {};

//Create a SHA256 hash
helpers.hash = function (str) {
    if (typeof (str) == 'string' && str.length > 0) {
        var hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
        return hash;
    } else {
        return false;
    }
};

//Parse a JSON string to an object in call cases, without throwing
helpers.parseJsonToObject = function (str) {
    try {
        var obj = JSON.parse(str);
        return obj;
    } catch (err) {
        return {};
    }
};

//Export module
module.exports = helpers;