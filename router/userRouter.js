const express = require('express')
const router = express.Router()
const userController = require('../controller/userController')
const cityController = require('../controller/cityController')

router.route('/signup').post(userController.signUp)
router.route('/login').post(userController.login)
router.route('/forgotpassword').post(userController.forgotPassword)
router.route('/otp').post(userController.otp)
router.route('/resetpassword').post(userController.resetPassword)
router.route('/updatename').post(userController.protect,userController.updateName)
router.route('/deleteme').delete(userController.protect,userController.deleteMe)
router.route('/logout').get(userController.protect,userController.logout)
router.route('/city').post(userController.protect,cityController.createCity).get(userController.protect,cityController.getCity)
router.route('/city/:id').delete(userController.protect,cityController.deleteCity)


module.exports = router