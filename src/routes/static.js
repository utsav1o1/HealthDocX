const express = require('express');
const router = express.Router();


router.get('/', (req, res)=>{
    res.render('index',{
        title: 'Home',
        layout: '../views/layouts/main',
    })
});


router.get('/feature', (req, res)=>{
    res.render('frontpage/feature',{
        title: 'Features',
        layout: '../views/layouts/main',
    })
});

router.get('/aboutus', (req, res)=>{
    res.render('frontpage/aboutus',{
        title: 'About Us',
        layout: '../views/layouts/main',
    })
});

module.exports = router;