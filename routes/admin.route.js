import express from 'express';
const router = express.Router();

router.use(function (req, res, next) {
    res.locals.items = [
        { label: 'Dashboard', url: '/dashboard', icon: 'bi bi-speedometer', isDropdown: false },
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
    res.render('vwAdmin/admin', {
        layout: 'user',
    });
})
export default router;