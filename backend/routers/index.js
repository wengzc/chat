module.exports = (app) => {
    app.use('/user', require('./user'));
    app.use('/messages', require('./message'));
    app.use('/image', require('./image'));
}
