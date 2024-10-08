require('dotenv').config()
const express = require('express')
const session = require('express-session');
const MongoStore = require('connect-mongo');
const connectDB = require('./src/config/db');
const expressLayouts = require('express-ejs-layouts')
const app = express()
connectDB();

app.use(express.static('public'))
app.use(expressLayouts)
app.set('view engine', 'ejs')
app.set('layout', 'layouts/main')


const port = process.env.PORT || 3000

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false, // Prevents resaving session if unmodified
    saveUninitialized: false, // Don't create session until something stored
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        collectionName: 'sessions'
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        httpOnly: true, // Helps prevent XSS
        secure: false, // Set to true if using HTTPS
    }
}));



const staticRouter = require('./src/routes/static')
app.use('/', staticRouter)




app.listen(port,()=>{
    console.log('Server is running on port: '+port)
});
