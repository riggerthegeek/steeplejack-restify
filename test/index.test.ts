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
import * as sinon from "sinon";
import sinonChai = require("sinon-chai");

chai.use(sinonChai);

let expect = chai.expect;
proxyquire.noCallThru();


/* Files */


describe("index test", function () {

    let Restify: any,
        rest: any;
    beforeEach(function () {

        rest = {
            createServer: sinon.stub()
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

    });

});
