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

const translate = require('google-translate-api');

router
    .get('/', function(req, res, next) {
        if(!req.query.text)
            res.status(406).send({error: 'No text input!'});
        else {
            translate(req.query.text, Object.assign({from: 'auto', to: 'en'}, req.query))
                .then(result => {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify({success: true, text: result.text}));
                })
                .catch(err => {
                    console.log(err.stack);
                    res.status(500).send('Something broke!');
                });
        }
    });

module.exports = router;
