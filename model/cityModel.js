const mongoose = require('mongoose')

const citySchema = new mongoose.Schema({
    cityName : {
        type : String,
        required : [true, 'A city must have name']
    },
    date : {
        type : String,
        required : [true, 'A city must have date']
    },
    review : {
        type : String,
        required: [true, 'A city must have review']
    },
    country :{
        type: String,
        required : [true,'It must have counrtry name']
    },
    emoji :{
        type : String,
        required : [true, 'It should have emoji']
    },
    position:{
        lat:{
            type: Number,
            required: [true, 'Latitude is required']
        },
        lng:{
            type: Number,
            required: [true, 'Longitude is required']
        },
    },
    user: {
        type : mongoose.Schema.ObjectId,
        ref : 'User',
        required : [true, 'Profile pic must belonging to user'],
    }
},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})

const City = mongoose.model('City', citySchema)

module.exports = City