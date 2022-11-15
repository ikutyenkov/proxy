const config = require("../config.json");

class Queue
{
    constructor()
    {
        this.controller = new (require("./queue/" + config.queue.controller + ".js"))(config.queue.host, config.queue.port);
    }

    async send(title, headers, message)
    {
        return await this.controller.send(title, headers, message);
    }
}

module.exports = new Queue();