import express from 'express';
import multer from 'multer';
import categoryService from '../services/category.service.js';
import newsService from '../services/news.service.js';
import tagService from '../services/tag.service.js';
import newstagsService from '../services/newstags.service.js';
import accountService from '../services/account.service.js';
import { parse } from 'date-fns';

const router = express.Router();

router.use(function (req, res, next) {
    res.locals.items = [
        { label: 'Dashboard', url: '/reporter?account=5', icon: 'bi bi-file-earmark', isDropdown: false },
        { label: 'Add News', url: '/reporter/news', icon: 'bi bi-journal-text', isDropdown: false },
        { label: 'Category', url: '/reporter/category', icon: 'bi bi-person-check', isDropdown: false,}
        // {
        //     label: 'Post',
        //     icon: 'bi bi-archive',
        //     isDropdown: true,
        //     options: [
        //         { label: 'Add News', url: '/reporter/news', icon: 'bi bi-journal-text' },
        //         { label: 'Category', url: '/reporter/category', icon: 'bi bi-person-check' }
        //     ]
        // }
    ]
    next();
});




router.get('/', async function (req, res) {
    const account = parseInt(req.query.account) || 0;
    const writer = await accountService.findById(account);
    res.render('vwReporter/mainreporter', {
        layout: 'user',
        user: writer

    })
})
router.get('/category', async function (req, res) {
    // const id = parseInt(req.query.id) || 0;
    // const limit = 4;
    // const page = parseInt(req.query.page) || 1;
    // const offset = (page - 1) * limit;
    // //Phân trang
    // const nRows = await newsService.countByCatId(id);
    // const nPages = Math.ceil(nRows.total / limit);
    // const page_items = [];
    // for (let i = 1; i <= nPages; i++) {
    //     const item = {
    //         value: i,
    //         isActive: i === page,
    //     }
    //     page_items.push(item);
    // }
    // const news = await newsService.findPageByCatId(id, limit,offset);
    // const catList = await categoryService.findWithParent();

    // res.render('vwReporter/listnews', {
    //     layout: 'user',
    //     news: news,
    //     catList: catList,
    //     empty: news.length === 0,
    //     page_items: page_items,
    //     catId: id,
    //     isFirstPage: page === 1,
    //     isLastPage: page === nPages,
    //     previousPage: page > 1 ? page - 1 : 1,
    //     nextPage: page < nPages ? page + 1 : nPages,
    // });



    const account = parseInt(req.query.account) || 0;
    console.log(account);
    const writer = await accountService.findById(account);
    //console.log(writer);
    const CatIDs = await newsService.findCatofWriter(account);
    //console.log(CatIDs);
    const id = parseInt(req.query.id) || 0;
    // if (id === undefined) {
    //     return res.redirect('/reporter/category')
    // }
    // for (const cat of CatIDs) {
    //     if (cat.CatID != id &&) {
    //         return res.redirect('/reporter/category')
    //     }
    // }
    const limit = 4;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;
    //Phân trang
    const nRows = await newsService.findCountCatNewsofWriter(id,account);
    const nPages = Math.ceil(nRows.total / limit);
    const page_items = [];
    for (let i = 1; i <= nPages; i++) {
        const item = {
            value: i,
            isActive: i === page,
        }
        page_items.push(item);
    }
    const news = await newsService.findPageByCatId(id, limit, offset,account);
    const catList = await categoryService.findWithParentAndWriter(account);
    console.log(catList);
    // const tagOfArticle = await newsService.findTagById(id)
    // //console.log(tagOfArticle)
    // const tags = req.body.tags || tagOfArticle
    // const tagObjects = tags.map(tag => ({
    //     NewsID: article.NewsID,  // Gán NewsID
    //     TagID: parseInt(tag) // Chuyển tag thành số (nếu cần)
    // }
    // ));
    res.render('vwReporter/listnews', {
        layout: 'user',
        account: account,
        news: news,
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
                //author: req.session.user.id,
                Status: 0,
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