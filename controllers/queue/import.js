const Post = require("../../class/post.js");
const Model = require("../model.js");
const Interface = require("../../class/interface.js");
const Queue = require("../../class/queue.js");

class Import extends Model
{
    constructor(request)
    {
        super(new Post(request));
    }

    async prepare()
    {
        if (this.prepared)
            return this.prepared;

        if (this.request.prepare()) {

            let _user = (await Interface.getInstance().getModule('auth').await('login', this.request.getBody().headers ?? {})).user ?? false;

            if (_user && typeof _user.access != 'undefined' && (_user.access.write ?? false)) {
                this.prepared = true;
            } else {
                this.prepared = {"error": true, "error_str": "access denied!"};
            }
        } else {
            this.prepared = {"error": true, "error_str": "request is incorrect"};
        }

        return this.prepared;
    }

    async execute()
    {
        if (this.executed)
            return this.executed;
        if (await this.prepare() && typeof (await this.prepare()).error == 'undefined') {
            this.executed = (await Queue.send(this.request.getIndex(), this.request.getBody().headers, this.request.getBody().content));
        } else {
            return this.prepared;
        }

        return {"error" : !(this.executed)};
    }
}

module.exports = {
    "post" : Import
};