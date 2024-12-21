import express from 'express';
import newsService from '../services/news.service.js';
import categoryService from '../services/category.service.js';
import tagService from '../services/tag.service.js';
import newstagsService from '../services/newstags.service.js';
import commentService from '../services/comment.service.js';

import { isAuth, isSubscriber } from '../middleware/auth.mdw.js';

import moment from 'moment';
import accountService from '../services/account.service.js';

const router = express.Router();

router.get('/details', async (req, res) => {
    const id = parseInt(req.query.id) || 0;
    const news = await newsService.findbyId(id);

    const category = await categoryService.findbyNewsId(id);
    const taglist = await tagService.findByNewsId(id);
    const relatednews = await newsService.relatedNews(id);
    const commentlist = await commentService.findbyNewId(id);
    const writer = await accountService.findById(news.WriterID);
    // console.log(category);
    if (news.PremiumFlag === 1) {
        if (!req.session.authUser) {
            req.session.retUrl = `/news/byCat?id=${category.CatID}`;
            return res.redirect('/account/login');
        }
        if (req.session.authUser.SubcribeExpireDate < new Date()) {
            return res.redirect(`/news/byCat?id=${category.CatID}&err_message=You dont have permission to view this page`);
        }
    }

    // Check if user is premium, if not, disable function download news as pdf
    let userPremium = true;
    if (!req.session.authUser || req.session.authUser.SubcribeExpireDate < new Date()) {
        userPremium = false;
    }

    const change = {
        ViewCount: news.ViewCount + 1,
    }
    await newsService.patch(id, change);


    res.render('vwNews/news-detail.hbs', {
        category: category,
        news: news,
        writer: writer,
        taglist: taglist,
        relatedNews: relatednews,
        commentList: commentlist,
        userPremium: userPremium,
    });
});

router.post('/details', isAuth, async (req, res) => {
    const newDate = new Date();
    const formattedDate = moment(newDate).format('YYYY-MM-DD HH:mm:ss');
    const entity = {
        NewsID: req.body.newsId,
        AccountID: req.session.authUser.Id,
        Content: req.body.txtComment,
        Date: formattedDate,
    };
    await commentService.add(entity);
    res.redirect(`/news/details?id=${req.body.newsId}`);

});

//danh sách sản phẩm theo category
router.get('/byCat', async (req, res) => {
    const id = parseInt(req.query.id) || 0;
    const err_message = req.query.err_message;
    const limit = 4;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;
    //Phân trang
    //const nRows = await newsService.countByCatId(id);
    const nRows = await newsService.countByCatIdFillGuest(id);
    const nPages = Math.ceil(nRows.total / limit);
    const page_items = [];
    for (let i = 1; i <= nPages; i++) {
        const item = {
            value: i,
            isActive: i === page,
        }
        page_items.push(item);
    }

    //let list = await newsService.findPageByCatId(id, limit, offset);
    let list = await newsService.findPageByCatIdFillGuest(id, limit, offset);
    const category = await categoryService.findById(id);

    // Fetch tags for each news item
    for (let news of list) {
        const tags = await newstagsService.getTagsByNewsId(news.NewsID);
        news.tags = [];
        for (let tag of tags) {
            const tagName = await tagService.findById(tag.TagID);
            news.tags.push({ tagName });
        }
        // console.log(news.tags);
    }

    list = list.sort((a, b) => b.PremiumFlag - a.PremiumFlag);


    res.render('vwNews/news-category', {
        news: list,
        empty: list.length === 0,
        page_items: page_items,
        catId: id,
        err_message: err_message,
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
    const nRows = await newstagsService.countByTagIdFilter(id);
    const nPages = Math.ceil(nRows.total / limit);
    const page_items = [];
    for (let i = 1; i <= nPages; i++) {
        const item = {
            value: i,
            isActive: i === page,
        }
        page_items.push(item);
    }
    let list = await newsService.findPageByTagIdFilter(id, limit, offset);
    const tag = await tagService.findById(id);

    list = list.sort((a, b) => b.PremiumFlag - a.PremiumFlag);

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

router.get('/search', async (req, res) => {
    const keyword = req.query.keyword || '';
    const limit = 4;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;
    //Phân trang
    const nRows = await newsService.countBySearch(keyword);
    const nPages = Math.ceil(nRows.total / limit);
    const page_items = [];
    for (let i = 1; i <= nPages; i++) {
        const item = {
            value: i,
            isActive: i === page,
        }
        page_items.push(item);
    }
    const list = await newsService.searchNews(keyword, limit, offset);
    list.pop();
    // console.log(list);

    res.render('vwNews/news-search', {
        news: list,
        empty: list.length === 0,
        page_items: page_items,
        keyword: keyword,
        isFirstPage: page === 1,
        isLastPage: page === nPages,
        previousPage: page > 1 ? page - 1 : 1,
        nextPage: page < nPages ? page + 1 : nPages,
    });
});

export default router;



