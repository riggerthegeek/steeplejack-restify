/**
 * Validation Error
 */

"use strict";


/* Node modules */
var util = require("util");


/* Third-party modules */
var steeplejack = require("steeplejack");


/* Files */



function ValidationError () {
    steeplejack.Exceptions.Validation.apply(this, arguments);
    this.httpCode = 400;
    this.type = "ValidationError";
}

util.inherits(ValidationError, steeplejack.Exceptions.Validation);

ValidationError.prototype.getDetail = function () {
    var err = {
        type: this.type,
        message: this.message
    };
    if (this.hasErrors()) {
        err.error = this.getErrors();
    }
    return err;
};

ValidationError.prototype.getHttpCode = function () {
    return this.httpCode;
};


module.exports = ValidationError;
