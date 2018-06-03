let express = require('express');
let router = express.Router();
let moment = require('moment');
moment.locale('zh-cn');

let MessageModel = require('../models/message');

router.get('/', (req, res) => {
    let roomId = req.query.roomId;
    MessageModel.getMessagesByName(roomId).then((result) => {
        if(result) {
            result = result.map((item) => {
                item.created_at = moment(item.created_at, 'YYYY-MM-DD HH:mm').fromNow();
                return item;
            })
            res.json({
                status: 1,
                message: '获取房间消息成功!',
                result: result
            })
        }
    }).catch( (e) => {
        console.log("error:"+ e);
    });
})

module.exports = router;