var fs = require('fs');
var express = require('express'),
    router = express.Router();

// require 
var JefNode = require('json-easy-filter').JefNode;
const languages = require(process.env.TranslateApiProvider+'/languages');

router
    /* GET home page. */
    .get('/', function(req, res, next) {
        res.render('pages/index');
    })
    /* GET about page. */
    .get('/about', function(req, res, next) {
        res.render('pages/about', {
            readme: require ('marked')(fs.readFileSync (__dirname+"/../README.md", 'utf8')),
        });
    })
    /* GET support page. */
    .get('/support_lang', function(req, res, next) {
        res.render('pages/support_lang', { 
            langs: new JefNode(languages).filter(function(node) {
                if (node.type()==='string') {
                    return [node.key, node.value];
                }
            })
        });
    })
    /* GET demo page. */
    .get('/demo', function(req, res, next) {
        res.render('pages/demo', { 
            langs: new JefNode(languages).filter(function(node) {
                if (node.type()==='string') {
                    return [node.key, node.value];
                }
            })
        });
    });

module.exports = router;
