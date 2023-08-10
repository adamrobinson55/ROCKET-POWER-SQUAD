const { Schema, model, Types } = require('mongoose')
const bcrypt = require('bcrypt')


const userSchema = new Schema({
    id: {
        type: Number,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    friends: [{
        type: Types.ObjectId,
        ref: 'User'
    }],
    favorites: [{
        type: Types.ObjectId,
        ref: 'Lobby'
    }]
})

var friendSchema = new Schema ({
    requester: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    }, 
    recipient: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: INT,
        required: true
    }
})

userSchema.pre('save', async function(next) {
    if(this.isNew || this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8)
    }

    next()
})

userSchema.methods.comparePassword = function(password) {
    return bcrypt.compare(password, this.password)
}

const User = model('user', userSchema)
const Friend = model('friend', friendSchema)

module.exports = Friend
module.exports = User