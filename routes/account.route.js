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

    // // Load previous path
    // const retUrl = req.session.retUrl || '/';
    // req.session.retUrl = null;

    // //Access previous path
    // res.redirect(retUrl);

    if (req.session.retUrl) {
        const retUrl = req.session.retUrl;
        req.session.retUrl = null;
        res.redirect(retUrl);
    } else {
        res.redirect('/');
    }
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
        from: 'Insight News <testing1tintran2@gmail.com>',
        to: user.Email,
        subject: 'Password Reset Request',
        html: `<!DOCTYPE html>
<html>
<head>
    <style>
        .container {
            font-family: Arial, sans-serif;
            line-height: 1.6;
        }
        .otp {
            font-size: 20px;
            font-weight: bold;
            color: #333;
        }
        .header {
            font-size: 24px;
            font-weight: bold;
            color: #0056b3;
        }
        .footer {
            margin-top: 20px;
            font-size: 14px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="container">
        <p class="header">Dear ${user.Name},</p>
        <p>We have received a request to reset the password associated with your account. To proceed with resetting your password, please use the following One-Time Password (OTP):</p>
        <p class="otp">OTP: ${otp}</p>
        <p>This OTP will remain valid for a limited time. If you did not request this password reset, please disregard this email or contact our support team immediately for assistance.</p>
        <p>We take the security of your account seriously and are here to help should you have any concerns.</p>
        <div class="footer">
            <p>Thank you for your attention.</p>
            <p>Best regards,<br>Insight News.</p>
        </div>
    </div>
</body>
</html>`
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

    res.redirect(`/account/reset-password?email=${req.body.email}&otp=${req.body.otp}`);
});

router.get('/reset-password', async function (req, res) {
    const email = req.query.email;
    const otp = req.query.otp;

    if (!email || !otp) {
        return res.redirect('/?err_message=Invalid OTP or Email does not exist.');
    }

    const user = await accountService.findByEmail(email);
    if (!user || user.OTP !== otp) {
        return res.redirect('/?err_message=Invalid OTP or Email does not exist.');
    }

    res.render('vwAccount/reset-password', {
        email: req.query.email,
        otp: req.query.otp
    });
});

router.post('/reset-password', async function (req, res) {
    const hash_password = bcrypt.hashSync(req.body.raw_password, 8);
    await accountService.updatePasswordByEmail(req.body.email, hash_password);
    await accountService.deleteOTPByEmail(req.body.email);
    res.redirect('/account/login');
});

router.get('/profile', isAuth, function (req, res) {
    console.log(req.session.authUser);
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
    // user.Dob = moment(req.body.dob, 'DD/MM/YYYY').format('YYYY-MM-DD');
    user.Dob = req.body.dob;
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

router.get('/payment-premium', isAuth, function (req, res) {
    console.log(req.session.authUser);
    res.render('vwAccount/payment-premium', {
        user: req.session.authUser,
    });
});

router.post('/payment-premium', isAuth, async function (req, res) {
    const user = await accountService.findByEmail(req.session.authUser.Email);
    // const currentDate = moment();

    // let newExpireDate;
    // if (!user.SubcribeExpireDate) {
    //     newExpireDate = currentDate.add(7, 'days');
    // } else {
    //     const expireDate = moment(user.SubcribeExpireDate);

    //     if (expireDate.isBefore(currentDate)) {
    //         newExpireDate = currentDate.add(7, 'days');
    //     } else {
    //         newExpireDate = expireDate.add(7, 'days');
    //     }
    // }

    // user.SubcribeExpireDate = newExpireDate.toDate();
    user.SubcribeFlag = 1;
    await accountService.update(user);
    req.session.authUser = user;

    res.redirect('/account/profile');
});

router.post('/logout', isAuth, function (req, res) {
    req.session.auth = false;
    req.session.authUser = null;
    req.session.retUrl = null;
    res.redirect('/');
});

export default router;