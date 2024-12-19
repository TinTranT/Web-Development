import express from 'express';
import categoryService from '../services/category.service.js';
import newsService from '../services/news.service.js';
import tagService from '../services/tag.service.js';
import newstagsService from '../services/newstags.service.js';
import accountService from '../services/account.service.js';
import editorcategoryService from '../services/editorcategory.service.js';

import moment from 'moment';
import bcrypt from 'bcryptjs';

const router = express.Router();

router.use(function (req, res, next) {
    res.locals.items = [
        { label: 'Articles', url: '/admin/articles?id=10&page=1', icon: 'bi bi-newspaper', isDropdown: false },
        { label: 'Categories', url: '/admin/categories', icon: 'bi bi-grid', isDropdown: false },
        { label: 'Tags', url: '/admin/tags', icon: 'bi bi-tags', isDropdown: false },
        {
            label: 'Users',
            icon: 'bi bi-person',
            isDropdown: true,
            options: [
                { label: 'Reader', url: '/admin/readers', icon: 'bi bi-person-circle' },
                { label: 'writer', url: '/admin/writers', icon: 'bi bi-shield-lock' },
                { label: 'Editor', url: '/admin/editors', icon: 'bi bi-person-circle' },
                { label: 'Admin', url: '/admin/admins', icon: 'bi bi-shield-lock' },
            ]
        }
    ]
    next();
});

router.get('/', (req, res) => {
    res.redirect('/admin/articles?id=10&page=1');
})

// ------------------ Articles ------------------

