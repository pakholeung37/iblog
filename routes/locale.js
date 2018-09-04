const express = require('express');
const router = express.Router();
const path = require('path');
const i18n = require('i18n');

// change website language
router.get('/locale/:lang', (req, res, next) => {
    if(req.params.lang) {
        res.cookie('locale',
         req.params.lang
        , {
            maxAge: 900000,
            httpOnly: true
        });
    }
})

module.exports = router;