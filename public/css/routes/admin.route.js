import express from 'express';
const router = express.Router();
router.get('/',(req,res) => {
    res.render('vwAdmin/admin', {
        layout: false,
        Buttons: [
            { label: 'Article', url: '/admin/article', icon: 'bi bi-file-earmark' },
            { label: 'Category', url: '/admin/category', icon: 'bi bi-archive' },
            { label: 'Tag', url: '/admin/tags', icon: 'bi bi-tag' },
            { label: 'User', url:'/admin/user', icon: 'bi bi-person',id:'1'}
        ],
        DropdownButtons: [
            { label: 'Subscriber', url: '/admin/subscriberlist', icon: 'bi bi-person-check', id:'1'},
            { label: 'Writer', url: '/admin/writerlist', icon: 'bi bi-journal-text' ,id:'1'},
            { label: 'Editor', url: '/admin/editorlist', icon: 'bi bi-pencil',id:'1' }
        ]
    });
})
export default router;