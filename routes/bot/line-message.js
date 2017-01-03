var express = require('express'),
    router = express.Router();

// var sprintf = require("sprintf-js").sprintf,
//     vsprintf = require("sprintf-js").vsprintf;

var superagent = require('superagent');
const LineMessageSDK = require('../../lib/bot/line-message-sdk')({
        accessToken: process.env.ChannelAccessToken,
        channelSecret: process.env.ChannelSecret
    });

router
    // line webhook(callback)
    .post('/webhooks', 
        // webhook validator
        LineMessageSDK.validator.validateSignature(), 
        // do...
        function (req, res, next) {
            var promises = LineMessageSDK.parse(req.body).events.map(function (event) {
                // is it message & text type?
                if(event.isMessageEvent() && event.isMessageText()) {
                    // fetch local api
                    superagent.get('localhost:'+process.env.PORT+'/v1/translate')
                        .query(Object.assign({from: 'auto', to: 'en'}, event.message))
                        .set('Accept', 'application/json')
                        .end(function (err, result) {
                            if(err || !result.ok) {
                                console.log(err);
                            }
                            else {
                                // reply message
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
                // or just else
                else {
                    // reply message
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
