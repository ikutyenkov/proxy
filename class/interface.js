const config = require("../config.json");

module.exports = new (require("../../node_modules/micro-service-interface-client"))('proxy', config.interface.host ?? undefined, config.interface.port ?? undefined);