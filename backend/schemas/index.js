let config = require('config-lite')(__dirname);
let mongoose = require('mongoose');
// mongoose.Promise = global.Promise;
// mongoose.connect(config.mongodb);

mongoose.Promise = global.Promise;
mongoose.connect(config.mongodb,{useMongoClient: true});

let UserSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    password: { type: String },
    salt: { type: String },
    avatar: { type: String, default: '1.jpg' },
    bio: { type: String, default: '这个人很懒，还没有添加任何描述...' },
    created_at: { type: String},
});

let MessageSchema = new mongoose.Schema({
    username: { type: String},
    avatar: { type: String },
    content: { type: String },
    img: { type: String },
    roomId: { type: String },
    created_at: { type: String}
})

exports.User = mongoose.model('User', UserSchema);
exports.Message = mongoose.model('Message', MessageSchema);