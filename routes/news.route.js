import express from 'express';
const router = express.Router();

router.get('/details', (req, res) => {
    res.render('vwNews/news-detail', {

    });
});

router.get('/category', (req, res) => {
    res.render('vwNews/news-category', {

    });
});

export default router;