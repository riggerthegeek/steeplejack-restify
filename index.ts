/**
 * Restify
 *
 *
 */

"use strict";


/* Node modules */
import {EventEmitter} from "events";


/* Third-party modules */
import * as _ from "lodash";
import {IServerStrategy} from "steeplejack/interfaces/serverStrategy";
import {Promise} from "es6-promise";
let restify = require("restify");
import {ValidationException} from "steeplejack/exception/validation/index";


/* Files */
import {IRestifyOpts} from "./interfaces/restifyOpts";


export class Restify extends EventEmitter implements IServerStrategy {


    /**
     * Inst
     *
     * Store of the restify instance
     *
     * {object}
     */
    protected _inst: any;


    /**
     * Constructor
     *
     * Creates an instance of the restify object, passing
     * through the same options as restify.createServer()
     * factory method.
     *
     * @param {IRestifyOpts} opts
     */
    constructor (opts: IRestifyOpts = {}) {

        super();

        this._inst = restify.createServer({
            certificate: opts.certificate,
            formatters: opts.formatters,
            handleUpgrades: opts.handleUpgrades,
            httpsServerOptions: opts.httpsServerOptions,
            key: opts.key,
            log: opts.log,
            name: opts.name,
            spdy: opts.spdy,
            version: opts.version
        });

    }


    /**
     * Accept Parser
     *
     * Makes the server use the accept parser. If
     * options are not set, it uses the default
     * restify options.  If it's strict, then it
     * must match one accept type exactly.
     *
     * Strict mode defaults to false.
     *
     * @param {string[]} options
     * @param {boolean} strict
     */
    acceptParser (options: string[] = null, strict: boolean = false) {

        if (!options) {
            options = this.getServer().acceptable;
        }

        /* Default function */
        let fn: Function = (req: any, res: any, cb: Function) => {
            restify.acceptParser(options)(req, res, cb);
        };

        if (strict) {

            fn = (req: any, res: any, cb: Function) => {

                if (options.indexOf(req.headers.accept) !== -1) {
                    /* Valid accept header */
                    cb();
                    return;
                }

                /* Uh-oh - haven't matched the accept type */
                let err = new restify.WrongAcceptError(`Server accepts: ${options.join()}`);

                res.json(err);
                cb(false);

            };

        }

        this.use(fn);

    }


    /**
     * Add Route
     *
     * Adds an individual route to the stack
     *
     * @param {string} httpMethod
     * @param {string} route
     * @param {Function|Function[]} fn
     */
    addRoute (httpMethod: string, route: string, fn: Function | Function[]) {

        /* Ensure the httpMethod set to lowercase */
        httpMethod = httpMethod.toLowerCase();

        let server = this.getServer();

        server[httpMethod](route, fn);

    }


    /**
     * After
     *
     * Set up a listener for the after event
     *
     * @param {Function} fn
     */
    after (fn: Function) {

        this.getServer().on("after", fn);

    }


    /**
     * Pre
     *
     * Set up middleware to be ran at the start
     * of the stack
     *
     * @param {Function} fn
     */
    before (fn: Function) {

        this.getServer().pre(fn);

    }


    /**
     * Body Parser
     *
     * Allows the server to receive the HTTP body.
     */
    bodyParser () {

        this.use(restify.bodyParser());

    }


    /**
     * Close
     *
     * Closes the server.
     */
    close () {

        this.getServer().close();

    }


    /**
     * Enable CORS
     *
     * Enables cross-origin resource sharing.  This should
     * be done with care as can lead to a major security
     * vulnerability.
     *
     * @link http://en.wikipedia.org/wiki/Cross-origin_resource_sharing
     * @param {string[]} origins
     * @param {string[]} addHeaders
     */
    enableCORS (origins: string[], addHeaders: string[] = []) {

        if (_.isArray(addHeaders)) {
            _.each(addHeaders, (header: string) => {
                restify.CORS.ALLOW_HEADERS.push(header);
            });
        }

        this.use(restify.CORS({
            origins
        }));

    }


    /**
     * Get Server
     *
     * Gets the server instance
     *
     * @returns {object}
     */
    getServer () {
        return this._inst;
    }


    /**
     * Get Socket Server
     *
     * Gets the socket server connector
     *
     * @returns {object}
     */
    getSocketServer () {
        return this.getServer().server;
    }


    /**
     * GZIP Response
     *
     * Sets the response to be GZIP compressed
     */
    gzipResponse () {
        this.use(restify.gzipResponse());
    }


    /**
     * Output Handler
     *
     * This handles the output.  This can be activated
     * directly or bundled up into a closure and passed
     * around.
     *
     * @param {*} err
     * @param {*} data
     * @param {object} request
     * @param {object} result
     */
    outputHandler (err: any, data: any, request: any, result: any) {

        let statusCode: Number = 200;
        let output: any;

        if (err) {

            /* Error - present an appropriate error message */
            if (err instanceof restify.RestError) {

                /* Already a RestError - use it */
                statusCode = err.statusCode;
                output = err;

            } else if (err instanceof ValidationException) {

                /* A steeplejack validation error */
                statusCode = 400;
                output = {
                    code: err.type,
                    message: err.message
                };

                if (err.hasErrors()) {
                    output.error = err.getErrors();
                }

            } else {

                /* Convert to a restify-friendly error */
                statusCode = _.isFunction(err.getHttpCode) ? err.getHttpCode() : 500;
                output = _.isFunction(err.getDetail) ? err.getDetail() : err.message;

            }

            /* Emit the error */
            this.emit("output_error", err);

        } else if (data) {

            /* Some data to display */
            if (_.isObject(data) && _.isFunction(data.getData)) {
                /* Get the data from a function */
                output = data.getData();
            } else {
                /* Just output the data */
                output = data;
            }

        } else {

            /* No data */
            statusCode = 204;

        }

        /* Display the output */
        result.send(statusCode, output);

    }


    /**
     * Query Parser
     *
     * Parses the query strings.  The mapParams option
     * allows you to decide if you want to map req.query
     * to req.params - false by default.  Returns this
     * to make it chainable.
     *
     * @param {boolean} mapParams
     */
    queryParser (mapParams: boolean = false) {

        this.use(restify.queryParser({
            mapParams
        }));

    }


    /**
     * Start
     *
     * Starts up the restify server. Wraps the
     * NodeJS HTTP.listen method
     *
     * @param {number} port
     * @param {string} hostname
     * @param {number} backlog
     * @returns {"es6-promise/dist/es6-promise".Promise}
     */
    start (port: number, hostname: string, backlog: number) : Promise<any> {

        return new Promise((resolve: Function, reject: Function) => {

            this.getServer().listen(port, hostname, backlog, (err: any, result: any) => {

                if (err) {
                    reject(err);
                    return;
                }

                resolve(result);

            });

        });

    }


    /**
     * Uncaught Exception
     *
     * Listens for an uncaught exception
     *
     * @param {Function} fn
     */
    uncaughtException (fn: Function) {

        this.getServer().on("uncaughtException", fn);

    }


    /**
     * Use
     *
     * Exposes the use method. This is to
     * add middleware functions to the stack
     *
     * @param {Function} fn
     */
    use (fn: Function | Function[]) {

        this.getServer().use(fn);

    }


}
