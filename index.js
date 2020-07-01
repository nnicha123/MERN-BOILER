const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const User = require('./model/user')

mongoose.connect('mongodb+srv://nnicha:Ninat1995@firstcluster.wqh6d.mongodb.net/<dbname>?retryWrites=true&w=majority',{useNewUrlParser:true,useCreateIndex:true})
.then(() => console.log('DB connected'))
.catch(err => console.log(err))

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(cookieParser())

app.post('/api/usersnew/register',(req,res) => {
    const usernew = new User(req.body)
    usernew.save((err,userData) => {
        if(err) return res.json({success:false,err})
        return res.status(200).json('Completed!')
    })
    return res.status(200)
})

app.listen(5000,() => console.log('Listening at port 5000'))