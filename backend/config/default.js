module.exports = {
    port: 8000,
    // port: 3000,
    session: {
        secret: 'chat',
        key: 'chat',
        maxAge: 2592000000
    },
    mongodb: 'mongodb://localhost:27017/chat'
};
