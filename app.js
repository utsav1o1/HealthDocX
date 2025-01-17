require('dotenv').config()
const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const session = require('express-session');
const MongoStore = require('connect-mongo');
const connectDB = require('./src/config/db');
const helmet = require('helmet');
const path = require('path');

const app = express()
app.use(helmet());


connectDB();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static('public'))
app.use(expressLayouts)
app.set('view engine', 'ejs')
app.set('layout', 'layouts/main')



if (process.env.NODE_ENV === 'production') {
    app.set('views', path.join(__dirname, 'views'));
    app.set('src', path.join(__dirname, 'src'));
    app.set('public', path.join(__dirname, 'public'));
    app.set('trust proxy', 1)

}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const port = process.env.PORT || 3000

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false, // Don't save session if unmodified
    saveUninitialized: false,   // Don't create session until something stored
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        collectionName: 'sessions'
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production' ? true : false,
    }
}));


app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});



const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    res.redirect('auth/login');
};

const staticRouter = require('./src/routes/static');
const authRoutes = require('./src/routes/auth');
const documentRoutes = require('./src/routes/document');
const showRoutes = require('./src/routes/show');
app.use('/', staticRouter);
app.use('/auth', authRoutes);
app.use('/dashboard/upload', isAuthenticated, documentRoutes);
app.use('/documents', isAuthenticated, showRoutes);




app.get('/dashboard', isAuthenticated, (req, res) => {
    const userName = req.session.user.name;
    res.render('dashboard', { title: 'Dashboard', userName, user: req.session.user, layout: 'layouts/dashboard.ejs' });
});

app.listen(port, () => {
    console.log('Server is running on port: ' + port)
});
