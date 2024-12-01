const User = require('../model/userModel')
const jwt = require('jsonwebtoken')
const sendEmail = require('../utils/mail')

exports.signUp = async(req,res,next) =>{
    try{
        const {name, email,password, confirmPassword} = req.body
        const data = await User.create({name, email,password, confirmPassword})
        res.status(201).json({
            status : 'success',
            data
        })
        req.userId = data.id
    }catch(err){
        console.log(err)
        res.status(400).json({
            status : 'failed',
            message : 'something went wrong!'
        })
    }
}

exports.login = async(req,res) =>{
    try{
        let token
        const {email,password} = req.body
        const user = await User.findOne({email}).populate({path:'profile',select:'name'});
        const valid = await user.comparePassword(password, user.password )
        if(valid){
            token = jwt.sign({id:user._id}, process.env.JWT_SECRET,{expiresIn : '90d'})
            res.cookie('jwt', token, {                                                                                                        
                httpOnly: true,
                maxAge: 900000,
                sameSite: 'None',
                secure: true,
                domain: 'world-memo.netlify.app'
              });
        
            res.status(200).json({ 
                status: true,
                data:user
             });
        }
        else{
            res.status(400).json({
                status:'failed',
                message: 'bad request💥'
        })}

    }catch(err){
            res.status(400).json({
            status:'failed',
            message: 'bad request💥'
        })
    }
}

exports.logout = (req,res) =>{
    try{
        res.clearCookie('jwt', {
            path: '/',
            httpOnly: true,
        });
        
        res.status(200).json({
            status:'success',
            message:'logged out successfully!'
        })

    }catch(err){
        console.log(err)
        res.status(400).json({
            status : 'failed',
            message : 'something went wrong!'
        })

    }
    
}

exports.forgotPassword = async (req,res) =>{

        const {email} = req.body
        const data = await User.findOne({email})
        if(!data){
            res.status(404).json({
                status : 'failed',
                message : 'something went wrong!'
            })
        }
        const resetToken = data.passwordResetTokenfun()
        await data.save({validateBeforeSave : false})
        const message = `Forgot your password ? pls use this OTP ${resetToken} to set new password`
        try{
            
                await sendEmail({
                email:data.email,
                message,
                subject:"Reset password"
            })
            res.status(200).json({
                status:"success",
                message:'token sent'})
    }catch(err){
        data.passwordResetToken = undefined,
        data.passwordExpiresAt = undefined,
        await data.save({validateBeforeSave : false})
        res.status(400).json({
            status : 'failed',
            message : 'something went wrong!'
        })
    }
}

exports.resetPassword = async (req,res) =>{
    try{
        const email = req.body.email
        const user = await User.findOne({email})
        if(!user){
            res.status(400).json({
                status :'failed',
                message : 'something went wrong!'
            })
        }
    
        user.password = req.body.password,
        user.confirmPassword = req.body.confirmPassword,
        user.passwordResetToken = undefined,
        user.passwordExpiresAt = undefined
        await user.save()
    
        res.status(200).json({
            status:"success"
        })
    }catch(err){
        res.status(400).json({
            status : 'failed',
            message : 'something went wrong!'
        })
    }
    

}

exports.otp = async(req,res) =>{
    try{
        const resetToken = req.body.otp
        const user = await User.findOne({passwordResetToken : resetToken, passwordExpiresAt : {$gt : Date.now()}})
        if(!user){
            res.status(400).json({
                status :'failed',
                message : 'something went wrong!'
            })
        }
        res.status(200).json({
            status: "true",
        })
    }catch(err){
        res.status(400).json({
            status : 'failed',
            message : 'something went wrong!'
        })
    }
}

exports.updatePassword = async(req,res) => {
    try{
    const user = await User.findOne(req.user._id).select('+password')
    const userPassword = user.password
    const providedPassword = req.body.password

    const result = await user.comparePassword(providedPassword,userPassword)

    if(!result){
        res.status(400).json({
            status:'failed',
            message:'Password is incorrect!'
        })
    }

    user.password = req.body.newPassword
    user.confirmPassword = req.body.newconfirmPassword
    await user.save()

    res.status(201).json({
        status:"success",
        message:'password changed successfully :) please login again !'
    })
    }catch(err){
        res.status(400).json({
            status : 'failed',
            message : 'something went wrong!'
        })
    }
    
}


exports.protect = async (req,res,next) =>{

    try{
        const token = req.cookies.jwt
      if(!token){
        res.status(401).json({
            status :'failed',
            message : 'You are not logged in please login !'
        })
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET)

    const currentUser = await User.findById(decode.id)

    if(!currentUser){
        res.status(401).json({
            status : 'failed',
            message : 'The user belonging to this token does not exist!'
        })
    }

    const passwordChanged = currentUser.isChangePassword(decode.iat)


    if(!passwordChanged){
        res.status(401).json({
            status : 'failed',
            message: 'The user has recently changed the password, please login again'
        })
    }
    req.user = currentUser
    next()
    }catch(err){
        res.status(400).json({
            status : 'failed',
            message : 'something went wrong!'
        })
    }
}

exports.updateName =async(req,res) =>{
    try{
        const name = req.body.name
        const id = req.user.id
        const data = await User.findByIdAndUpdate(id,{name},{ new: true })
        res.status(200).json({
            status:"success",
            message : data
        })
    }catch(err){
        res.status(400).json({
            status : 'failed',
            message : 'something went wrong!'
        })
    }
}

exports.deleteMe = async(req,res) =>{
    try{
        const del = req.user.id
        await User.deleteOne({ _id: del })
        res.status(204).json({
            status : 'success'
        })
    }catch(err){
       return res.status(400).json({
            status : 'failed',
            message : 'something went wrong!'
        })
    }
}




