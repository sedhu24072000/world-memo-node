const Image = require('../model/imageModel')
const multer = require('multer')
const fs = require('fs');
const path = require('path');

exports.updateImg = async(req,res) =>{
    try{
        const imagePath = `/uploads/${req.file.filename}`;
        const newImage = new Image({
                name: req.file.filename,
                img: {
                    contentType: req.file.mimetype,
                },
                user: req.user.id,
                imageUrl: imagePath
        });
        const user = req.user.id
        const previousProfile = await Image.findOne({user})
        if(previousProfile){
            const filename = previousProfile.imageUrl.split('/')[2]
            const filePath = path.join(__dirname, '..','uploads', filename)
            fs.unlinkSync(filePath)
            await Image.deleteOne({user})
        }
        await newImage.save()

        res.status(200).json({
            status :'success',
            message : imagePath
        });
        }catch(err){
        res.status(400).json({
            status : 'failed',
            message : 'something went wrong!'
        })
    }
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory to save uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Unique file name
    },
});

exports.upload = multer({ storage });