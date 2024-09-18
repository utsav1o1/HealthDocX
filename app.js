require('dotenv').config()
const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const app = express()


app.use(express.static('public'))
app.use(expressLayouts)
app.set('view engine', 'ejs')
app.set('layout', 'layouts/main')

const port = process.env.PORT || 3000



app.get('/', (req, res)=>{
    res.render('index',{
        title: 'Home',
        layout: '../views/layouts/main',
    })
});

app.listen(port,()=>{
    console.log('Server is running on port: '+port)
});
