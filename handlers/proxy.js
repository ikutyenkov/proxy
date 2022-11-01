const Interface = require("../class/Interface.js");
const config = require("../config.json");
const express = require('../../node_modules/express');
const http = require("http");

class Handler
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

        this.app.all('/*', this.request.bind(this));

        this.server.listen(config.port, () => {
            Interface.trigger('server_start', {"port" : config.port});
        });
    }

    async request (req, res, next) {

        Interface.trigger('request', (req.originalUrl ?? ""));

        let _path = ((req.originalUrl ?? "") + "").split("/").splice(1);
        let _handler = this._getController(_path[0], req.method);

        if (_handler) {

            _handler = new _handler(_path.splice(1), (typeof req.body == 'object' && req.body) ? req.body : {});

            let _response = await _handler.execute();

            if (_response.error)
                res.status(500);

            Interface.trigger('executed', (req.originalUrl ?? ""));

            return res.send(JSON.stringify(_response));
        } else {

            res.status(404);
            return res.send(JSON.stringify({
                "error" : true,
                "error_str" : "Not available handler",
                "detail" : _path[0] ?? 'undefined'
            }));
        }
    }

    _getController(handler, method)
    {

        try {
            return require('../controllers/' + handler + '/' + (method ?? 'default') + '.js');
        } catch(e) {

            try {
                return require('../controllers/' + handler + '/default.js');
            } catch(e) {}
        }

        return false;
    }
}

const handler = new Handler();

module.exports = handler;