class Post
{
    constructor(request)
    {
        this.instance = request;
        this.request = {};
    }

    async prepare()
    {
        this.request =  {
            "url" : this.instance.originalUrl ?? "",
            "path" : ((this.instance.originalUrl ?? "") + "").split("/").splice(1),
            "body" : (typeof this.instance.body == 'object' && this.instance.body) ? this.instance.body : {}
        }

        return true;
    }

    getBody()
    {
        return this.request.body;
    }

    getIndex()
    {
        return this.request.path[this.request.path.length - 1];
    }
}

module.exports = Post;