import express from 'express';
import newsService from '../services/news.service.js';

const router = express.Router();

router.get('/details', async (req, res) => {
    const id = parseInt(req.query.id) || 0;
    const news = await newsService.findbyId(id);
    res.render('vwNews/news-detail.hbs', {
        news: news,
    });
});

router.get('/category', (req, res) => {
    res.render('vwNews/news-category', {

    });
});

export default router;