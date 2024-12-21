export function isAuth(req, res, next) {
    if (!req.session.auth) {
        req.session.retUrl = req.originalUrl; // Save current path before kicking user to login page
        return res.redirect('/account/login');
    }
    next();
}

export function isSubscriber(req, res, next) {
    if (req.session.authUser.SubcribeExpireDate < new Date()) {
        return res.redirect('/?err_message=Your subscription has expired');
    }
    next();
}

export function isReporter(req, res, next) {
    if (req.session.authUser.Role !== 2) {
        return res.redirect('/?err_message=You are not a reporter');
    }
    next();
}

export function isEditor(req, res, next) {
    if (req.session.authUser.Role !== 3) {
        return res.redirect('/?err_message=You are not an editor');
    }
    next();
}

export function isAdmin(req, res, next) {
    if (req.session.authUser.Role !== 4) {
        return res.redirect('/?err_message=You are not an admin');
    }
    next();
}
