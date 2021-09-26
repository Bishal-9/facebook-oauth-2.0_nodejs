require('dotenv').config()

const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session')

const app = express()
const PORT = process.env.PORT || 5000

// * MongoDB connection
mongoose.connect(process.env.MONGODB_URI, () => {
    console.log('MongoDB connected!!')
})

// * Authentication Strategy
require('./FacebookAuth')(passport, PORT)

// * Middlewares
app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

// * Custom Middleware
const isLogged = (req, res, next) => {
    if (req.user) {
        next()
    } else {
        res.sendStatus(401)
    }
}

// * Routes
app.get('/', (req, res) => {
    res.send('<center><h1>API working!! 🚀🚀🚀</h1></center>')
})

// * Facebook Login routes
app.get('/auth/facebook', passport.authenticate('facebook'))

app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/failed' }),
    (req, res) => {
        // Successful authentication, redirect home.
        res.redirect('/dashboard')
    })

app.get('/failed', (req, res) => {
    res.send('<h1>Login failed!! 🥺🥺🥺</h1>')
})

app.get('/dashboard', isLogged, (req, res) => {
    res.send('<h1>Dashboard</h1>')
})

app.get('/logout', (req, res) => {
    req.session.destroy(error => {
        if (error) console.log(error)
    })
    req.logOut()
    res.redirect('/')
})

// * Server listening port
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`))