class Model {

    constructor(path, data)
    {
        this.data = {};

        if (typeof data == 'object' && data)
            this.data = data;
    }
    async prepare()
    {
        return true;
    }

    async execute()
    {
        if (await this.prepare())
            return {"error" : false};

        return {"error" : true, "error_str" : 'error prepare!'};
    }
}

module.exports = Model;