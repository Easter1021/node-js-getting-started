/** 
 * this is translate core and api document.
 * api doc produce....
 * $ npm install apidoc -g
 * $ apidoc -i routes/api -o public/document/v1
 */

/**
 * @api {get} /translate translate text
 * @apiName get
 * @apiGroup Translate
 * @apiVersion 0.1.0
 *
 * @apiParam {String} text origin content
 * @apiParam {String} [from=auto] origin country code, see <a href="/support_lang" target="_blank">language list</a>
 * @apiParam {String} [to=en] target country code, see <a href="/support_lang" target="_blank">language list</a>
 *
 * @apiParamExample {json} Example
 *     {
 *         text: "Ik spreek Nederlands!",
 *         from: "nl",
 *         to: "en",
 *     }
 *
 * @apiSuccess {Boolean} success is it done.
 * @apiSuccess {String} text target content
 *
 * @apiSuccessExample Succsess Reponse:
 *     HTTP/1.1 200 OK
 *     {
 *            success: true,
 *            success: "I spea Dutch!"
 *     }
 *
 * @apiError error Something Error Message
 *
 * @apiErrorExample 406 Response:
 *     HTTP/1.1 406 Not Acceptable
 *     {
 *       error: "No text input!"
 *     }
 *
 * @apiErrorExample 500 Response:
 *     HTTP/1.1 500 Internal Server Error
 *     Something broke!
 */
var express = require('express'), 
    router = express.Router();

const Translate = require('../../lib/translate');

router
    .get('/', function(req, res, next) {
        if(!req.query.text)
            res.status(406).send({error: 'No text input!'});
        else {
            Translate.tt(req.query.text, req.query)
                // callback
                .then(function (result) {
                    if(result.success) {
                        res.setHeader('Content-Type', 'application/json');
                        res.send(JSON.stringify(result));
                    }
                    else {
                        res.status(result.status).send(result.text);
                    }
                });
        }
    });

module.exports = router;
