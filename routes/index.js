var express = require('express');
var router = express.Router();

var JefNode = require('json-easy-filter').JefNode;

const languages = require('google-translate-api/languages');

/* GET home page. */
router
    .get('/', function(req, res, next) {
        res.render('pages/index');
    })
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
