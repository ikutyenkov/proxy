const config = require("../config.json");

module.exports = new (require("../../node_modules/micro-service-interface-client"))(config.interface.host, 'proxy', config.interface.port ?? undefined);