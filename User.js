const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    facebookId: {
        type: String,
        require: true
    },
    displayName: {
        type: String,
        require: true
    },
    image: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('User', userSchema)