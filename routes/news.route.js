import express from 'express';
import newsService from '../services/news.service.js';

const router = express.Router();

router.get('/details', (req, res) => {
    res.render('vwNews/news-detail.hbs', {

    });
});

router.get('/category', (req, res) => {
    res.render('vwNews/news-category', {
        
    });
});

export default router;