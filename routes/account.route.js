import express from 'express';
import bcrypt from 'bcryptjs';
import moment from 'moment';
import Swal from 'sweetalert2';
import nodemailer from 'nodemailer'; // Add this line

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

    // Save session
    const user = await accountService.findByEmail(req.body.email);
    req.session.authUser = user;
    req.session.auth = true;

    // Load previous path
    const retUrl = req.session.retUrl || '/';
    req.session.retUrl = null;

    //Access previous path
    res.redirect(retUrl);
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
            err_message: 'Email does not exist.'
        });
    }
    if (!bcrypt.compareSync(req.body.raw_password, user.Password)) {
        return res.render('vwAccount/login', {
            err_message: 'Wrong password.'
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

router.get('/forgot-password', function (req, res) {
    res.render('vwAccount/forgot-password');
});

router.post('/forgot-password', async function (req, res) {
    const user = await accountService.findByEmail(req.body.email);
    if (!user) {
        return res.render('vwAccount/forgot-password', {
            err_message: 'Email does not exist.'
        });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await accountService.updateOTP(user.Id, otp);

    // Send OTP via email
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'testing1tintran2@gmail.com',
            pass: 'rqwn jpqf dydv ccfv'
        }
    });

    // const info = await transporter.sendMail({
    //     from: 'Admin <testing1tintran2@gmail.com>',
    //     to: user.Email,
    //     subject: 'Password Reset OTP',
    //     text: `Your OTP for password reset is ${otp}`
    // });

    const info = await transporter.sendMail({
        from: 'Admin <testing1tintran2@gmail.com>',
        to: user.Email,
        subject: 'Password Reset Request',
        text: `Dear ${user.Name},
    
    We have received a request to reset your password. Please use the following One-Time Password (OTP) to proceed with resetting your password:
    
    OTP: ${otp}
    
    If you did not request a password reset, please ignore this email or contact our support team immediately.
    
    Best regards,
    Insight News Development Team.
    `
    });

    // console.log('Message sent: %s', info.messageId);

    res.redirect(`/account/verify-otp?email=${req.body.email}`);
});

router.get('/verify-otp', function (req, res) {
    res.render('vwAccount/verify-otp', {
        email: req.query.email
    });
});

router.post('/verify-otp', async function (req, res) {
    const user = await accountService.findByEmail(req.body.email);
    if (user.OTP !== req.body.otp) {
        return res.render('vwAccount/verify-otp', {
            err_message: 'Invalid OTP.',
            email: req.body.email
        });
    }

    res.redirect(`/account/reset-password?email=${req.body.email},otp=${req.body.otp}`);
});

router.get('/reset-password', async function (req, res) {
    const email = req.query.email;
    const otp = req.query.otp;

    if (!email || !otp) {
        return res.redirect('/');
    }

    const user = await accountService.findByEmail(email);
    if (!user || user.OTP !== otp) {
        return res.redirect('/');
    }

    res.render('vwAccount/reset-password', {
        email: req.query.email,
        otp: req.query.otp
    });
});

router.post('/reset-password', async function (req, res) {
    const hash_password = bcrypt.hashSync(req.body.raw_password, 8);
    await accountService.updatePasswordByEmail(req.body.email, hash_password);
    res.redirect('/account/login');
});

router.get('/profile', isAuth, function (req, res) {
    res.render('vwAccount/profile', {
        user: req.session.authUser,
    });
});

router.get('/update-profile', isAuth, function (req, res) {
    res.render('vwAccount/update-profile', {
        user: req.session.authUser,
    });
});

router.post('/update-profile', isAuth, async function (req, res) {
    const user = await accountService.findByEmail(req.session.authUser.Email);
    user.Name = req.body.name;
    user.PenName = req.body.penname;
    user.Dob = moment(req.body.dob, 'DD/MM/YYYY').format('YYYY-MM-DD');
    req.session.authUser = user;
    const ret = await accountService.update(user);
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