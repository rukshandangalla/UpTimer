/*
* Create and export configuration variables
* Author: Rukshan Dangalla
* Date: 15-09-2018
*/

var environments = {};

//Staging (default) environment
environments.statging = {
    httpPort: 3000,
    httpsPort: 3001,
    envName: 'statging'
};


//Production environment
environments.production = {
    httpPort: 5000,
    httpsPort: 5001,
    envName: 'production'
};

//Choose which environment to pass
var currentEnv = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

//Check the environment
var environmentToExport = typeof(environments[currentEnv]) == 'object' ? environments[currentEnv] : environments.statging;

//Export the module
module.exports = environmentToExport;