import express from 'express';
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
            layout: false,
            currentPath 
        });
});


router.get('/', function(req, res){
    res.render('vwReporter/mainreporter', {
        layout: false,
       
    });
})
router.get('/dashboard',function(req, res){
    res.render('vwReporter/mainreporter',{
        layout: false,
        
    })
})
router.get('/category&tag',function(req,res){

    res.render('vwReporter/mainreporter',{
        layout: false,
    })
    
})
router.get('/news',function(req,res){
    res.render('vwReporter/mainreporter',{
        layout: false,
    })
})
export default router;