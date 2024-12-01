const nodemailer = require('nodemailer')

const sendEmail =async options =>{
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Use Gmail
        auth: {
            user: 'sedhumadhavan0002@gmail.com', // Your Gmail address
            pass: 'uozc kmgz dslw gwkr'
  },
    })

    const emailOption = {
        from: 'sedhumadhavan0002@gmail.com',
        to: options.email,
        subject : options.subject,
        text : options.message
    }

    await transporter.sendMail(emailOption)
}

module.exports = sendEmail