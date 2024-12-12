import express from 'express';
import bcrypt from 'bcryptjs';
import moment from 'moment';

import accountService from '../services/account.service.js';
import { isAuth } from '../middleware/auth.mdw.js';

const router = express.Router();

router.get('/register', function (req, res) {
    res.render('vwAccount/register');
});


router.post('/register', async function (req, res) {
    const hash_password = bcrypt.hashSync(req.body.raw_password, 8);
    const ymd_dob = moment(req.body.raw_dob, 'DD/MM/YYYY').format('YYYY-MM-DD');
    const entity = {
        Email: req.body.email,
        Password: hash_password,
        Name: req.body.name,
        PenName: req.body.pen_name,
        Dob: ymd_dob,
        Role: 1
    }
    const ret = await accountService.add(entity);
    res.render('vwAccount/register');
});

router.get('/is-available', async function (req, res) {
    const email = req.query.email;
    if (!email) {
        // Use for Update Password
        const user = req.session.authUser;
        const old_password = req.query.old_password;
        if (bcrypt.compareSync(old_password, user.Password)) {
            return res.json(true);
        }
    } else {
        // Use for Register
        const user = await accountService.findByEmail(email);
        if (!user) {
            return res.json(true);
        }
    }
    res.json(false);
});

router.get('/login', function (req, res) {
    res.render('vwAccount/login');
});

router.post('/login', async function (req, res) {
    const user = await accountService.findByEmail(req.body.email);
    if (!user) {
        return res.render('vwAccount/login', {
            showErrors: true
        });
    }
    if (!bcrypt.compareSync(req.body.raw_password, user.Password)) {
        return res.render('vwAccount/login', {
            showErrors: true
        });
    }

    // Save session
    req.session.authUser = user;
    req.session.auth = true;

    // Load previous path
    const retUrl = req.session.retUrl || '/';
    req.session.retUrl = null;

    //Access previous path
    res.redirect(retUrl);
});

router.get('/profile', isAuth, function (req, res) {
    res.render('vwAccount/profile', {
        user: req.session.authUser,
    });
});

router.get('/update-password', isAuth, function (req, res) {
    res.render('vwAccount/update-password', {
        user: req.session.authUser,
    });
});

router.post('/update-password', isAuth, async function (req, res) {
    const hash_password = bcrypt.hashSync(req.body.raw_password, 8);
    const entity = {
        Id: req.session.authUser.Id,
        Password: hash_password
    }
    await accountService.updatePassword(entity);
    res.redirect('/account/profile');
});

router.get('/logout', isAuth, function (req, res) {
    req.session.auth = false;
    req.session.authUser = null;
    req.session.retUrl = null;
    res.redirect('/');
});

export default router;