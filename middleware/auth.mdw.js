export function isAuth(req, res, next) {
    if (!req.session.auth) {
        req.session.retUrl = req.originalUrl; // Save current path before kicking user to login page
        return res.redirect('/account/login');
    }
    next();
}

export function isAdmin(req, res, next) {
    if (req.session.authUser.permission === 4) {
        return res.redirect('403');
    }
    next();
}