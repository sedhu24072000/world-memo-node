const dotenv = require('dotenv')
const mongoose = require('mongoose')
dotenv.config({path:'./config.env'})
const app = require('./app')

const DB = process.env.DATABASE.replace("<DATABASE_PASSWORD>", process.env.PASSWORD)
mongoose.connect(DB).then(()=> console.log("DB connected successfully!")).catch((err) => console.log(err))

const port = 8000
app.listen(port,'localhost', () =>{
    console.log('server starts listening..')
})
