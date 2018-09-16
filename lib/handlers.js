/*
* Request handlers
* Author: Rukshan Dangalla
* Date: 15-09-2018
*/

//Dependencies
var _data = require('./data');
var helpers = require('./helpers');

//Define the handlers
var handlers = {};

//Users
handlers.users = function (data, callback) {
    var acceptableMethods = ['post', 'get', 'put', 'delete'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._users[data.method](data, callback);
    } else {
        callback(405);
    }
};

//Container for users sub handlers
handlers._users = {};

//Users CRUD
handlers._users.post = function (data, callback) {
    //Validation
    var firstName = typeof (data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    var lastName = typeof (data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    var phone = typeof (data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
    var password = typeof (data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    var tosAgreement = typeof (data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false;

    if (firstName && lastName && phone && password && tosAgreement) {
        //Make sure that the user dosen't already exist
        _data.read('users', phone, function (err, data) {
            if (err) {
                //Hash the password
                var hashPassword = helpers.hash(password);

                if (hashPassword) {
                    //Create the user object
                    var userObject = {
                        firstName: firstName,
                        lastName: lastName,
                        phone: phone,
                        hashPassword: hashPassword,
                        tosAgreement: true
                    };

                    //Store the user
                    _data.create('users', phone, userObject, function (err) {
                        if (!err) {
                            callback(200);
                        } else {
                            callback(500, { Error: 'Could not create the new user!!' });
                        }
                    });
                } else {
                    callback(500, { Error: 'Could not hash user\'s password!!' });
                }
            } else {
                callback(400, { Error: 'A user with that phone number already exists!!' });
            }
        });
    } else {
        callback(400, { Error: 'Missing required feilds!' });
    }
};

//@TODO 
//-Only let authenticated user access their object
//-Don't let them access anyone else's object
handlers._users.get = function (data, callback) {
    //Check that the phone number is valid
    var phone = typeof (data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false;
    if (phone) {
        //Lookup the user
        _data.read('users', phone, function (err, data) {
            if (!err && data) {
                //Remove the hash password before returning the response
                delete data.hashPassword;
                callback(200, data);
            } else {
                callback(404);
            }
        });
    } else {
        callback(400, { Error: 'Missing required feilds!' })
    }
};

//@TODO 
//-Only let authenticated user update own object
//-Don't let them access anyone else's object
handlers._users.put = function (data, callback) {
    //Check that the phone number is valid
    var phone = typeof (data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;

    //Check for the optional feilds
    //==.TODO
};

handlers._users.delete = function (data, callback) {

};

//Ping handler
handlers.ping = function (data, callback) {
    callback(200);
};

//Not Found handler
handlers.notFound = function (data, callback) {
    callback(404);
};

//Export the module
module.exports = handlers;