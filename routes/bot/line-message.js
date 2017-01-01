var express = require('express'),
    router = express.Router();

var line = require('node-line-bot-api'), 
    lineClient = line.client, 
    lineValidator = line.validator;
    line.init({
        accessToken: process.env.ChannelAccessToken,
        channelSecret: process.env.ChannelSecret
    });

router
    .post('/webhooks', line.validator.validateSignature(), function (req, res, next) {
        var promises = req.body.events.map(function (event) {
            // reply message
            return line.client
                .replyMessage({
                    replyToken: event.replyToken,
                    messages: [{
                        type: 'text',
                        text: event.message.text
                    }]
                })
        })
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
