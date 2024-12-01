const express = require('express')
const router = express.Router()
const userController = require('../controller/userController')
const imageController = require('../controller/imageController')

router.route('/updateimage').post(userController.protect,imageController.upload.single('file'),imageController.updateImg)

module.exports = router