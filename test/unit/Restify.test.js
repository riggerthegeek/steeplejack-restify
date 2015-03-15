/**
 * Restify
 */

"use strict";


/* Node modules */


/* Third-party modules */
var chai = require("chai");
var proxyquire = require("proxyquire");
var sinon = require("sinon");

var steeplejack = require("steeplejack");

var Base = steeplejack.Base;
var Server = steeplejack.Server;


/* Files */
var ApplicationError = require("../helpers/ApplicationError");
var ValidationError = require("../helpers/ValidationError");



chai.use(require("sinon-chai"));
var expect = chai.expect;


describe("Restify test", function () {

    var Restify,
        restify,
        restifyInst;
    beforeEach(function () {

        restifyInst = {
            acceptable: ["application/json"],
            on: sinon.spy(),
            use: sinon.stub().returns(true)
        };

        restify = {
            createServer: sinon.stub().returns(restifyInst)
        };

        Restify = proxyquire("../../src/Restify", {
            restify: restify
        });

    });

    describe("Instantiation tests", function () {

        it("should extend the Server and Base classes", function () {

            var obj = new Restify({
                port: 3000,
                certificate: "certificate",
                formatters: "formatters",
                handleUpgrades: "handleUpgrades",
                key: "key",
                logger: "logger",
                name: "name",
                spdy: "spdy",
                version: "version"
            });

            expect(obj).to.be.instanceof(Restify)
                .to.be.instanceof(Server)
                .to.be.instanceof(Base);

            expect(obj._createServer).to.be.a("function");

            expect(restify.createServer).to.have.been.calledOnce
                .calledWith({
                    certificate: "certificate",
                    formatters: "formatters",
                    handleUpgrades: "handleUpgrades",
                    key: "key",
                    log: "logger",
                    name: "name",
                    spdy: "spdy",
                    version: "version"
                });

        });

    });

    describe("Methods", function () {

        var obj;
        beforeEach(function () {

            obj = new Restify({
                port: 3000
            });

            expect(obj).to.be.instanceof(Restify)
                .to.be.instanceof(Server)
                .to.be.instanceof(Base);

            obj.use = sinon.spy();

        });

        describe("#_acceptParser", function () {

            var fn;
            beforeEach(function () {

                fn = function () { };

                restify.acceptParser = sinon.stub().returns(fn);

            });

            it("should send to the use method with default options", function () {

                obj._acceptParser();

                expect(restify.acceptParser).to.be.calledOnce
                    .calledWithExactly([
                        "application/json"
                    ]);

                expect(obj.use).to.be.calledOnce
                    .calledWithExactly(fn);

            });

            it("should send to the use method with custom options", function () {

                obj._acceptParser([
                    "text/xml"
                ]);

                expect(restify.acceptParser).to.be.calledOnce
                    .calledWithExactly([
                        "text/xml"
                    ]);

                expect(obj.use).to.be.calledOnce
                    .calledWithExactly(fn);

            });

        });

        describe("#_acceptParserStrict", function () {

            beforeEach(function () {
                restifyInst.acceptable = [
                    "application/json",
                    "text/plain"
                ];
            });

            it("should use the default accepts and header.accept is one of them", function (done) {

                var req = {
                    headers: {
                        accept: "application/json"
                    }
                };
                var res = {
                    json: sinon.spy()
                };
                var cb = sinon.spy();

                obj.use = function (fn) {
                    expect(fn).to.be.a("function");

                    fn(req, res, cb);

                    expect(cb).to.be.calledOnce
                        .calledWithExactly();

                    done();

                };

                obj._acceptParserStrict();

            });

            it("should use the default accepts and header.accept is another one of them", function (done) {

                var req = {
                    headers: {
                        accept: "text/plain"
                    }
                };
                var res = {
                    json: sinon.spy()
                };
                var cb = sinon.spy();

                obj.use = function (fn) {
                    expect(fn).to.be.a("function");

                    fn(req, res, cb);

                    expect(cb).to.be.calledOnce
                        .calledWithExactly();

                    done();

                };

                obj._acceptParserStrict();

            });

            it("should use custom accepts and header.accept is one of them", function (done) {

                var req = {
                    headers: {
                        accept: "text/xml"
                    }
                };
                var res = {
                    json: sinon.spy()
                };
                var cb = sinon.spy();

                obj.use = function (fn) {
                    expect(fn).to.be.a("function");

                    fn(req, res, cb);

                    expect(cb).to.be.calledOnce
                        .calledWithExactly();

                    done();

                };

                obj._acceptParserStrict([
                    "text/xml",
                    "application/json"
                ]);

            });

            it("should use custom accepts and header.accept is another one of them", function (done) {

                var req = {
                    headers: {
                        accept: "application/json"
                    }
                };
                var res = {
                    json: sinon.spy()
                };
                var cb = sinon.spy();

                obj.use = function (fn) {
                    expect(fn).to.be.a("function");

                    fn(req, res, cb);

                    expect(cb).to.be.calledOnce
                        .calledWithExactly();

                    done();

                };

                obj._acceptParserStrict([
                    "text/xml",
                    "application/json"
                ]);

            });

            it("should use default accepts and header.accept is none of them", function (done) {

                var req = {
                    headers: {
                        accept: "text/xml"
                    }
                };
                var res = {
                    json: sinon.spy()
                };
                var cb = sinon.spy();

                obj.use = function (fn) {
                    expect(fn).to.be.a("function");

                    fn(req, res, cb);

                    expect(res.json).to.be.calledOnce
                        .calledWithMatch({
                            message: "Server accepts: application/json,text/plain",
                            statusCode: 406,
                            body: {
                                code: "NotAcceptableError",
                                message: "Server accepts: application/json,text/plain"
                            }
                        });

                    expect(cb).to.be.calledOnce
                        .calledWithExactly(false);

                    done();

                };

                obj._acceptParserStrict();

            });

            it("should use default accepts and header.accept is none of them", function (done) {

                var req = {
                    headers: {
                        accept: "text/xml"
                    }
                };
                var res = {
                    json: sinon.spy()
                };
                var cb = sinon.spy();

                obj.use = function (fn) {
                    expect(fn).to.be.a("function");

                    fn(req, res, cb);

                    expect(res.json).to.be.calledOnce
                        .calledWithMatch({
                            message: "Server accepts: text/yaml",
                            statusCode: 406,
                            body: {
                                code: "NotAcceptableError",
                                message: "Server accepts: text/yaml"
                            }
                        });

                    expect(cb).to.be.calledOnce
                        .calledWithExactly(false);

                    done();

                };

                obj._acceptParserStrict([
                    "text/yaml"
                ]);

            });

        });

        describe("#_addRoute", function () {

            var fn;
            beforeEach(function () {
                fn = function () { };

                restifyInst.get = sinon.spy();
                restifyInst.post = sinon.spy();
                restifyInst.put = sinon.spy();
                restifyInst.del = sinon.spy();
                restifyInst.head = sinon.spy();
                restifyInst.patch = sinon.spy();
            });

            it("should register a get route", function () {

                obj._addRoute("get", "/test", fn);

                expect(restifyInst.get).to.be.calledOnce
                    .calledWith("/test", fn);

                expect(restifyInst.post).to.not.be.called;
                expect(restifyInst.put).to.not.be.called;
                expect(restifyInst.del).to.not.be.called;
                expect(restifyInst.head).to.not.be.called;
                expect(restifyInst.patch).to.not.be.called;

            });

            it("should register a post route", function () {

                obj._addRoute("post", "/yay", fn);

                expect(restifyInst.post).to.be.calledOnce
                    .calledWith("/yay", fn);

                expect(restifyInst.get).to.not.be.called;
                expect(restifyInst.put).to.not.be.called;
                expect(restifyInst.del).to.not.be.called;
                expect(restifyInst.head).to.not.be.called;
                expect(restifyInst.patch).to.not.be.called;

            });

            it("should register a put route", function () {

                obj._addRoute("put", "/yay/gew", fn);

                expect(restifyInst.put).to.be.calledOnce
                    .calledWith("/yay/gew", fn);

                expect(restifyInst.get).to.not.be.called;
                expect(restifyInst.post).to.not.be.called;
                expect(restifyInst.del).to.not.be.called;
                expect(restifyInst.head).to.not.be.called;
                expect(restifyInst.patch).to.not.be.called;

            });

            it("should register a delete route", function () {

                obj._addRoute("del", "/uuuu", fn);

                expect(restifyInst.del).to.be.calledOnce
                    .calledWith("/uuuu", fn);

                expect(restifyInst.get).to.not.be.called;
                expect(restifyInst.post).to.not.be.called;
                expect(restifyInst.put).to.not.be.called;
                expect(restifyInst.head).to.not.be.called;
                expect(restifyInst.patch).to.not.be.called;

            });

            it("should register a head route", function () {

                obj._addRoute("head", "/uuuu", fn);

                expect(restifyInst.head).to.be.calledOnce
                    .calledWith("/uuuu", fn);

                expect(restifyInst.get).to.not.be.called;
                expect(restifyInst.post).to.not.be.called;
                expect(restifyInst.put).to.not.be.called;
                expect(restifyInst.del).to.not.be.called;
                expect(restifyInst.patch).to.not.be.called;

            });

            it("should register a patch route", function () {

                obj._addRoute("patch", "/uuuu", fn);

                expect(restifyInst.patch).to.be.calledOnce
                    .calledWith("/uuuu", fn);

                expect(restifyInst.get).to.not.be.called;
                expect(restifyInst.post).to.not.be.called;
                expect(restifyInst.put).to.not.be.called;
                expect(restifyInst.del).to.not.be.called;
                expect(restifyInst.head).to.not.be.called;

            });

        });

        describe("#_after", function () {

            it("should register an after listener", function () {

                var fn = function () { };

                obj._after(fn);

                expect(restifyInst.on).to.be.calledOnce
                    .calledWithExactly("after", fn);

            });

        });

        describe("#_bodyParser", function () {

            it("should register the restify bodyParser method", function () {

                var fn = function () { };

                restify.bodyParser = sinon.stub().returns(fn);
                obj.use = sinon.stub().returns(true);

                expect(obj._bodyParser()).to.be.true;

                expect(obj.use).to.be.calledOnce
                    .calledWithExactly(fn);

            });

        });

        describe("#_close", function () {

            it("should send a close request to the server", function () {

                restifyInst.close = sinon.spy();

                obj._close();

                expect(restifyInst.close).to.be.calledOnce
                    .calledWithExactly();

            });

        });

        describe("#_enableCORS", function () {

            it("should add array of origins", function () {

                var fn = function () { };

                fn.ALLOW_HEADERS = [];

                restify.CORS = sinon.stub().returns(fn);
                obj.use = sinon.stub().returns(true);

                var origins = [
                    "http://localhost:9000"
                ];

                expect(obj._enableCORS(origins)).to.be.true;

                expect(restify.CORS).to.be.calledOnce
                    .calledWithExactly({
                        origins: origins
                    });

                expect(obj.use).to.be.calledOnce
                    .calledWithExactly(fn);

            });

            it("should add array of origins and headers", function () {

                var fn = function () { };

                restify.CORS = sinon.stub().returns(fn);
                restify.CORS.ALLOW_HEADERS = [];

                obj.use = sinon.stub().returns(true);

                var origins = [
                    "http://localhost:9000"
                ];
                var addHeaders = [
                    "auth"
                ];

                expect(obj._enableCORS(origins, addHeaders)).to.be.true;

                expect(restify.CORS).to.be.calledOnce
                    .calledWithExactly({
                        origins: origins
                    });

                expect(restify.CORS.ALLOW_HEADERS).to.be.eql([
                    "auth"
                ]);

                expect(obj.use).to.be.calledOnce
                    .calledWithExactly(fn);

            });

        });

        describe("#_gzipResponse", function () {

            it("should register the restify gzipResponse method", function () {

                var fn = function () { };

                restify.gzipResponse = sinon.stub().returns(fn);
                obj.use = sinon.stub().returns(true);

                expect(obj._gzipResponse()).to.be.true;

                expect(obj.use).to.be.calledOnce
                    .calledWithExactly(fn);

            });

        });

        describe("#_outputHandler", function () {

            var req,
                res;
            beforeEach(function () {
                req = {};
                res = {
                    send: sinon.spy()
                };
            });

            it("should simulate no content sent", function () {

                [
                    null,
                    false,
                    undefined
                ].forEach(function (data, i) {
                        obj._outputHandler(null, data, req, res);

                        expect(res.send).to.be.callCount(i + 1)
                            .calledWithExactly(204, undefined);
                    });

            });

            it("should simulate content sent as a steeplejack model", function () {

                var Model = steeplejack.Model.extend({
                    definition: {
                        name: {
                            type: "string"
                        }
                    }
                });

                var data = new Model({
                    name: "Rhod"
                });

                obj._outputHandler(null, data, req, res);

                expect(res.send).to.be.calledOnce
                    .calledWithExactly(200, {
                        name: "Rhod"
                    });

            });

            it("should simulate content sent as a steeplejack collection", function () {

                var Model = steeplejack.Model.extend({
                    definition: {
                        name: {
                            type: "string"
                        }
                    }
                });

                var Collection = steeplejack.Collection.extend({
                    model: Model
                });


                var data = new Collection([{
                    name: "Rhod"
                }, {
                    name: "Bob"
                }]);

                obj._outputHandler(null, data, req, res);

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
                ].forEach(function (data, i) {
                        obj._outputHandler(null, data, req, res);

                        expect(res.send).to.be.callCount(i + 1)
                            .calledWithExactly(200, data);
                    });

            });

            it("should simulate a restify error", function (done) {

                var err = new restify.WrongAcceptError("message");

                obj.on("error", function (error) {
                    expect(error).to.be.equal(err);

                    done();
                });

                obj._outputHandler(err, {}, req, res);

                expect(res.send).to.be.calledOnce
                    .calledWithExactly(406, err);

            });

            it("should simulate a steeplejack error", function (done) {

                var err = new ApplicationError("message");

                obj.on("error", function (error) {
                    expect(error).to.be.equal(err);

                    done();
                });

                obj._outputHandler(err, {}, req, res);

                expect(res.send).to.be.calledOnce
                    .calledWithExactly(err.getHttpCode(), err.getDetail());

            });

            it("should simulate a steeplejack validation error", function (done) {

                var err = new ValidationError("message");

                obj.on("error", function (error) {
                    expect(error).to.be.equal(err);

                    done();
                });

                obj._outputHandler(err, {}, req, res);

                expect(res.send).to.be.calledOnce
                    .calledWithExactly(err.getHttpCode(), {
                        code: "ValidationError",
                        message: "message"
                    });

            });

            it("should simulate a steeplejack validation error with an error", function (done) {

                var err = new ValidationError("message");
                err.addError("key", "value", "message");

                obj.on("error", function (error) {
                    expect(error).to.be.equal(err);

                    done();
                });

                obj._outputHandler(err, {}, req, res);

                expect(res.send).to.be.calledOnce
                    .calledWithExactly(err.getHttpCode(), {
                        code: "ValidationError",
                        message: "message",
                        error: {
                            key: [{
                                message: "message",
                                value: "value"
                            }]
                        }
                    });

            });

            it("should simulate an Error", function (done) {

                var err = new Error("message");

                obj.on("error", function (error) {
                    expect(error).to.be.equal(err);

                    done();
                });

                obj._outputHandler(err, {}, req, res);

                expect(res.send).to.be.calledOnce
                    .calledWithExactly(500, err);

            });

        });

        describe("#_pre", function () {

            it("should defer to the restifyInst pre method", function () {

                var fn = function () { };

                restifyInst.pre = sinon.spy();

                obj._pre(fn);

                expect(restifyInst.pre).to.be.calledOnce
                    .calledWithExactly(fn);

            });

        });

        describe("#_queryParser", function () {

            it("should send the query parser to the use method - mapParams = false", function () {

                var fn = function () { };

                restify.queryParser = sinon.stub().returns(fn);

                obj.use = sinon.stub().returns(true);

                expect(obj._queryParser(false)).to.be.true;

                expect(restify.queryParser).to.be.calledOnce
                    .calledWithExactly({
                        mapParams: false
                    });

                expect(obj.use).to.be.calledOnce
                    .calledWithExactly(fn);

            });

        });

        describe("#_start", function () {

            it("should start the server on the port specified", function () {

                var cb = function () { };

                restifyInst.listen = sinon.stub().returns(true);

                expect(obj._start(3000, "156.24.34.22", 510, cb)).to.be.true;

                expect(restifyInst.listen).to.be.calledOnce
                    .calledWithExactly(3000, "156.24.34.22", 510, cb);

            });

        });

        describe("#_uncaughtException", function () {

            it("should add uncaughtException listener", function () {

                restifyInst.on = sinon.stub().returns(true);

                var fn = function () { };

                expect(obj._uncaughtException(fn)).to.be.true;

                expect(restifyInst.on).to.be.calledOnce
                    .calledWithExactly("uncaughtException", fn);

            });

        });

        describe("#_use", function () {

            it("should send a function to the restify use method", function () {

                var fn = function () { };

                expect(obj._use(fn)).to.be.true;

                expect(restifyInst.use).to.be.calledOnce
                    .calledWithExactly(fn);

            });

        });

    });

});
