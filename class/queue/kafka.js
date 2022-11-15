const { Kafka } = require('../../../node_modules/kafkajs');

class Queue
{
    constructor(host, port)
    {
        this._host = host;
        this._port = port;
        this.initiate = false;
    }

    async init()
    {

        if (this.initiate)
            return this.initiate;

        this.connection = new Kafka({
            "clientId": "proxy_" + Math.floor(Math.random() * 9999),
            "brokers": [this._host + (typeof this._port != 'undefined' ? ':' + this._port : '')]
        });

        this.producer = await this.connection.producer();
        await this.producer.connect();

        this.initiate = true;

        return this.initiate;
    }

    async send(title, headers, message)
    {
        if (await this.init()) {

            try {

                return await this.producer.send({
                    "topic": title,
                    "messages": [
                        {
                            "headers": headers ?? {},
                            "value": (typeof message == 'object' ? JSON.stringify(message) : message)
                        },
                    ],
                });
            } catch (e) {
                console.log(e);
            }
        }

        return false;
    }
}

module.exports = Queue;
