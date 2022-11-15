class Model
{
    constructor(request) {
        this.instance = false;
        this.request = request;
        this.prepared = false;
        this.executed = false;
    }

    async prepare()
    {
        return true;
    }

    async execute()
    {
        if (await this.prepare() !== true)
            return this.prepare();

        return {"error" : false};
    }
}

module.exports = Model;