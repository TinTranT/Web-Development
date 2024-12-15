import express from 'express';
import newsService from '../services/news.service.js';
import categoryService from '../services/category.service.js';
import tagService from '../services/tag.service.js';
import newstagsService from '../services/newstags.service.js';
import commentService from '../services/comment.service.js';


const router = express.Router();

router.get('/details', async (req, res) => {
    const id = parseInt(req.query.id) || 0;
    const news = await newsService.findbyId(id);
    const category = await categoryService.findbyNewsId(id);
    const taglist = await tagService.findByNewsId(id);
    const relatednews = await newsService.relatedNews(id);
    const commentlist = await commentService.findbyNewId(id);
    
    res.render('vwNews/news-detail.hbs', {
        category: category,
        news: news,
        taglist: taglist,
        relatedNews: relatednews,
        commentList: commentlist,
    });
});

//danh sách sản phẩm theo category
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
    const category = await categoryService.findById(id);

    res.render('vwNews/news-category', {
        news: list,
        empty: list.length === 0,
        page_items: page_items,
        catId: id,
        category: category,
        isFirstPage: page === 1,
        isLastPage: page === nPages,
        previousPage: page > 1 ? page - 1 : 1,
        nextPage: page < nPages ? page + 1 : nPages,
    });
});

//danh sách sản phẩm theo tag
router.get('/byTag', async (req, res) => {
    const id = parseInt(req.query.id) || 0;
    const limit = 4;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;
    //Phân trang
    const nRows = await newstagsService.countByTagId(id);
    const nPages = Math.ceil(nRows.total / limit);
    const page_items = [];
    for (let i = 1; i<=nPages; i++) { 
        const item = {
            value: i,
            isActive: i === page,
        }
        page_items.push(item);
    }
    const list = await newsService.findPageByTagId(id, limit, offset);
    const tag = await tagService.findById(id);

    res.render('vwNews/news-tag', {
        news: list,
        empty: list.length === 0,
        page_items: page_items,
        tagId: id,
        tag: tag,
        isFirstPage: page === 1,
        isLastPage: page === nPages,
        previousPage: page > 1 ? page - 1 : 1,
        nextPage: page < nPages ? page + 1 : nPages,
    });
});

export default router;



