# Steeplejack Restify

[![Gitter][gitter-image]][gitter-url]
[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Node.js Version][node-version-image]][node-version-url]
[![Build Status][travis-image]][travis-url]
[![Dependencies][dependencies-image]][dependencies-url]
[![Dev Depedencies][dev-dependencies-image]][dev-dependencies-url]

[Restify](http://restify.com) strategy for [Steeplejack](http://steeplejack.info)

# Usage

In your main [Steeplejack](http://steeplejack.info) `run` method, you will need to configure your Restify strategy
like this...

```javascript
import {Restify} from "steeplejack-restify";
import {Server} from "steeplejack/lib/server";

app.run(($config) => {
    let server = new Server($config.server, new Restify());

    return server;
});
```

This is the minimal config.  The `Restify` constructor accepts all the arguments that
[createServer](http://restify.com/#creating-a-server) method does.

| Option                 | Type         | Description                                                                                                                                                                                                                                                                                                  |
|------------------------|--------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **certificate**        | String       | If you want to create an HTTPS server, pass in the path to PEM-encoded certificate and key                                                                                                                                                                                                                   |
| **key**                | String       | If you want to create an HTTPS server, pass in the path to PEM-encoded certificate and key                                                                                                                                                                                                                   |
| **formatters**         | Object       | Custom response formatters for `res.send()`                                                                                                                                                                                                                                                                  |
| **log**                | Object       | You can optionally pass in a [bunyan](https://github.com/trentm/node-bunyan) instance; not required                                                                                                                                                                                                          |
| **name**               | String       | By default, this will be set in the `Server` response header, default is `restify`                                                                                                                                                                                                                           |
| **spdy**               | Object       | Any options accepted by [node-spdy](https://github.com/indutny/node-spdy)                                                                                                                                                                                                                                    |
| **version**            | String|Array | A default version to set for all routes                                                                                                                                                                                                                                                                      |
| **handleUpgrades**     | Boolean      | Hook the `upgrade` event from the node HTTP server, pushing Connection: Upgrade requests through the regular request handling chain; defaults to `false`                                                                                                                                                     |
| **httpsServerOptions** | Object       | Any options accepted by [node-https Server](https://nodejs.org/api/https.html#https_https). If provided the following restify server options will be ignored: spdy, ca, certificate, key, passphrase, rejectUnauthorized, requestCert and ciphers; however these can all be specified on httpsServerOptions. |

# License

MIT License

[npm-image]: https://img.shields.io/npm/v/steeplejack-restify.svg?style=flat
[downloads-image]: https://img.shields.io/npm/dm/steeplejack-restify.svg?style=flat
[node-version-image]: https://img.shields.io/badge/node.js-%3E%3D_0.10-brightgreen.svg?style=flat
[travis-image]: https://img.shields.io/travis/riggerthegeek/steeplejack-restify.svg?style=flat
[dependencies-image]: https://img.shields.io/david/riggerthegeek/steeplejack-restify.svg?style=flat
[dev-dependencies-image]: https://img.shields.io/david/dev/riggerthegeek/steeplejack-restify.svg?style=flat
[gitter-image]: https://img.shields.io/badge/GITTER-JOIN%20CHAT%20%E2%86%92-1DCE73.svg?style=flat

[npm-url]: https://npmjs.org/package/steeplejack-restify
[node-version-url]: http://nodejs.org/download/
[travis-url]: https://travis-ci.org/riggerthegeek/steeplejack-restify
[downloads-url]: https://npmjs.org/package/steeplejack-restify
[dependencies-url]: https://david-dm.org/riggerthegeek/steeplejack-restify
[dev-dependencies-url]: https://david-dm.org/riggerthegeek/steeplejack-restify#info=devDependencies&view=table
[gitter-url]: https://gitter.im/riggerthegeek/steeplejack?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=body_badge