router.get('/articles', async (req, res) => {
    const id = parseInt(req.query.id) || 0;
    const limit = 4;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;
    //Phân trang
    const nRows = await newsService.countByCatId(id);
    const nPages = Math.ceil(nRows.total / limit);
    const page_items = [];
    for (let i = 1; i <= nPages; i++) {
        const item = {
            value: i,
            isActive: i === page,
        }
        page_items.push(item);
    }
    const news = await newsService.findPageByCatId(id, limit, offset);
    const catList = await categoryService.findWithParent();

    res.render('vwAdmin/articles', {
        layout: 'user',
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

router.get('/articles/details', async (req, res) => {
    const id = parseInt(req.query.id) || 0;
    const news = await newsService.findbyId(id);
    const category = await categoryService.findbyNewsId(id);
    const taglist = await tagService.findByNewsId(id);
    if (!news) {
        return res.redirect('/admin/articles?id=10&page=1');
    }

    res.render('vwAdmin/articles-detail', {
        layout: 'user',
        category: category,
        news: news,
        taglist: taglist,
    });

});

router.post('/articles/del', async (req, res) => {
    await newstagsService.del(req.body.newsId);
    await newsService.del(req.body.newsId);
    res.redirect('/admin/articles?id=10&page=1');
});

router.post('/articles/patch', async (req, res) => {
    const id = parseInt(req.body.newsId);
    const changes = {
        Status: 3,
    }
    await newsService.patch(id, changes);
    res.redirect('/admin/articles/details?id=' + id);
});

// ----------------- User Add -----------------

router.get('/users-add', async (req, res) => {
    res.render('vwAdmin/usersAdd', {
        layout: 'user',
    });
});

router.post('/users-add', async (req, res) => {
    const hash_password = bcrypt.hashSync(req.body.txtPassword, 10);
    const ymd_dob = moment(req.body.txtDOB, 'DD/MM/YYYY').format('YYYY-MM-DD');
    const entity = {
        Name: req.body.txtName,
        Email: req.body.txtEmail,
        PenName: req.body.txtPenName,
        Password: hash_password,
        Dob: ymd_dob,
        Role: parseInt(req.body.txtRole),
    }
    console.log(entity);
    await accountService.add(entity);
    res.redirect('/admin/users-add');
});

router.get('/users-add/is-available', async (req, res) => {
    const email = req.query.email;
    const user = await accountService.findByEmail(email);
    if (!user) {
        return res.json(true);
    }
    res.json(false);
});

// ----------------- Readers -----------------

router.get('/readers', async (req, res) => {
    const limit = 8;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;
    //Phân trang
    const nRows = await accountService.countByRole(1);
    const nPages = Math.ceil(nRows.total / limit);
    const page_items = [];
    for (let i = 1; i <= nPages; i++) {
        const item = {
            value: i,
            isActive: i === page,
        }
        page_items.push(item);
    }
    const listReader = await accountService.findPageByRole(1, limit, offset);
    // console.log(listReader);
    res.render('vwAdmin/readers', {
        layout: 'user',
        listReader: listReader,
        empty: listReader.length === 0,
        page_items: page_items,
        isFirstPage: page === 1,
        isLastPage: page === nPages,
        previousPage: page > 1 ? page - 1 : 1,
        nextPage: page < nPages ? page + 1 : nPages,
    });
});

router.get('/readers/edit', async (req, res) => {
    const id = +req.query.id || 0;
    const data = await accountService.findById(id);
    // console.log(data);
    if (!data || data.Role !== 1) {
        return res.redirect('/admin/readers');
    }
    res.render('vwAdmin/readersEdit', {
        layout: 'user',
        reader: data,
    });
});

router.post('/readers/edit', async (req, res) => {
    const id = parseInt(req.body.txtID);
    var totalExpiredDate = null;
    // Tính toán totalExpiredDate
    if (req.body.txtSubExpiredDate != '__') {
        const baseDate = moment(req.body.txtSubExpiredDate, 'DD/MM/YYYY');
        const extendDays = parseInt(req.body.txtExtendExpiredDays, 10);

        if (!baseDate.isValid() || isNaN(extendDays)) {
            return res.status(400).send('Invalid date or extend days');
        }

        totalExpiredDate = baseDate.add(extendDays, 'days').format('DD/MM/YYYY');
    }

    const changes = {
        Name: req.body.txtName,
        Email: req.body.txtEmail,
        PenName: req.body.txtPenName,
        Dob: moment(req.body.txtDOB, 'DD/MM/YYYY').format('YYYY-MM-DD'),
        Role: parseInt(req.body.txtRole),
        SubcribeExpireDate: moment(totalExpiredDate, 'DD/MM/YYYY').format('YYYY-MM-DD')
    }
    await accountService.patch(id, changes);
    res.redirect('/admin/readers');
});

router.post('/readers/del', async (req, res) => {
    await accountService.del(req.body.txtID);
    res.redirect('/admin/readers');
});

// ------------------   Writers   ------------------

router.get('/writers', async (req, res) => {
    const limit = 8;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;
    //Phân trang
    const nRows = await accountService.countByRole(2);
    const nPages = Math.ceil(nRows.total / limit);
    const page_items = [];
    for (let i = 1; i <= nPages; i++) {
        const item = {
            value: i,
            isActive: i === page,
        }
        page_items.push(item);
    }
    const listWriter = await accountService.findPageByRole(2, limit, offset);
    res.render('vwAdmin/writers', {
        layout: 'user',
        listWriter: listWriter,
        empty: listWriter.length === 0,
        page_items: page_items,
        isFirstPage: page === 1,
        isLastPage: page === nPages,
        previousPage: page > 1 ? page - 1 : 1,
        nextPage: page < nPages ? page + 1 : nPages,
    });
});

router.get('/writers/edit', async (req, res) => {
    const id = +req.query.id || 0;
    const data = await accountService.findById(id);
    if (!data || data.Role !== 2) {
        return res.redirect('/admin/writers');
    }
    res.render('vwAdmin/writersEdit', {
        layout: 'user',
        writer: data,
    });
});

router.post('/writers/edit', async (req, res) => {
    const id = parseInt(req.body.txtID);
    const changes = {
        Name: req.body.txtName,
        Email: req.body.txtEmail,
        PenName: req.body.txtPenName,
        Dob: moment(req.body.txtDOB, 'DD/MM/YYYY').format('YYYY-MM-DD'),
        Role: parseInt(req.body.txtRole),
    }
    await accountService.patch(id, changes);
    res.redirect('/admin/writers');
});

router.post('/writers/del', async (req, res) => {
    await accountService.del(req.body.txtID);
    res.redirect('/admin/writers');
});

// ------------------ Editors ------------------
router.get('/editors', async (req, res) => {
    const limit = 8;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;
    //Phân trang
    const nRows = await accountService.countByRole(3);
    const nPages = Math.ceil(nRows.total / limit);
    const page_items = [];
    for (let i = 1; i <= nPages; i++) {
        const item = {
            value: i,
            isActive: i === page,
        }
        page_items.push(item);
    }
    const listEditor = await accountService.findPageByRole(3, limit, offset);
    res.render('vwAdmin/editors', {
        layout: 'user',
        listEditor: listEditor,
        empty: listEditor.length === 0,
        page_items: page_items,
        isFirstPage: page === 1,
        isLastPage: page === nPages,
        previousPage: page > 1 ? page - 1 : 1,
        nextPage: page < nPages ? page + 1 : nPages,
    });
});

router.get('/editors/edit', async (req, res) => {
    const id = +req.query.id || 0;
    const data = await accountService.findById(id);
    const listCategory = await categoryService.findWithParent();
    const listEditorCat = await editorcategoryService.findbyAccountID(id);
    console.log(listEditorCat);
    if (!data || data.Role !== 3) {
        return res.redirect('/admin/editors');
    }
    res.render('vwAdmin/editorsEdit', {
        layout: 'user',
        editor: data,
        categories: listCategory,
        editorCat: listEditorCat,
    });
});

router.post('/editors/edit', async (req, res) => {
    const id = parseInt(req.body.txtID);
    console.log(req.body);
    const changes = {
        Name: req.body.txtName,
        Email: req.body.txtEmail,
        PenName: req.body.txtPenName,
        Dob: moment(req.body.txtDOB, 'DD/MM/YYYY').format('YYYY-MM-DD'),
        Role: parseInt(req.body.txtRole),
    }
    if (req.body.txtCategories != null) {
        const catList = req.body.txtCategories;
        await editorcategoryService.del(id);
        for (let i = 0; i < catList.length; i++) {
            const entity = {
                AccountID: id,
                CatID: catList[i],
            }
            await editorcategoryService.add(entity);
        }
    }
    await accountService.patch(id, changes);
    res.redirect('/admin/editors');
});

router.post('/editors/del', async (req, res) => {
    await accountService.del(req.body.txtID);
    res.redirect('/admin/editors');
});

// ----------------- Admins -----------------

router.get('/admins', async (req, res) => {
    const limit = 8;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;
    //Phân trang
    const nRows = await accountService.countByRole(4);
    const nPages = Math.ceil(nRows.total / limit);
    const page_items = [];
    for (let i = 1; i <= nPages; i++) {
        const item = {
            value: i,
            isActive: i === page,
        }
        page_items.push(item);
    }
    const listAdmin = await accountService.findPageByRole(4, limit, offset);
    res.render('vwAdmin/admins', {
        layout: 'user',
        listAdmin: listAdmin,
        empty: listAdmin.length === 0,
        page_items: page_items,
        isFirstPage: page === 1,
        isLastPage: page === nPages,
        previousPage: page > 1 ? page - 1 : 1,
        nextPage: page < nPages ? page + 1 : nPages,
    });
});

router.get('/admins/edit', async (req, res) => {
    const id = +req.query.id || 0;
    const data = await accountService.findById(id);

    if (!data || data.Role !== 4) {
        return res.redirect('/admin/admins');
    }
    res.render('vwAdmin/adminsEdit', {
        layout: 'user',
        admin: data,
    });
});

router.post('/admins/edit', async (req, res) => {
    const id = parseInt(req.body.txtID);
    const changes = {
        Name: req.body.txtName,
        Email: req.body.txtEmail,
        Dob: moment(req.body.txtDOB, 'DD/MM/YYYY').format('YYYY-MM-DD'),
        Role: parseInt(req.body.txtRole),
    }
    await accountService.patch(id, changes);
    res.redirect('/admin/admins');
});

router.post('/admins/del', async (req, res) => {
    await accountService.del(req.body.txtID);
    res.redirect('/admin/admins');
});


// ----------------- Category -----------------

router.get('/categories', async (req, res) => {
    const limit = 14;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;
    //Phân trang
    const nRows = await categoryService.countall();
    const nPages = Math.ceil(nRows.total / limit);
    const page_items = [];
    for (let i = 1; i <= nPages; i++) {
        const item = {
            value: i,
            isActive: i === page,
        }
        page_items.push(item);
    }
    const listCat = await categoryService.findPagewithParent(limit, offset);
    res.render('vwAdmin/categories', {
        layout: 'user',
        listCat: listCat,
        empty: listCat.length === 0,
        page_items: page_items,
        isFirstPage: page === 1,
        isLastPage: page === nPages,
        previousPage: page > 1 ? page - 1 : 1,
        nextPage: page < nPages ? page + 1 : nPages,
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
    res.redirect('/admin/categories/add');
});

router.get('/categories/edit', async (req, res) => {
    const id = +req.query.id || 0;
    const data = await categoryService.findById(id);
    const listCat = await categoryService.findNoParent();
    if (!data) {
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
    const checkNews = await newstagsService.countByTagId(catid);
    console.log("checkSubCat:");
    console.log(checkSubCat);
    console.log("checknews:");
    console.log(checkNews);
    const subCatTotal = checkSubCat.length > 0 ? checkSubCat[0].total : 0;
    const newsTotal = checkNews.total;
    if (subCatTotal > 0 || newsTotal > 0) {
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
    await categoryService.patch(id, changes);
    res.redirect('/admin/categories');
});

// ----------------- Tags -----------------

router.get('/tags', async (req, res) => {
    const limit = 8;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;
    //Phân trang
    const nRows = await tagService.countall();
    const nPages = Math.ceil(nRows.total / limit);
    const page_items = [];
    for (let i = 1; i <= nPages; i++) {
        const item = {
            value: i,
            isActive: i === page,
        }
        page_items.push(item);
    }

    const listTag = await tagService.findPage(limit, offset);
    console.log(listTag);

    res.render('vwAdmin/tags', {
        layout: 'user',
        listTag: listTag,
        empty: listTag.length === 0,
        page_items: page_items,
        isFirstPage: page === 1,
        isLastPage: page === nPages,
        previousPage: page > 1 ? page - 1 : 1,
        nextPage: page < nPages ? page + 1 : nPages,
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
    res.redirect('/admin/tags/add');
});

router.get('/tags/edit', async (req, res) => {
    const id = +req.query.id || 0;
    const data = await tagService.findById(id);
    console.log(data);
    if (!data) {
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
    if (newsTotal > 0) {
        return res.json(false);
    }
    return res.json(true);
});

router.post('/tags/patch', async (req, res) => {
    const id = parseInt(req.body.tagId);
    const changes = {
        TagName: req.body.tagName,
    }
    await tagService.patch(id, changes);
    res.redirect('/admin/tags');
});

export default router;