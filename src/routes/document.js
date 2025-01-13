const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const { analyzeDocument } = require('../services/geminiAI');
const Document = require('../models/Document');


router.get('/', (req, res) => {
    res.render('upload', { title: 'Upload Document', error: null, layout: 'layouts/dashboard.ejs'});
});

router.post('/', upload.single('document'), async (req, res) => {
   
    const file = req.file;

    if (!file) {
        return res.render('upload', { title: 'Upload Document', error: 'Please upload a file.' });
    }

    try {
        // Analyze the document with Gemini AI
        const analysis = await analyzeDocument(file.path, file.mimetype);

        // Create and save the document in DB
        const newDocument = new Document({
            userId: req.session.user.id,
            hospitalName: analysis.hospitalName,
            healthIssue: analysis.healthIssue,
            documentType: file.mimetype.startsWith('image') ? 'Image' : 'PDF',
            documentPath: `/uploads/${file.filename}`,
            summary: analysis.summary
        });

        await newDocument.save();

        res.redirect('/dashboard');
    } catch (err) {
        console.error(err);
        res.render('upload', { title: 'Upload Document', error: err.message });
    }
});

router.get('/click_photo', (req, res) => {
    res.render('click_photo', { title: 'Capture Photo', error: null });
});

router.post('/click_photo', upload.single('photo'), async (req, res) => {
    const { hospitalName, healthIssue } = req.body;
    const file = req.file;

    if (!file) {
        return res.render('click_photo', { title: 'Capture Photo', error: 'Please capture a photo.' });
    }

    try {
        // Analyze the photo with Gemini AI
        const analysis = await analyzeDocument(file.path, file.mimetype);

        // Create and save the document in DB
        const newDocument = new Document({
            userId: req.session.user.id,
            hospitalName: analysis.hospitalName,
            healthIssue: analysis.healthIssue,
            documentType: 'Image',
            documentPath: `/uploads/${file.filename}`,
            summary: analysis.summary
        });

        await newDocument.save();

        res.redirect('/dashboard');
    } catch (err) {
        console.error(err);
        res.render('click_photo', { title: 'Capture Photo', error: err.message });
    }
});

module.exports = router;