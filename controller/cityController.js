const City = require('../model/cityModel')

exports.createCity = async (req,res) =>{
    try{
        const {cityName,date,review,country,emoji,position} = req.body
        const user = req.user.id
        const data = await City.create({cityName,date,review,user,country,emoji,position})
        res.status(201).json({
            status:'success',
            message:{
                data
            }
        })

    }catch(err){
        res.status(400).json({
            status:'failed',
            message : 'something went wrong!'
        })
    }
} 

exports.getCity = async (req,res) =>{
    try{
        const id = req.user.id
        const data = await City.find({user :id})
        res.status(200).json({
            status : 'success',
            message : {
                data
            }
        })

    }catch(err){
        res.status(400).json({
            status:'failed',
            message : 'something went wrong!'
        })
    }
}

exports.deleteCity = async (req,res) =>{
    try{
        const id = req.params.id
       await City.deleteOne({_id:id}) 
       res.status(204).json({
        status:'success',
       })
    }catch(err){
        res.status(400).json({
            status:'failed',
            message : 'something went wrong!'
        })
    }
}