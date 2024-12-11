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

//danh sách sản phẩm
router.get('/byCat', async (req, res) => {
    const id = parseInt(req.query.id) || 0;
    const limit = 4;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;
    //Phân trang
    const nRows = await newsService.countByCatId(id);
    const nPages = Math.ceil(nRows.total / limit);
    const page_items = [];
    for (let i = 1; i<=nPages; i++) { 
        const item = {
            value: i,
            isActive: i === page,
        }
        page_items.push(item);
    }

    const list = await newsService.findPageByCatId(id, limit, offset);

    res.render('vwNews/news-category', {
        news: list,
        empty: list.length === 0,
        page_items: page_items,
        catId: id,
    });
});

export default router;