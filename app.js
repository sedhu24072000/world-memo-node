const express = require('express')
const cors = require('cors');
const cookieParser = require('cookie-parser');

const userRouter = require('./router/userRouter')
const imageRouter = require('./router/imageRouter')

const app = express()
app.use(express.json())
app.use(cookieParser());

app.use(cors({
    origin: 'https://world-memo.netlify.app',  
    credentials: true,
    methods: ['GET', 'POST', 'DELETE','PATCH']
  }));
  
app.use('/uploads', express.static('uploads'));
app.use('/user', userRouter)
app.use('/image',imageRouter)

module.exports = app

