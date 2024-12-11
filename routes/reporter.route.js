import express from 'express';
import multer from 'multer';
import categoryService from '../services/category.service.js';

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

router.get('/news', async function(req,res){
    try {
        const list = await categoryService.findall();
        console.log(list);
        res.render('vwReporter/mainreporter',{
            layout: 'user',
            categories: list
        });
    } catch(err) {
        console.error(err);
        res.status(500).send('Database error');
    }
});

router.post('/news',  function(req, res){

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, './static/imgs')
          // có thể tùy chỉnh thư mục để lưu linh động
        },
        filename: function (req, file, cb) {
          cb(null, file.originalname)
        }
      })
    const upload =multer({storage})
    upload.array('fulMain',5)(req, res,function(err){
        console.log(req.body);
        if(err) {
            console.error(err)
        }
        else{
            res.render('vwMisc/upload');

        }

    })
    //console.log(req.body);
    
})
export default router;