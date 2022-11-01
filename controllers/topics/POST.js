const model = require("../model.js");
const kafka = require("../../../modules/connections/kafka.js");
const events = require("../../../modules/events/module.js");
const wait = require("../../../modules/await/module.js");

class Handler extends model {

    constructor(path, data)
    {
        super(path, data);

        this.chanel = path[0] ?? undefined;
        this.readyConnectionWait = new wait(1000, 10);
        this.readyConnectionWait.ready = false;
        events.subscribe('kafka', 'run', this.readyConnections.bind(this));
    }

    readyConnections()
    {
        this.readyConnectionWait.ready = true;
    }

    async prepare()
    {
        await this.readyConnectionWait.wait();

        return !!(typeof this.data.headers == 'object' && this.data.headers && Object.keys(this.data.headers).length > 0
            && typeof this.data.content == 'string' && this.readyConnectionWait.ready && typeof this.chanel != 'undefined' && this.chanel !== '');
    }

    async execute()
    {
        if (await this.prepare()) {

            try {
                let res = await kafka.producer.send({
                    "topic": this.chanel,
                    "messages": [
                        {
                            "headers": this.data.headers,
                            "value": this.data.content
                        },
                    ],
                });
            } catch (e) {
                console.log(e);
                return {"error" : true, "error_str" : 'error kafka producer request!', "detail" : e};
            }
        }

        return await super.execute();
    }
}

module.exports = Handler;