# KitBag API

[![Node.js Version][node-version-image]][node-version-url]
[![Build Status][travis-image]][travis-url]
[![Test Coverage][coveralls-image]][coveralls-url]
[![Code Quality][quality-image]][quality-url]
[![Dependencies][dependencies-image]][dependencies-url]
[![Dev Dependencies][dev-dependencies-image]][dev-dependencies-url]
[![License][license-image]][license-url]

A way of managing physical assets, their current location, maintenance and more

## Architecture

This project uses [steeplejack](http://riggerthegeek.github.io/steeplejack) as boilerplate to handle the running of the application, the routing, the IOC container and the data modelling.

There are four sections in the `/src` folder to ensure that the code is completely decoupled between the HTTP service and databases:
 1. **service**: this handle the HTTP layer. It uses [restify](http://mcavage.me/node-restify) to manage the HTTP connections, then dispatches to the various routes.  This is the highest layer.
 2. **application**: this is the main business logic.  It sits between the server layer and the data layer.  This is the middle layer.
 3. **data**: this manages datastore connections and exposes the public functions that can be used by the higher levels. This is the lower layer.
 4. **error**: the errors are common to the whole project.  These extend the steeplejack error models.
 










[node-version-image]: https://img.shields.io/badge/node.js-%3E%3D_0.10-brightgreen.svg?style=flat
[travis-image]: https://img.shields.io/travis/riggerthegeek/kitbag-api.svg?style=flat
[coveralls-image]: https://img.shields.io/coveralls/riggerthegeek/kitbag-api.svg?style=flat
[quality-image]: http://img.shields.io/codeclimate/github/riggerthegeek/kitbag-api.svg?style=flat
[dependencies-image]: http://img.shields.io/david/riggerthegeek/kitbag-api.svg?style=flat
[dev-dependencies-image]: http://img.shields.io/david/dev/riggerthegeek/kitbag-api.svg?style=flat
[license-image]: http://img.shields.io/:license-proprietary-red.svg?style=flat

[node-version-url]: http://nodejs.org/download/
[travis-url]: https://travis-ci.org/riggerthegeek/kitbag-api
[coveralls-url]: https://coveralls.io/r/riggerthegeek/kitbag-api
[quality-url]: https://codeclimate.com/github/riggerthegeek/kitbag-api
[dependencies-url]: https://david-dm.org/riggerthegeek/kitbag-api
[dev-dependencies-url]: https://david-dm.org/riggerthegeek/kitbag-api#info=devDependencies&view=table
[license-url]: https://raw.githubusercontent.com/riggerthegeek/kitbag-api/master/LICENSE
