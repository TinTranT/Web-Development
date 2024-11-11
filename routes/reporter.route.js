import express from 'express';
const router = express.Router();

router.get('/', function(req, res){
    res.render('vwReporter/mainreporter', {
        layout: false,
        Buttons: [
            { label: 'Dashboard', url: '/reporter/dashboard', icon: 'bi bi-file-earmark',id:'1' },
            { label: 'Post', url: '/reporter/post', icon: 'bi bi-archive', id:'2' },
        ],
        DropdownButtons: [
            { label: 'Add News', url: '/reporter/news', icon: 'bi bi-journal-text', id:'1' },
            { label: 'Category&Tag', url: '/reporter/category&tag', icon: 'bi bi-person-check',id:'2' },
        ]
    });
})
export default router;