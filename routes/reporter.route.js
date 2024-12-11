import express from 'express';
const router = express.Router();



router.use(function (req, res, next) {
    res.locals.items = [
        { label: 'Dashboard', url: '/reporter/dashboard', icon: 'bi bi-file-earmark', isDropdown: false },
        {
            label: 'Post',
            icon: 'bi bi-archive',
            isDropdown: true,
            options: [
                { label: 'Add News', url: '/reporter/news', icon: 'bi bi-journal-text' },
                { label: 'Category&Tag', url: '/reporter/category&tag', icon: 'bi bi-person-check' }
            ]
        }
    ]
    next();
});

router.get('*', (req, res) => {
    const currentPath = req.originalUrl;
    res.render('vwReporter/mainreporter',
        {
            layout: 'user',
            currentPath
        });
});


router.get('/', function (req, res) {
    res.render('vwReporter/mainreporter', {
        layout: 'user',
        items: res.locals.items,

    });
})
router.get('/dashboard', function (req, res) {
    res.render('vwReporter/mainreporter', {
        layout: 'user',

    })
})
router.get('/category&tag', function (req, res) {

    res.render('vwReporter/mainreporter', {
        layout: 'user',
    })

})
router.get('/news', function (req, res) {
    res.render('vwReporter/mainreporter', {
        layout: 'user',
    })
})
export default router;