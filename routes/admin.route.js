import express from 'express';
import categoryService from '../services/category.service.js';

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

router.get('/categories', async (req, res) => {
    const listCat = await categoryService.findallwithParent();
    // console.log(listCat);

    res.render('vwAdmin/categories', {
        layout: 'user',
        listCat: listCat,
        
    });
})

router.get('/categories/add', async (req, res) => {
    const listCat = await categoryService.findall();
    // console.log(listCat);

    res.render('vwAdmin/categoriesAdd', {
        layout: 'user',
        listCat: listCat,
        
    });
});

router.get('/tags', (req, res) => {
    res.render('vwAdmin/tags', {
        layout: 'user',
    });
})

export default router;