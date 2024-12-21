import express from 'express';
import multer from 'multer';
import categoryService from '../services/category.service.js';
import newsService from '../services/news.service.js';
import tagService from '../services/tag.service.js';
import newstagsService from '../services/newstags.service.js';

import accountService from '../services/account.service.js';
import rejectreason from '../services/rejectreason.service.js';
import { parse } from 'date-fns';

const router = express.Router();

router.use(function (req, res, next) {
    //const account = req.session.authUser.Id;
    res.locals.items = [
        //{ label: 'Dashboard', url: '/reporter?account', icon: 'bi bi-file-earmark', isDropdown: false },
        { label: 'Add News', url: '/reporter/news', icon: 'bi bi-journal-text', isDropdown: false },
        { label: 'Category', url: '/reporter/category', icon: 'bi bi-person-check', isDropdown: false,}
    ]
    next();
});



function PreviousUrl(req, res, next) {
    req.session.PreviousUrl = req.originalUrl;
    next();
};
router.get('/', function (req, res) {
    res.redirect('/reporter/category');
})
router.get('/category', PreviousUrl,async function (req, res) {
    //console.log(req.session.PreviousUrl)
    
    //const account = parseInt(req.query.account) || 0;
    const account = req.session.authUser.Id;
    //account = writer.Id;
    const id = parseInt(req.query.id) || 0;
    const writer = await accountService.findById(account);
    const limit = 4;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;

    let nRows, news;

    // Kiểm tra nếu id (category) = 0 thì lấy tất cả bài viết
    if (id === 0) {
        nRows = await newsService.findCountAllByAccount(account); // Tổng số bài viết
        news = await newsService.findPageByAccount(account, limit, offset); // Lấy tất cả bài viết
    } else {
        nRows = await newsService.findCountCatNewsofWriter(id, account); // Tổng số bài theo category
        news = await newsService.findPageByCatId2(id, limit, offset, account); // Lấy bài theo category
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

    const catList = await categoryService.findWithParentAndWriter(account);
    res.render('vwReporter/listnews', {
        layout: 'user',
        account: account,
        news: news,
        writer: writer,
        catList: catList,
        empty: news.length === 0,
        page_items: page_items,
        catId: id,
        isFirstPage: page === 1,
        isLastPage: page === nPages,
        previousPage: page > 1 ? page - 1 : 1,
        nextPage: page < nPages ? page + 1 : nPages,
    });



})
router.get('/detail', async function (req, res) {
    const id = parseInt(req.query.id) || 0;
    const news = await newsService.findbyId(id);
    //console.log(news);
    const categories = await categoryService.findById(news.CatID)
    const listTagArticle = await newsService.findTagByIdOfNew(id)
    const previousPage =  req.session.PreviousUrl 
    req.session.PreviousUrl = null;
    //console.log(listTagArticle);
    //console.log(news[0].title);
    res.render('vwReporter/detail', {
        layout: 'user',
        news: news,
        categories: categories,
        tags: listTagArticle,
        previousPage: previousPage
    });
})
router.get('/rejected', async function (req, res) {
    const id = parseInt(req.query.id) || 0;
    const reject = await rejectreason.findRejectById(id);
    console.log(id, reject.EditorID)
    const editor = await accountService.findById(reject.EditorID);
    console.log(editor)
    const previousPage =  req.session.PreviousUrl 
    req.session.PreviousUrl = null;

    res.render('vwReporter/reject', {
        layout: 'user',
        reject: reject,
        editor: editor,
        previousPage: previousPage
    })


})
router.get('/news', async function (req, res) {
    const listCategory = await categoryService.findWithParent();
    const listTag = await tagService.findall();
    res.render('vwReporter/postnews', {
        layout: 'user',
        categories: listCategory,
        tags: listTag
    });

});
router.get('/editnews', async function (req, res) {
    const id = +req.query.id || 0;

    const listCategory = await categoryService.findWithParent();
    const listTag = await tagService.findall();
    const article = await newsService.findbyId(id);
    const listTagArticle = await newsService.findTagById(id)
    const categoryArticle = await newsService.findCategoryById(id)
    //console.log(article.Thumbnail)
    //console.log(listTagArticle)
    //console.log(categoryArticle)
    if (!article) res.redirect('/reporter/category')
    res.render('vwReporter/editnews', {
        layout: 'user',
        categories: listCategory,
        tags: listTag,
        tagsArticle: listTagArticle,
        categoryArticle: categoryArticle,
        article: article    
    });
});
router.post('/editnews', async function (req, res) {
    const id = +req.query.id || 0;
    const article = await newsService.findbyId(id);
    if (!article) {
        res.redirect('/reporter/category')
        return;
    }
    // console.log(id);
    //console.log(article);
    let nameThumnail = ''
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './static/imgs')
            // có thể tùy chỉnh thư mục để lưu linh động
        },
        filename: function (req, file, cb) {
            nameThumnail = file.originalname
            cb(null, file.originalname)
        }
    })
    const upload = multer({ storage })
    upload.array('fulMain', 1)(req, res, async function (err) {
        // console.log(req.body);
        if (err) {
            console.error(err)
        }
        else {
            const news = {
                Title: req.body.title || article.Title,
                Content: req.body.content || article.Content,
                Abstract: req.body.abstract || article.Abstract,
                Thumbnail: nameThumnail || article.Thumbnail,
                //PremiumFlag: req.body.premium,
                CatID: req.body.categories || article.CatID,
                Status: 1,
            }

            //console.log(news)
            // console.log(req.body.tags)
            const newspost = await newsService.updateNews(id, news);
            //console.log(lastnews)
            const tagOfArticle = await newsService.findTagById(id)
            //console.log(tagOfArticle)
            const tags = req.body.tags || tagOfArticle
            const tagObjects = tags.map(tag => ({
                NewsID: article.NewsID,  // Gán NewsID
                TagID: parseInt(tag) // Chuyển tag thành số (nếu cần)
            }
            ));
            await newsService.delTag(id);
            await newstagsService.addTag(tagObjects)
            res.redirect(`/reporter/editnews?id=${id}`);

        }

    })



})
router.post('/news', async function (req, res) {
    // console.log(req.body);
    // console.log(1)
    // res.redirect('/reporter/news');
    let nameThumnail = ''
    // writer = req.session.authUser
    // account = writer.Id
    const account = req.session.authUser.Id;

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './static/imgs')
            // có thể tùy chỉnh thư mục để lưu linh động
        },
        filename: function (req, file, cb) {
            //   const ext = path.extname(file.originalname);
            //   const newName = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext
            //   nameThumnail = newName
            //   cb(null, newName)
            nameThumnail = file.originalname
            cb(null, file.originalname)
        }
    })
    const upload = multer({ storage })
    upload.array('fulMain', 1)(req, res, async function (err) {
        //console.log(req.body);
        //console.log(nameThumnail)
        const date = new Date();
        const formattedDate = date.toISOString().split('T')[0];
        if (err) {
            console.error(err)
        }
        else {
            const news = {
                Title: req.body.title,
                Content: req.body.content,
                Abstract: req.body.abstract,
                Thumbnail: nameThumnail,
                WriterId: account,
                Status: 1,
                //PremiumFlag: req.body.premium,
                //PublishDate: formattedDate,
                CatID: req.body.categories,
            }
            // console.log(news)
            // console.log(req.body.tags)
            const newspost = await newsService.addNews(news);
            const lastnews = await newsService.findlast()
            //console.log(lastnews)
            const tags = req.body.tags
            const tagObjects = tags.map(tag => ({
                NewsID: lastnews.NewsID,  // Gán NewsID
                TagID: parseInt(tag) // Chuyển tag thành số (nếu cần)
            }));
            console.log(tagObjects);
            const newtag = await newstagsService.addTag(tagObjects)
            res.redirect('/reporter/news');

        }

    })


})
export default router;