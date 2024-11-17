import express from 'express';
const router = express.Router();

router.get('/',(req,res) => {
    res.render('vwEditor/editor', {
        layout: false,
        Buttons: [
            { label: 'your info', url: '/editor/info', icon: 'bi bi-file-earmark' },
            { label: 'Draft Article', url: '/editor/draft', icon: 'bi bi-archive' },
        ]
    });
})
export default router;