const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name :{
        type : String,
        required : [true, 'A user must have name'],
    },
    email :{
        type : String,
        require : [true, 'A user must have email ID'],
        unique : true
    },
    password : {
        type : String,
        required : [true, 'A user must have password'],
    },
    confirmPassword : {
        type : String,
    },
    passwordChangeAt : Date,
    passwordResetToken : String,
    passwordExpiresAt : Date,
    select : {
        type: Boolean,
        default: true,
        select: false
    }
},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})

userSchema.virtual('profile',{
    ref : 'Image',
    foreignField : 'user',
    localField : '_id'
})



userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password,12)
    this.confirmPassword = undefined
    next()
})

userSchema.pre('save', function(next){
    if(!this.isModified('password') || this.isNew) return next()
    this.passwordChangeAt = Date.now()
    next()
})

userSchema.methods.comparePassword = async function(password, userpassword){
    return await bcrypt.compare(password, userpassword)
}

userSchema.methods.isChangePassword = function(JWTtimeStamp){
    if(this.passwordChangeAt){
        const changedTimeStamp = parseInt(this.passwordChangeAt.getTime()/1000,10)
        return JWTtimeStamp > changedTimeStamp
    }
    else if(this.passwordChangeAt === undefined){
        return true
    }
    return false
}

userSchema.methods.passwordResetTokenfun = function(){
    const resetToken = Math.floor(100000 + Math.random() * 900000)

    this.passwordResetToken = resetToken

    this.passwordExpiresAt = Date.now() + 2 * 60 * 1000

    return resetToken
}

const User = mongoose.model('User', userSchema)

module.exports = User