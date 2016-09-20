/**
 * Restify
 *
 * This is a strategy pattern for Restify for
 * use with the Steeplejack Server class.
 */

"use strict";


/* Node modules */
import {EventEmitter} from "events";


/* Third-party modules */
import * as _ from "lodash";
import {IServerStrategy} from "steeplejack/interfaces/serverStrategy";
import {Promise} from "es6-promise";
export const restifyLib = require("restify");


/* Files */
import {IRestifyOpts} from "./interfaces/restifyOpts";


/* Maps the HTTP verbs to the Restify verb */
const verbMapper = {
    "delete": "del",
    "options": "opts"
};


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
    public constructor (opts: IRestifyOpts = {}) {

        super();

        this._inst = restifyLib.createServer({
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
    public acceptParser (options: string[] = null, strict: boolean = false) {

        if (!options) {
            options = this.getServer().acceptable;
        }

        /* Default function */
        let fn: Function = (req: any, res: any, cb: Function) => {
            restifyLib.acceptParser(options)(req, res, cb);
        };

        if (strict) {

            fn = (req: any, res: any, cb: Function) => {

                if (options.indexOf(req.headers.accept) !== -1) {
                    /* Valid accept header */
                    cb();
                    return;
                }

                /* Uh-oh - haven't matched the accept type */
                let err = new restifyLib.WrongAcceptError(`Server accepts: ${options.join()}`);

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
     * @param {Function} iterator
     */
    public addRoute (httpMethod: string, route: string, iterator: (request: any, response: any) => Promise<any>) {

        /* Restify requires lower case method names */
        let method = httpMethod.toLowerCase();

        /* Replace the Steeplejack verb with the Restify verb */
        if (_.has(verbMapper, method)) {
            method = verbMapper[method];
        }

        this.getServer()[method](route, (req: any, res: any, next: Function) => {
            return iterator(req, res)
                .then(() => {
                    next();
                })
                .catch((err: any) => {
                    next(err);
                    throw err;
                });
        });

    }


    /**
     * After
     *
     * Set up a listener for the after event
     *
     * @param {Function} fn
     */
    public after (fn: Function) {

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
    public before (fn: Function) {

        this.getServer().pre(fn);

    }


    /**
     * Body Parser
     *
     * Allows the server to receive the HTTP body.
     */
    public bodyParser () {

        this.use(restifyLib.bodyParser());

    }


    /**
     * Close
     *
     * Closes the server.
     */
    public close () {

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
    public enableCORS (origins: string[], addHeaders: string[] = []) {

        if (_.isArray(addHeaders)) {
            _.each(addHeaders, (header: string) => {
                restifyLib.CORS.ALLOW_HEADERS.push(header);
            });
        }

        this.use(restifyLib.CORS({
            origins
        }));

    }


    /**
     * Get Raw Server
     *
     * Returns the raw server
     *
     * @returns {object}
     */
    getRawServer () {
        return this._inst.server;
    }


    /**
     * Get Server
     *
     * Gets the server instance
     *
     * @returns {object}
     */
    public getServer () {
        return this._inst;
    }


    /**
     * Get Socket Server
     *
     * Gets the socket server connector
     *
     * @returns {object}
     */
    public getSocketServer () {
        return this.getServer().server;
    }


    /**
     * GZIP Response
     *
     * Sets the response to be GZIP compressed
     */
    public gzipResponse () {
        this.use(restifyLib.gzipResponse());
    }


    /**
     * Output Handler
     *
     * This handles the output.  This can be activated
     * directly or bundled up into a closure and passed
     * around.
     *
     * @param {number} statusCode
     * @param {*} output
     * @param {object} request
     * @param {object} response
     */
    public outputHandler (statusCode: Number, output: any, request: any, response: any) {

        /* Display the output */
        response.send(statusCode, output);

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
    public queryParser (mapParams: boolean = false) {

        this.use(restifyLib.queryParser({
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
    public start (port: number, hostname: string, backlog: number) : Promise<any> {

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
    public uncaughtException (fn: (req: any, res: any, err: Error) => void) {

        this.getServer().on("uncaughtException", (req: any, res: any, route: any, err: Error) => {
            fn(req, res, err);
        });

    }


    /**
     * Use
     *
     * Exposes the use method. This is to
     * add middleware functions to the stack
     *
     * @param {Function} fn
     */
    public use (fn: Function | Function[]) {

        this.getServer().use(fn);

    }


}
