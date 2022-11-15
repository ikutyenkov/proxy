const config = require("./config.json");
const express = require('../node_modules/express');
const http = require("http");
const Interface = require("./class/interface.js");

class App
{
    constructor()
    {
        this.app = express();
        this.server = http.createServer(this.app);

        this.app.use(express.json({limit: config.body_limit}));
        this.app.use(express.urlencoded({limit: config.body_limit, extended: true}));

        this.app.use(function(req, res, next) {

            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "X-Requested-With");

            next();
        });

        this.server.listen(config.port, () => {

            console.log('listening on *:' + config.port);

            for (let i = 0; i < config.handlers.length; i++) {

                try {
                    let _handlers = require("./handlers/" + config.handlers[i] + '.js');

                    for (let _rewrite in _handlers) {

                        for (let _method in _handlers[_rewrite])
                            this.app[_method](_rewrite, this.request.bind(_handlers[_rewrite][_method]));
                    }
                } catch (e) {
                    console.log(e);
                }
            }
        });
    }

    async request(req, res, next)
    {
        let _handler = new this(req);
        let _response = await _handler.execute();

        if (typeof _response.error != 'undefined' && _response.error)
            res.status(500);

        return res.send(JSON.stringify(_response));
    }
}

module.exports = new App();