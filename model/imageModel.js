const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    name: String,
    img: {
        contentType: String,
    },
    user :{
        type : mongoose.Schema.ObjectId,
        ref : 'User',
        required : [true, 'Profile pic must belonging to user'],
        unique : true
    },
    imageUrl : String
},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});

const Image = mongoose.model('Image', imageSchema);


module.exports = Image;