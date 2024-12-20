import express from 'express';
import { isAuth, isEditor } from '../middleware/auth.mdw.js';
import categoryService from '../services/category.service.js';
import newsService from '../services/news.service.js';
import tagService from '../services/tag.service.js';
import accountService from '../services/account.service.js';
import newstagsService from '../services/newstags.service.js';
const router = express.Router();

router.use(function (req, res, next) {
    //const account = req.session.authUser.Id;
    res.locals.items = [
        { label: 'Draft Article', url: '/editor/draft-articles', icon: 'bi bi-archive', isDropdown: false },
    ]
    next();
});
router.get('/', function(req, res) {
    res.redirect('/editor/draft-articles');
});

router.get('/draft-articles', PreviousUrl, async function (req, res) {
    const accountID = req.session.authUser.Id;
    // const cat = await newsService.findNewsofEditor(accountID);
    const catlist = await categoryService.findWithParentAndEditor(accountID);

    const id = parseInt(req.query.id) || 0;
    const limit = 4;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;
    let nRows, news;
    if (id === 0) {
        nRows = await newsService.findCountAllArticles(accountID); // Tổng số bài viết
        news = await newsService.findPageForAllArticles(accountID, limit, offset); // Lấy tất cả bài viết
    } else {
        nRows = await newsService.findCountArticlesByCat(id, accountID); // Tổng số bài theo category
        news = await newsService.findPageForArticlesByCat(id, limit, offset, accountID); // Lấy bài theo category
    }
    const nPages = Math.ceil(nRows.total / limit);
    const page_items = [];
    for (let i = 1; i <= nPages; i++) {
        const item = {
            value: i,
            isActive: i === page,
        }
        page_items.push(item);
    }
    // console.log(cat);
    res.render('vwEditor/draft-articles', {
        layout: 'user',
        news: news,
        catList: catlist,
        empty: news.length === 0,
        page_items: page_items,
        catId: id,
        isFirstPage: page === 1,
        isLastPage: page === nPages,
        previousPage: page > 1 ? page - 1 : 1,
        nextPage: page < nPages ? page + 1 : nPages,
    });
});
function PreviousUrl(req, res, next) {
    req.session.PreviousUrl = req.originalUrl;
    next();
};
router.get('/draft-articles/detail', async function (req, res){
    const id = parseInt(req.query.id) || 0;
    const news = await newsService.findbyId(id);
    const category = await categoryService.findbyNewsId(id);
    const taglist = await tagService.findByNewsId(id);
    const writer = await accountService.findById(news.WriterID);
    const retUrl = req.session.PreviousUrl || '/editor/draft-articles';
    req.session.PreviousUrl = null;
    res.render('vwEditor/detail', {
        layout: 'user',
        category: category,
        news: news,
        taglist: taglist,
        retUrl: retUrl,
        writer: writer,
    });
});
router.get('/draft-articles/approve', async function (req, res){
    const id = parseInt(req.query.id) || 0;
    const news = await newsService.findbyId(id);
    const category = await categoryService.findbyNewsId(id);
    const taglist = await tagService.findByNewsId(id);
    const writer = await accountService.findById(news.WriterID);
    const listallCategory = await categoryService.findWithParent();
    const listallTag = await tagService.findall();
    const selectedTagIds = new Set(taglist.map(tag => tag.TagID));
    listallTag.forEach(tag => {
        tag.isSelected = selectedTagIds.has(tag.TagID);
    });
    res.render('vwEditor/approve', {
        layout: 'user',
        category: category,
        news: news,
        taglist: taglist,
        writer: writer,
        listallCategory: listallCategory,
        listallTag: listallTag,
    });
});
router.post('/draft-articles/approve', async function (req, res){
    const id = parseInt(req.query.id) || 0;
    // console.log(req.body);
    const changes1 = {
        CatID: req.body.categories,
        PublishDate: req.body.pubdate,
        Status: 2,
    }
    const tags = req.body.tags ;
    const changes2 = tags.map(tag => ({
        NewsID: id, 
        TagID: parseInt(tag)
    }));
    await newsService.updateNews(id, changes1);
    await newsService.delTag(id);
    await newstagsService.addTag(changes2)
    res.redirect('/editor/draft-articles');
});
export default router;