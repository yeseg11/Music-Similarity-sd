var debug = require('debug');
const mongoose = require('mongoose');
const RETRY_TIMEOUT = 3000;

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

module.exports = function initDB () {
    mongoose.Promise = global.Promise;
    const options = {
        keepAlive: 30000,
        poolSize:100
    }

    let isConnectedBefore = false;

    const connect = () => {
        if(isConnectedBefore) return Promise.resolve(mongoose); // prevent multiple connections
        return new Promise((res,rej)=> {
            return mongoose.connect(`mongodb://${process.env.mongohost || 'localhost'}/${process.env.mongodb || 'mb'}`, options)
                // load schemas
                .then(() => {
                    isConnectedBefore = true;
                    res(mongoose);
                }).catch(err => {
                    debug('app:mongoose')(`ERR ::  mongoose.connect :: ${err.message}`);
                    rej(err)
                })
        })
    }



    mongoose.connection.on('error', function () {
        debug('app:mongoose')('ERR :: Could not connect to MongoDB')
    })

    mongoose.connection.on('disconnected', function () {
        debug('app:mongoose')('Mongo got disconnected, trying to reconnect in '+RETRY_TIMEOUT)
        if (!isConnectedBefore) {
            setTimeout(() => connect(), RETRY_TIMEOUT)
        }
    })
    mongoose.connection.on('connected', function () {
        isConnectedBefore = true
        debug('app:mongoose')('Connection established to MongoDB')
    })

    mongoose.connection.on('reconnected', function () {
        debug('app:mongoose')('Reconnected to MongoDB')
    })

    // Close the Mongoose connection, when receiving SIGINT
    process.on('SIGINT', function () {
        mongoose.connection.close(function () {
            debug('app:mongoose')('Force to close the MongoDB connection after SIGINT');
            process.exit(0)
        })
    })

    return connect();

}
