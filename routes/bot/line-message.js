var express = require('express'),
    router = express.Router();

var sprintf = require("sprintf-js").sprintf,
    vsprintf = require("sprintf-js").vsprintf;

var superagent = require('superagent');
const LineMessageSDK = require('../../lib/bot/line-message-sdk')({
        accessToken: process.env.ChannelAccessToken,
        channelSecret: process.env.ChannelSecret
    });

router
    .post('/webhooks', function (req, res, next) {
        var promises = LineMessageSDK.parse(req.body).events.map(function (event) {
            if(event.isMessageEvent() && event.isMessageText()){
                superagent.get('localhost:'+process.env.PORT+'/v1/translate')
                    .query(Object.assign({from: 'auto', to: 'en'}, event.message))
                    .set('Accept', 'application/json')
                    .end(function (err, result) {
                        if(err || !result.ok) {
                            console.log(err);
                        }
                        else {
                            LineMessageSDK.client
                                .replyMessage({
                                    replyToken: event.replyToken,
                                    messages: [{
                                        type: 'text',
                                        text: result.body.text
                                    }]
                                });
                        }
                    });
            }
            else {
                LineMessageSDK.client
                    .replyMessage({
                        replyToken: event.replyToken,
                        messages: [{
                            type: 'text',
                            text: event.toString()
                        }]
                    });  
            }
        });
        Promise.all(promises)
            .then(function () {
                res.json({success: true})
            })
            .catch((error) => {
                console.log(error);
                res.json({success: true})
            });;
    });

module.exports = router;
