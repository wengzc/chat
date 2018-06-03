/**
 * Created by Administrator on 2017/8/3.
 */
let Message = require('../schemas/index').Message;

module.exports = {
    //新增消息
    create(msg) {
        return Message.create(msg);
    },

    //更新消息的用户头像
    update(username, updatedData) {
        return Message
            .update({ username: username}, { $set: updatedData}, { multi : true })
            .exec();
    },

    // 通过用户名获取用户信息
    getMessagesByName(roomId) {
        return Message
            .find({ roomId: roomId })
            .exec();
    },

};


