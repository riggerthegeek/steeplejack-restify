/**
 * index
 */

"use strict";


/* Node modules */
import {EventEmitter} from "events";


/* Third-party modules */
import {IServerStrategy} from "steeplejack/interfaces/serverStrategy";
let restify = require("restify");


/* Files */
import {IRestifyOpts} from "./interfaces/restifyOpts";


export class Restify extends EventEmitter implements IServerStrategy {


    protected _inst: any;


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


    acceptParser: (options: any, strict: boolean) => void;


    addRoute: (httpMethod: string, route: string, fn: Function | Function[]) => void;


    after: (fn: Function) => void;


    before: (fn: Function) => void;


    bodyParser: () => void;


    close: () => void;


    enableCORS: (origins: string[], addHeaders: string[]) => void;


    getServer: () => Object;


    gzipResponse: () => void;


    outputHandler: (err: any, data: any, request: any, result: any) => any;


    queryParser: (mapParams: boolean) => void;


    start: (port: number, hostname: string, backlog: number) => any;


    uncaughtException: (fn: Function) => void;


    use: (fn: Function | Function[]) => void;


}
