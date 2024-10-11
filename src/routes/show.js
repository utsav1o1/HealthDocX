const express = require('express');
const router = require('express').Router();
const Document = require('../models/Document');

router.get('/hospitals', async (req, res) => {
    try {
        
        const documents = await Document.find({ userId: req.session.user.id });

        
        const documentsByHospital = documents.reduce((acc, doc) => {
            if (!acc[doc.hospitalName]) {
                acc[doc.hospitalName] = [];
            }
            acc[doc.hospitalName].push(doc);
            return acc;
        }, {});

        
        const groupedHospitals = Object.entries(documentsByHospital).map(([name, docs]) => ({
            name,
            documents: docs
        }));
        const totalFilesUploaded = documents.length;

        res.render('documents/hospitals', {
            title: 'Documents by Hospitals',
            hospitals: groupedHospitals,
            totalFilesUploaded : totalFilesUploaded,
            error: ''
            
        });
    } catch (err) {
        console.error(err);
        res.render('documents/hospitals', { title: 'Documents by Hospitals', hospitals: [], error: 'Failed to retrieve documents.' });
    }
});


router.get('/issues', async (req, res) => {
    try {
        // Fetch all documents for the logged-in user
        const documents = await Document.find({ userId: req.session.user.id });

        // Group documents by health issue
        const documentsByIssue = documents.reduce((acc, doc) => {
            if (!acc[doc.healthIssue]) {
                acc[doc.healthIssue] = [];
            }
            acc[doc.healthIssue].push(doc);
            return acc;
        }, {});

        // Convert the grouped object into an array for easier iteration in EJS
        const groupedIssues = Object.entries(documentsByIssue).map(([name, docs]) => ({
            name,
            documents: docs
        }));
        const totalFilesUploaded = documents.length;
        res.render('documents/issues', {
            title: 'Documents by Health Issues',
            issues: groupedIssues,
            error: '',
            totalFilesUploaded : totalFilesUploaded
            
        });
    } catch (err) {
        console.error(err);
        res.render('documents/issues', { title: 'Documents by Health Issues', issues: [], error: 'Failed to retrieve documents.' });
    }
});

module.exports = router;
