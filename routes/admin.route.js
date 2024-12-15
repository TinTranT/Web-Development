import express from 'express';
import categoryService from '../services/category.service.js';
import newsService from '../services/news.service.js';
import tagService from '../services/tag.service.js';
import newstagsService from '../services/newstags.service.js';

const router = express.Router();

router.use(function (req, res, next) {
    res.locals.items = [
        { label: 'Users', url: '/admin/', icon: 'bi bi-speedometer', isDropdown: false },
        { label: 'Articles', url: '/admin/articles', icon: 'bi bi-speedometer', isDropdown: false },
        { 
            label: 'Settings', 
            icon: 'bi bi-gear', 
            isDropdown: true,
            options: [
                { label: 'Profile', url: '/profile', icon: 'bi bi-person-circle' },
                { label: 'Privacy', url: '/privacy', icon: 'bi bi-shield-lock' }
            ]
        }
    ]
    next();
});

router.get('/', (req, res) => {
    res.render('vwAdmin/users', {
        layout: 'user',
    });
})

router.get('/articles', (req, res) => {
    res.render('vwAdmin/articles', {
        layout: 'user',
    });
})

// ----------------- Category -----------------

router.get('/categories', async (req, res) => {
    const listCat = await categoryService.findallwithParent();
    // console.log(listCat);

    res.render('vwAdmin/categories', {
        layout: 'user',
        listCat: listCat,
        
    });
})

router.get('/categories/add', async (req, res) => {
    const listCat = await categoryService.findNoParent();
    // console.log(listCat);
    res.render('vwAdmin/categoriesAdd', {
        layout: 'user',
        listCat: listCat,
    });
    
});

router.post('/categories/add', async (req, res) => {
    const listCat = await categoryService.findNoParent();
    // console.log(entity);
    const entity = {
        CatName: req.body.categoryName,
        CatParentID: req.body.categoryParent,
    }
    await categoryService.add(entity);
    res.render('vwAdmin/categoriesAdd', {
        layout: 'user',
        listCat: listCat,
    });
});

router.get('/categories/edit', async (req, res) => {
    const id = +req.query.id || 0;
    const data = await categoryService.findById(id);
    const listCat = await categoryService.findNoParent();
    if(!data) {
        return res.redirect('/admin/categories');
    }
    res.render('vwAdmin/categoriesEdit', {
        layout: 'user',
        category: data,
        listCat: listCat,
    });
});

//Hàm xử lý xóa category - ko có giao diện
router.post('/categories/del', async (req, res) => {
    await categoryService.del(req.body.categoryId);
    res.redirect('/admin/categories');
});

router.get('/categories/is-using', async (req, res) => {
    const catid = req.query.catid;
    const checkSubCat = await categoryService.countSubCat(catid);
    const checkNews = await newsService.countByTagId(catid);
    console.log("checkSubCat:");
    console.log(checkSubCat);
    console.log("checknews:");
    console.log(checkNews);
    const subCatTotal = checkSubCat.length > 0 ? checkSubCat[0].total : 0;
    const newsTotal = checkNews.total;
    if(subCatTotal > 0 || newsTotal > 0) {
        return res.json(false);
    }
    return res.json(true);
});

//hàm xử lý update category - ko có giao diện
router.post('/categories/patch', async (req, res) => {
    const id = parseInt(req.body.categoryId);
    const changes = {
        CatName: req.body.categoryName,
        CatParentID: req.body.categoryParent,
    }
    await categoryService.patch(id,changes);
    res.redirect('/admin/categories');
});

// ----------------- Tags -----------------

router.get('/tags', async (req, res) => {
    const listTag = await tagService.findall();
    console.log(listTag);
    
    res.render('vwAdmin/tags', {
        layout: 'user',
        listTag: listTag,
    });
})

router.get('/tags/add', async (req, res) => {
    res.render('vwAdmin/tagsAdd', {
        layout: 'user',
    });
});

router.post('/tags/add', async (req, res) => {
    const entity = {
        TagName: req.body.tagName,
    }
    await tagService.add(entity);
    res.render('vwAdmin/tagsAdd', {
        layout: 'user',
    });
});

router.get('/tags/edit', async (req, res) => {
    const id = +req.query.id || 0;
    const data = await tagService.findById(id);
    console.log(data);
    if(!data) {
        return res.redirect('/admin/tags');
    }
    res.render('vwAdmin/tagsEdit', {
        layout: 'user',
        tag: data,
    });
});

router.post('/tags/del', async (req, res) => {
    await tagService.del(req.body.tagId);
    res.redirect('/admin/tags');
});

router.get('/tags/is-using', async (req, res) => {
    const tagid = req.query.id;
    // console.log(tagid);
    const checkNews = await newstagsService.countByTagId(tagid);
    const newsTotal = checkNews.total;
    if(newsTotal > 0) {
        return res.json(false);
    }
    return res.json(true);
});

router.post('/tags/patch', async (req, res) => {
    const id = parseInt(req.body.tagId);
    const changes = {
        TagName: req.body.tagName,
    }
    await tagService.patch(id,changes);
    res.redirect('/admin/tags');
});



export default router;