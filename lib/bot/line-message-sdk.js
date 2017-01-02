var VAR_DEFINED = {
    SOURCE_TYPE: {
        USER: "user",
        GROUP: "group",
        ROOM: "room",
    },
    BEACON_TYPE: {
        ENTER: 'enter',
        LEAVE: 'leave',
        BANNER: 'banner',
    },
    EVENT_TYPE: {
        MESSAGE: 'message',
        FOLLOW: 'follow',
        Unfollow: 'unfollow',
        JOIN: 'join',
        LEAVE: 'leave',
        POSTBACK: 'postback',
        BEACON: 'beacon',
    },
    MESSAGE_TYPE: {
        TEXT: 'text',
        IMAGE: 'image',
        VIDEO: 'video',
        AUDIO: 'audio',
        LOCATION: 'location',
        STICKER: 'sticker',
    }
};

module.exports = function (opts) {
    var line = require('node-line-bot-api');
    line.init(opts);
    return Object.assign(line, VAR_DEFINED, {
        parse: function (body) {
            this.events = body.events.map(function (event) {
                return Object.assign(event, {
                    /**
                     * vars
                     */
                    origin: Object.assign({}, event),
                    /**
                     * check event type or message type
                     */
                    isMessageText: function () { return (VAR_DEFINED.MESSAGE_TYPE.TEXT === this.message.type); },
                    isMessageImage: function () { return (VAR_DEFINED.MESSAGE_TYPE.IMAGE === this.message.type); },
                    isMessageVideo: function () { return (VAR_DEFINED.MESSAGE_TYPE.VIDEO === this.message.type); },
                    isMessageAudio: function () { return (VAR_DEFINED.MESSAGE_TYPE.AUDIO === this.message.type); },
                    isMessageLocation: function () { return (VAR_DEFINED.MESSAGE_TYPE.LOCATION === this.message.type); },
                    isMessageSticker: function () { return (VAR_DEFINED.MESSAGE_TYPE.STICKER === this.message.type); },
                    isMessageEvent: function () { return (VAR_DEFINED.EVENT_TYPE.MESSAGE === this.type) },
                    isFollowEvent: function () { return (VAR_DEFINED.EVENT_TYPE.FOLLOW === this.type) },
                    isUnfollowEvent: function () { return (VAR_DEFINED.EVENT_TYPE.UNFOLLOW === this.type) },
                    isJoinEvent: function () { return (VAR_DEFINED.EVENT_TYPE.JOIN === this.type) },
                    isLeaveEvent: function () { return (VAR_DEFINED.EVENT_TYPE.LEAVE === this.type) },
                    isPostbackEvent: function () { return (VAR_DEFINED.EVENT_TYPE.POSTBACK === this.type) },
                    isBeaconEnter: function () { return (VAR_DEFINED.BEACON_TYPE.ENTER === this.beacon.type) },
                    isBeaconLeave: function () { return (VAR_DEFINED.BEACON_TYPE.LEAVE === this.beacon.type) },
                    isBeaconBanner: function () { return (VAR_DEFINED.BEACON_TYPE.BANNER === this.beacon.type) },
                    isBeaconEvent: function () { return (VAR_DEFINED.EVENT_TYPE.BEACON === this.type) },
                    /**
                     * get function 
                     */
                    getType: function  () {
                        return this.type;
                    },
                    getMessageType: function () {
                        if(this.isMessageEvent())
                            return this.message.type;
                        else
                            return 'this is not message event.';
                    },
                    getBeaconType: function () {
                        if(this.isBeaconEvent())
                            return this.beacon.type;
                        else
                            return 'this is not message event.';
                    },
                    getUserId: function () {
                        if(VAR_DEFINED.SOURCE_TYPE.USER === this.source.type)
                            return this.source.userId;
                        return false;
                    },
                    getGroupId: function () {
                        if(VAR_DEFINED.SOURCE_TYPE.GROUP === this.source.type)
                            return this.source.groupId;
                        return false;
                    },
                    /**
                     * for default return 
                     */
                    toString: function () {
                        switch(this.type) {
                            case VAR_DEFINED.EVENT_TYPE.MESSAGE:
                                return 'Hi! I receive a "' + event.getMessageType() + '", thanks.';
                                break;
                            case VAR_DEFINED.EVENT_TYPE.FOLLOW:
                                return 'Wow, nice to meet you.';
                                break;
                            case VAR_DEFINED.EVENT_TYPE.JOIN:
                                return 'Hi everybody!! thank to join me.';
                                break;
                        }
                        return '??';
                    }
                });
            });
            return this;
        }
    });
};
