import express from 'express';
import multer from 'multer';
import categoryService from '../services/category.service.js';
const router = express.Router();



router.use(function(req, res, next) {
    res.locals.Buttons =[
        { label: 'Dashboard', url: '/reporter/dashboard', icon: 'bi bi-file-earmark' },
        { label: 'Post', url: '/reporter/post', icon: 'bi bi-archive', id:'2' },

    ]
    res.locals.DropdownButtons = [
        { label: 'Add News', url: '/reporter/news', icon: 'bi bi-journal-text', id: '2' },
        { label: 'Category&Tag', url: '/reporter/category&tag', icon: 'bi bi-person-check', id: '2' },
    ];
    next();
})

router.get('*', (req, res) => {
    const currentPath = req.originalUrl;
    res.render('vwReporter/mainreporter', 
        { 
            layout: 'admin',
            currentPath 
        });
});


router.get('/', function(req, res){
    res.render('vwReporter/mainreporter', {
        layout: 'admin',
       
    });
})
router.get('/dashboard',function(req, res){
    res.render('vwReporter/mainreporter',{
        layout: 'admin',
        
    })
})
router.get('/category&tag',function(req,res){

    res.render('vwReporter/mainreporter',{
        layout: 'admin',
    })
    
})
router.get('/news', async function(req,res){
    const list = await categoryService.findall();
    console.log(list);

    res.render('vwReporter/mainreporter',{
        layout: 'admin',
        categories: list
    })
})

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