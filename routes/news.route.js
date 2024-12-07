import express from 'express';
const router = express.Router();

router.get('/details', (req, res) => {
    res.render('vwNews/news-detail.hbs',{
        
    });
});

export default router;