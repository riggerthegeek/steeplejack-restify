/**
 * Restify
 *
 * A factory to build an instance of the Restify
 * framework.
 */

"use strict";


/* Node modules */


/* Third-party modules */
var _ = require("lodash");
var restify = require("restify");
var steeplejack = require("steeplejack");

var datatypes = steeplejack.Base.datatypes;
var Server = steeplejack.Server;


/* Files */


module.exports = Server.extend({


    /**
     * Create Server
     *
     * Returns an instance of the server object
     *
     * @param {object} options
     * @returns {object}
     * @private
     */
    _createServer: function (options) {

        /* Create instance of the server */
        return restify.createServer({
            certificate: options.certificate,
            formatters: options.formatters,
            handleUpgrades: options.handleUpgrades,
            key: options.key,
            log: options.logger,
            name: options.name,
            spdy: options.spdy,
            version: options.version
        });

    },


    /**
     * Accept Parser
     *
     * Makes the server use the accept parse.  If
     * options are not an array, uses the default
     * restify options.  Returns this to make the
     * method chainable.
     *
     * @param options
     * @returns {exports}
     * @private
     */
    _acceptParser: function (options) {
        options = datatypes.setArray(options, this.getServer().acceptable);

        return this.use(restify.acceptParser(options));
    },


    /**
     * Accept Parser Strict
     *
     * This is identical to the acceptParser method, except
     * that the accept header must have the accept header
     * exactly.  There is no coercion around the mime type.
     *
     * @param options
     * @returns {exports}
     * @private
     */
    _acceptParserStrict: function (options) {
        options = datatypes.setArray(options, this.getServer().acceptable);

        return this.use(function (req, res, cb) {

            if (options.indexOf(req.headers.accept) !== -1) {
                /* Valid accept header */
                cb();
                return;
            }

            /* Uh-oh - problem */
            var err = new restify.NotAcceptableError("Server accepts: " + options.join());

            res.json(err);
            cb(false);

        });

    },


    /**
     * Add Route
     *
     * Adds an individual route to the stack
     *
     * @param {string} httpMethod
     * @param {string} route
     * @param {function} fn
     * @private
     */
    _addRoute: function (httpMethod, route, fn) {
        var server = this.getServer();

        server[httpMethod](route, fn);
    },


    /**
     * After
     *
     * Set up a listener for the after event
     *
     * @param fn
     * @private
     */
    _after: function (fn) {
        this.getServer().on("after", fn);
    },


    /**
     * Body Parser
     *
     * Allows the server to receive the HTTP body. Returns
     * this to make it chainable.
     *
     * @returns {exports}
     * @private
     */
    _bodyParser: function () {
        return this.use(restify.bodyParser());
    },


    /**
     * Close
     *
     * Closes the server
     *
     * @returns {void|*}
     * @private
     */
    _close: function () {
        return this.getServer().close();
    },


    /**
     * Enable CORS
     *
     * Enables cross-origin resource sharing.  This should
     * be done with care as can lead to a major security
     * vulnerability.
     *
     * @link http://en.wikipedia.org/wiki/Cross-origin_resource_sharing
     * @param {array} origins
     * @param {array} addHeaders
     * @returns {exports}
     */
    _enableCORS: function (origins, addHeaders) {

        if (addHeaders instanceof Array) {
            addHeaders.forEach(function (header) {
                restify.CORS.ALLOW_HEADERS.push(header);
            });
        }

        return this.use(restify.CORS({
            origins: origins
        }));
    },


    /**
     * GZIP Response
     *
     * Makes the response GZIP compressed.  Returns
     * this to make it chainable.
     *
     * @returns {exports}
     * @private
     */
    _gzipResponse: function () {
        return this.use(restify.gzipResponse());
    },



    /**
     * Output Handler
     *
     * This handles the output.  This can be activated
     * directly or bundled up into a closure and passed
     * around.
     *
     * @param {object} err
     * @param {object} data
     * @param {object} req
     * @param {object} res
     * @private
     */
    _outputHandler: function (err, data, req, res) {

        var statusCode = 200;
        var output;

        if (err) {

            /* Convert to a Restify error and process */
            if (err instanceof restify.RestError) {

                /* Already a RestError - use it */
                statusCode = err.statusCode;
                output = err;

            } else if (err instanceof steeplejack.Exceptions.Validation) {

                /* A steeplejack validation error */
                statusCode = 400;
                output = {
                    code: err.getType(),
                    message: err.getMessage()
                };

                if (err.hasErrors()) {
                    output.error = err.getErrors();
                }

            } else {

                /* Convert to a restify-friendly error */
                statusCode = _.isFunction(err.getHttpCode) ? err.getHttpCode() : 500;
                output = _.isFunction(err.getDetail) ? err.getDetail() : err;

            }

            /* Emit the error */
            this.emit("error", err);

        } else if (data) {
            /* Success */

            if (data instanceof steeplejack.Collection) {
                output = data.toJSON();
            } else if (data instanceof steeplejack.Model) {
                output = data.toObject();
            } else {
                output = data;
            }
        } else {
            /* No content */
            statusCode = 204;
        }

        /* Push the output */
        res.send(statusCode, output);

    },


    /**
     * Pre
     *
     * Set up middleware to be ran at the start
     * of the stack.
     *
     * @param fn
     * @private
     */
    _pre: function (fn) {
        this.getServer().pre(fn);
    },


    /**
     * Query Parser
     *
     * Parses the query strings.  The mapParams option
     * allows you to decide if you want to map req.query
     * to req.params - false by default.  Returns this
     * to make it chainable.
     *
     * @param {boolean} mapParams
     * @returns {exports}
     * @private
     */
    _queryParser: function (mapParams) {
        return this.use(restify.queryParser({
            mapParams: mapParams
        }));
    },


    /**
     * Start
     *
     * Starts up the restify server
     *
     * @param {number} port
     * @param {string} ip
     * @param {number} backlog
     * @param {function} cb
     * @returns {*}
     * @private
     */
    _start: function (port, ip, backlog, cb) {
        return this.getServer().listen(port, ip, backlog, cb);
    },


    /**
     * Uncaught Exception
     *
     * Listen to uncaught exceptions
     *
     * @param {function} fn
     * @returns {*}
     * @private
     */
    _uncaughtException: function (fn) {
        return this.getServer().on("uncaughtException", fn);
    },


    /**
     * Use
     *
     * Exposes the use method on the server.
     *
     * @param {function} fn
     * @returns {exports}
     * @private
     */
    _use: function (fn) {
        return this.getServer().use(fn);
    }


});
