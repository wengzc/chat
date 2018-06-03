/**
 * Created by Administrator on 2017/8/3.
 */
let User = require('../schemas/index').User;

module.exports = {
    //新增用户
    create(user) {
        return User.create(user);
    },

    //更新用户信息
    update(username, updatedData) {
        return User
            .update({ username: username}, { $set: updatedData})
            .exec();
    },

    // 通过用户名获取用户信息
    getUserByName(username) {
        return User
            .findOne({ username: username })
            .exec();
    },

    // 通过_id获取用户信息
    getUserById(_id) {
        return User
            .findOne({ _id: _id })
            .exec();
    },
};


