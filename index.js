const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const User = require('./model/user')

mongoose.connect('mongodb+srv://nnicha:Ninat1995@firstcluster.wqh6d.mongodb.net/<dbname>?retryWrites=true&w=majority', { useNewUrlParser: true, useCreateIndex: true })
    .then(() => console.log('DB connected'))
    .catch(err => console.log(err))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())

app.get('/api/usersnew/', (req, res) => {
    User.find()
        .then(users => res.json(users))
        .catch(err => res.status(404).json('Error: ' + err))
})

app.post('/api/usersnew/register', (req, res) => {
    const usernew = new User(req.body)
    usernew.save((err, userData) => {
        if (err) return res.json({ success: false, err })
        return res.status(200).json({ success: true, userData: userData })
    })
    return res.status(200)
})

app.post('/api/usersnew/login', (req, res) => {
    // find the email
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user) {
            return res.json({
                loginSuccess: false,
                message: "Auth failed,email not found"
            })
        }
        // compare the password
        user.comparePassword(req.body.password, (err, isMatch) => {
            if(!isMatch){
                return res.json({loginSuccess:false,message:'wrong password'})
            }
        })
        // generate token
        user.generateToken((err,user) => {
            if(err) return res.status(400).send(err)
            res.cookie("x_auth",user.token)
            .status(200)
            .json({
                loginSuccess:true
            })
        })
    })

})

app.listen(5000, () => console.log('Listening at port 5000'))