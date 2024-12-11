export function isAuth(req, res ,next) {
    if(!req.session.auth)
    {
        req.session.retUrl = req.originalUrl // lưu lại url hiện tại
        return res.redirect('/account/login');
    }
    next();
}