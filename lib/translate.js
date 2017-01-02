// load translate api from .env
const translate_api = require(process.env.TranslateApiProvider);

var Translate = {
    tt: function (text, opts) {
        opts = Object.assign({from: 'auto', to: 'en'}, opts || {});
        return translate_api(text, opts)
            .then(result => {
                return {
                    success: true, 
                    text: result.text
                };
            })
            .catch(err => {
                console.log(err.stack);
                return {
                    error: true, 
                    status: 500, 
                    text: 'Something broke!'
                };
            });
    }
};

module.exports = Translate;