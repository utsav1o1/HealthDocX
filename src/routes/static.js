const express = require('express');
const router = express.Router();


router.get('/', (req, res)=>{
    res.render('index',{
        title: 'Home',
        layout: '../views/layouts/main',
    })
});

module.exports = router;