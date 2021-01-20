const api = "https://jcob-myapi.herokuapp.com/api/";
_data = {
    handleUrl(formData, op){
        var full_url;
        switch (op) {
            case "get_articles":
                if( formData.last != "" ){ full_url = api + "articles/true" }
                else { full_url = api + "articles" }
                break;
            case "get_article_id":
                full_url = api + "article/" + formData.id
                break;
            case "get_articles_search":
                full_url = api + "search/" + formData.filter
                break;
        }

        return full_url;
    },

    getRequest(formData, op) {
        _script.loading(true);
        let url = this.handleUrl(formData, op);       
        $.ajax({
            type: "GET",
            url: url,
            data: formData,
            processData: false,
            success: function (response) {
                let renderData = {
                    url : url,
                    code : 200,
                    status : response.status,
                    body: JSON.stringify(response),
                    operation: op
                }
                _script.renderResponse(renderData);
                _script.loading(false);
                console.log({response : response, formData : formData});
            },
            error: function (err) {
                let renderData = {
                    url : url,
                    code : err.status,
                    status: err.statusText,
                    body: err.responseText,
                    operation: op
                }
                _script.renderResponse(renderData);
                _script.loading(false);
                console.log({error: err});
            }
        });
    }
}