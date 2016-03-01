/**
 * index
 */

/// <reference path="../typings/main.d.ts" />

"use strict";


/* Node modules */
import {EventEmitter} from "events";


/* Third-party modules */
import * as chai from "chai";
import * as proxyquire from "proxyquire";
let restify = require("restify");
import * as sinon from "sinon";
import sinonChai = require("sinon-chai");
import {Collection} from "steeplejack/lib/collection";
import {Model} from "steeplejack/lib/model";
import {FatalException} from "steeplejack/exception/fatal";
import {ValidationException} from "steeplejack/exception/validation/index";

chai.use(sinonChai);

let expect = chai.expect;
proxyquire.noCallThru();


/* Files */
import {Restify as Original} from "../index";


class ApplicationException extends FatalException {
    public getDetail () {
        return "detail";
    }
    public getHttpCode () {
        return 409;
    }
}


describe("index test", function () {

    let Restify: any,
        acceptParserFunc: any,
        CORS: any,
        rest: any,
        restInst: any;
    beforeEach(function () {

        acceptParserFunc = sinon.spy();

        restInst = {
            acceptable: [
                "application/json",
                "text/html"
            ],
            use: sinon.spy()
        };

        rest = {
            acceptParser: sinon.stub().returns(acceptParserFunc),
            bodyParser: sinon.stub().returns("bodyParser"),
            CORS: sinon.stub().returns("CORS"),
            createServer: sinon.stub().returns(restInst),
            gzipResponse: sinon.stub().returns("gzipResponse"),
            queryParser: sinon.stub().returns("queryParser"),
            WrongAcceptError: sinon.spy()
        };

        Restify = proxyquire("../index", {
            restify: rest
        }).Restify;

    });

    describe("methods", function () {

        describe("#constructor", function () {

            it("should use the default options if no options passed in", function () {

                rest.createServer.returns("res");

                let obj = new Restify();

                expect(obj).to.be.instanceof(Restify)
                    .instanceof(EventEmitter);

                expect(rest.createServer).to.be.calledOnce
                    .calledWithExactly({
                        certificate: void 0,
                        formatters: void 0,
                        handleUpgrades: void 0,
                        httpsServerOptions: void 0,
                        key: void 0,
                        log: void 0,
                        name: void 0,
                        spdy: void 0,
                        version: void 0
                    });

                expect(obj._inst).to.be.equal("res");

            });

            it("should use the default options if blank options passed in", function () {

                rest.createServer.returns("res");

                let obj = new Restify({});

                expect(obj).to.be.instanceof(Restify)
                    .instanceof(EventEmitter);

                expect(rest.createServer).to.be.calledOnce
                    .calledWithExactly({
                        certificate: void 0,
                        formatters: void 0,
                        handleUpgrades: void 0,
                        httpsServerOptions: void 0,
                        key: void 0,
                        log: void 0,
                        name: void 0,
                        spdy: void 0,
                        version: void 0
                    });

                expect(obj._inst).to.be.equal("res");

            });

            it("should use the set options if options passed in", function () {

                rest.createServer.returns("restify");

                let obj = new Restify({
                    certificate: "certificate",
                    formatters: "formatters",
                    handleUpgrades: "handleUpgrades",
                    httpsServerOptions: "httpsServerOptions",
                    key: "key",
                    log: "log",
                    name: "name",
                    spdy: "spdy",
                    version: "version"
                });

                expect(obj).to.be.instanceof(Restify)
                    .instanceof(EventEmitter);

                expect(rest.createServer).to.be.calledOnce
                    .calledWithExactly({
                        certificate: "certificate",
                        formatters: "formatters",
                        handleUpgrades: "handleUpgrades",
                        httpsServerOptions: "httpsServerOptions",
                        key: "key",
                        log: "log",
                        name: "name",
                        spdy: "spdy",
                        version: "version"
                    });

                expect(obj._inst).to.be.equal("restify");

            });

        });

        describe("#acceptParser", function () {

            it("should receive no arguments, using the default options and not be strict", function (done: any) {

                let obj = new Restify();

                /* Inspect the use method */
                obj.use = (fn: Function) => {

                    expect(fn).to.be.a("function");

                    fn("req", "res", "cb");

                    expect(rest.acceptParser).to.be.calledOnce
                        .calledWithExactly([
                            "application/json",
                            "text/html"
                        ]);

                    expect(acceptParserFunc).to.be.calledOnce
                        .calledWithExactly("req", "res", "cb");

                    done();

                };

                expect(obj.acceptParser()).to.be.undefined;

            });

            it("should receive some options arguments", function (done: any) {

                let obj = new Restify();

                /* Inspect the use method */
                obj.use = (fn: Function) => {

                    expect(fn).to.be.a("function");

                    fn("req", "res", "cb");

                    expect(rest.acceptParser).to.be.calledOnce
                        .calledWithExactly([
                            "text/xml"
                        ]);

                    expect(acceptParserFunc).to.be.calledOnce
                        .calledWithExactly("req", "res", "cb");

                    done();

                };

                expect(obj.acceptParser([
                    "text/xml"
                ], false)).to.be.undefined;

            });

            it("should do it in strict mode, matching the accept header", function (done: any) {

                let obj = new Restify();

                /* Inspect the use method */
                obj.use = (fn: Function) => {

                    expect(fn).to.be.a("function");

                    fn({
                        headers: {
                            accept: "text/xml"
                        }
                    }, "res", (err: any, ...args: any[]) => {

                        expect(err).to.be.undefined;

                        expect(args).to.be.eql([]);

                        done();

                    });

                };

                expect(obj.acceptParser([
                    "text/xml"
                ], true)).to.be.undefined;

            });

            it("should do it in strict mode, not matching the accept header", function (done: any) {

                let obj = new Restify();

                /* Inspect the use method */
                obj.use = (fn: Function) => {

                    expect(fn).to.be.a("function");

                    let json = sinon.spy();

                    fn({
                        headers: {
                            accept: "text/html"
                        }
                    }, {
                        json: json
                    }, (err: any, ...args: any[]) => {

                        expect(err).to.be.false;

                        expect(args).to.be.eql([]);

                        expect(json).to.be.calledOnce
                            .calledWithExactly(new rest.WrongAcceptError("`Server accepts: text/xml"));

                        done();

                    });

                };

                expect(obj.acceptParser([
                    "text/xml"
                ], true)).to.be.undefined;

            });

        });

        describe("#addRoute", function () {

            beforeEach(function () {

                this.obj = new Restify();

                this.server = {
                    get: sinon.spy()
                };

                this.stub = sinon.stub(this.obj, "getServer")
                    .returns(this.server);

            });

            it("should add to the function with a lower case method", function () {

                let fn = () => {};

                expect(this.obj.addRoute("get", "/path/to/route", fn)).to.be.undefined;

                expect(this.server.get).to.be.calledOnce
                    .calledWithExactly("/path/to/route", fn);

            });

            it("should add to the function with an upper case method", function () {

                let fn = () => {};

                expect(this.obj.addRoute("GET", "/path/to/other/route", fn)).to.be.undefined;

                expect(this.server.get).to.be.calledOnce
                    .calledWithExactly("/path/to/other/route", fn);

            });

        });

        describe("#after", function () {

            it("should add listener to the after event", function () {

                let obj = new Restify();

                let spy = sinon.spy();

                let stub = sinon.stub(obj, "getServer")
                    .returns({
                        on: spy
                    });

                let fn = () => {};

                expect(obj.after(fn)).to.be.undefined;

                expect(stub).to.be.calledOnce;

                expect(spy).to.be.calledOnce
                    .calledWithExactly("after", fn);

            });

        });

        describe("#before", function () {

            it("should use the pre method", function () {

                let obj = new Restify();

                let spy = sinon.spy();

                let stub = sinon.stub(obj, "getServer")
                    .returns({
                        pre: spy
                    });

                let fn = () => {};

                expect(obj.before(fn)).to.be.undefined;

                expect(stub).to.be.calledOnce;

                expect(spy).to.be.calledOnce
                    .calledWithExactly(fn);

            });

        });

        describe("#bodyParser", function () {

            it("should use the body parser", function () {

                let obj = new Restify();

                let spy = sinon.spy(obj, "use");

                expect(obj.bodyParser()).to.be.undefined;

                expect(spy).to.be.calledOnce
                    .calledWithExactly("bodyParser");

            });

        });

        describe("#close", function () {

            it("should call the close method", function () {

                let obj = new Restify();

                let spy = sinon.spy();

                let stub = sinon.stub(obj, "getServer")
                    .returns({
                        close: spy
                    });

                expect(obj.close()).to.be.undefined;

                expect(stub).to.be.calledOnce;

                expect(spy).to.be.calledOnce
                    .calledWithExactly();

            });

        });

        describe("#enableCORS", function () {

            it("should add array of origins", function () {

                let obj = new Restify();

                let spy = sinon.spy(obj, "use");

                expect(obj.enableCORS([
                    "http://localhost:9000"
                ])).to.be.undefined;

                expect(rest.CORS).to.be.calledOnce
                    .calledWith({
                        origins: [
                            "http://localhost:9000"
                        ]
                    });

                expect(spy).to.be.calledOnce
                    .calledWithExactly("CORS");

            });

            it("should add array of origins and non-array headers", function () {

                let obj = new Restify();

                let spy = sinon.spy(obj, "use");

                expect(obj.enableCORS([
                    "http://localhost:9000"
                ], null)).to.be.undefined;

                expect(rest.CORS).to.be.calledOnce
                    .calledWith({
                        origins: [
                            "http://localhost:9000"
                        ]
                    });

                expect(spy).to.be.calledOnce
                    .calledWithExactly("CORS");

            });

            it("should add array of origins and headers", function () {

                let obj = new Restify();

                let spy = sinon.spy(obj, "use");

                (<any> rest.CORS).ALLOW_HEADERS = [];

                expect(obj.enableCORS([
                    "http://localhost:9000"
                ], [
                    "auth"
                ])).to.be.undefined;

                expect(rest.CORS).to.be.calledOnce
                    .calledWith({
                        origins: [
                            "http://localhost:9000"
                        ]
                    });

                expect(spy).to.be.calledOnce
                    .calledWithExactly("CORS");

                expect((<any> rest.CORS).ALLOW_HEADERS).to.be.eql([
                    "auth"
                ]);

            });

        });

        describe("#getServer", function () {

            it("should return the _inst", function () {

                let obj = new Restify();

                obj._inst = "hello";

                expect(obj.getServer()).to.be.equal("hello");

            });

        });

        describe("#getSocketServer", function () {

            it("should return the socket server", function () {

                let obj = new Restify();

                obj._inst = {
                    server: "server"
                };

                expect(obj.getSocketServer()).to.be.equal("server");

            });

        });

        describe("#gzipResponse", function () {

            it("should use the gzip response", function () {

                let obj = new Restify();

                let spy = sinon.spy(obj, "use");

                expect(obj.gzipResponse()).to.be.undefined;

                expect(spy).to.be.calledOnce
                    .calledWithExactly("gzipResponse");

            });

        });

        describe("#outputHandler", function () {

            let req: any,
                res: any,
                obj: any;
            beforeEach(function () {

                req = {};
                res = {
                    send: sinon.spy()
                };

                obj = new Original();

            });

            it("should simulate no response sent", function () {

                [
                    null,
                    false,
                    undefined
                ].forEach((data: any, i: number) => {

                    obj.outputHandler(null, data, req, res);

                    expect(res.send).to.be.callCount(i + 1)
                        .calledWithExactly(204, undefined);

                });

            });

            it("should simulate content sent as a steeplejack model", function () {

                class Person extends Model {

                    protected _schema () {

                        return {
                            name: {
                                type: "string"
                            }
                        };

                    }

                }

                let data = new Person({
                    name: "Rhod"
                });

                obj.outputHandler(null, data, req, res);

                expect(res.send).to.be.calledOnce
                    .calledWithExactly(200, {
                        name: "Rhod"
                    });

            });

            it("should simulate content sent as a steeplejack collection", function () {

                class Person extends Model {

                    protected _schema () {

                        return {
                            name: {
                                type: "string"
                            }
                        };

                    }


                }

                class People extends Collection {

                    protected _model () {
                        return Person;
                    }

                }


                let data = new People([{
                    name: "Rhod"
                }, {
                    name: "Bob"
                }]);

                obj.outputHandler(null, data, req, res);

                expect(res.send).to.be.calledOnce
                    .calledWithExactly(200, [{
                        name: "Rhod"
                    }, {
                        name: "Bob"
                    }]);

            });

            it("should simulate content sent", function () {

                [
                    [],
                    {},
                    "string",
                    {
                        hello: "world"
                    },
                    [
                        "hello",
                        "world"
                    ]
                ].forEach((data: any, i: number) => {

                    obj.outputHandler(null, data, req, res);

                    expect(res.send).to.be.callCount(i + 1)
                        .calledWithExactly(200, data);

                });

            });

            it("should simulate a restify error", function () {

                let err = new restify.WrongAcceptError("message");

                obj.outputHandler(err, {}, req, res);

                expect(res.send).to.be.calledOnce
                    .calledWithExactly(406, err);

            });

            it("should simulate a steeplejack error", function () {

                let err = new ApplicationException("message");

                obj.outputHandler(err, {}, req, res);

                expect(res.send).to.be.calledOnce
                    .calledWithExactly(err.getHttpCode(), err.getDetail());

            });

            it("should simulate a steeplejack validation error", function () {

                let err = new ValidationException("message2");

                obj.outputHandler(err, {}, req, res);

                expect(res.send).to.be.calledOnce
                    .calledWithExactly(400, {
                        code: "VALIDATION",
                        message: "message2"
                    });

            });

            it("should simulate a steeplejack validation error with an error", function () {

                let err = new ValidationException("message");

                err.addError("key", "value", "message");

                obj.outputHandler(err, {}, req, res);

                expect(res.send).to.be.calledOnce
                    .calledWithExactly(400, {
                        code: "VALIDATION",
                        message: "message",
                        error: {
                            key: [{
                                message: "message",
                                value: "value"
                            }]
                        }
                    });

            });

            it("should simulate an Error", function () {

                let err = new Error("message");

                obj.outputHandler(err, {}, req, res);

                expect(res.send).to.be.calledOnce
                    .calledWithExactly(500, "message");

            });

        });

        describe("#queryParser", function () {

            it("should default to not map the params", function () {

                let obj = new Restify();

                let spy = sinon.spy(obj, "use");

                expect(obj.queryParser()).to.be.undefined;

                expect(rest.queryParser).to.be.calledOnce
                    .calledWithExactly({
                        mapParams: false
                    });

                expect(spy).to.be.calledOnce
                    .calledWithExactly("queryParser");

            });

            it("should receive false", function () {

                let obj = new Restify();

                let spy = sinon.spy(obj, "use");

                expect(obj.queryParser(false)).to.be.undefined;

                expect(rest.queryParser).to.be.calledOnce
                    .calledWithExactly({
                        mapParams: false
                    });

                expect(spy).to.be.calledOnce
                    .calledWithExactly("queryParser");

            });

            it("should receive true", function () {

                let obj = new Restify();

                let spy = sinon.spy(obj, "use");

                expect(obj.queryParser(true)).to.be.undefined;

                expect(rest.queryParser).to.be.calledOnce
                    .calledWithExactly({
                        mapParams: true
                    });

                expect(spy).to.be.calledOnce
                    .calledWithExactly("queryParser");

            });

        });

        describe("#start", function () {

            it("should start the server successfully", function () {

                let obj = new Restify();

                let listen = sinon.stub()
                    .yields(null, "result");

                let stub = sinon.stub(obj, "getServer")
                    .returns({
                        listen
                    });

                return obj.start(8080, "hostname", 12345)
                    .then((res: any) => {

                        expect(res).to.be.equal("result");

                        expect(stub).to.be.calledOnce
                            .calledWithExactly();

                        expect(listen).to.be.calledOnce
                            .calledWith(8080, "hostname", 12345);

                    });

            });

            it("should fail to start the server", function () {

                let obj = new Restify();

                let listen = sinon.stub()
                    .yields("err");

                let stub = sinon.stub(obj, "getServer")
                    .returns({
                        listen
                    });

                return obj.start(9999, "address", 512)
                    .then(() => {
                        throw new Error("uh-oh");
                    })
                    .catch((err: any) => {

                        expect(err).to.be.equal("err");

                        expect(stub).to.be.calledOnce
                            .calledWithExactly();

                        expect(listen).to.be.calledOnce
                            .calledWith(9999, "address", 512);

                    });

            });

        });

        describe("#uncaughtException", function () {

            it("should add listener to the uncaughtException event", function () {

                let obj = new Restify();

                let spy = sinon.spy();

                let stub = sinon.stub(obj, "getServer")
                    .returns({
                        on: spy
                    });

                let fn = () => {};

                expect(obj.uncaughtException(fn)).to.be.undefined;

                expect(stub).to.be.calledOnce;

                expect(spy).to.be.calledOnce
                    .calledWithExactly("uncaughtException", fn);

            });

        });

        describe("#use", function () {

            it("should use the use method", function () {

                let obj = new Restify();

                let fn = () => {};

                let spy = sinon.spy();

                let stub = sinon.stub(obj, "getServer").returns({
                    use: spy
                });

                expect(obj.use(fn)).to.be.undefined;

                expect(stub).to.be.calledOnce
                    .calledWithExactly();

                expect(spy).to.be.calledOnce
                    .calledWithExactly(fn);

            });

        });

    });

});
