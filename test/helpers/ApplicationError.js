/**
 * Application Error
 */

"use strict";


/* Node modules */
var util = require("util");


/* Third-party modules */
var steeplejack = require("steeplejack");


/* Files */


function ApplicationError (message) {
    steeplejack.Exceptions.Fatal.apply(this, arguments);
    this.httpCode = 500;
    this.type = "ApplicationError";
}

util.inherits(ApplicationError, steeplejack.Exceptions.Fatal);

ApplicationError.prototype.getDetail = function () {
    return {
        type: this.type,
        message: this.message
    };
};

ApplicationError.prototype.getHttpCode = function () {
    return this.httpCode;
};


module.exports = ApplicationError;
