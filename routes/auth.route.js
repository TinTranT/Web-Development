import express from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import bcrypt from 'bcryptjs';
import accountService from '../services/account.service.js';

const GOOGLE_CLIENT_ID = '';
const GOOGLE_CLIENT_SECRET = '';

const router = express.Router();

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5555/auth/google/callback"
},
    function (accessToken, refreshToken, profile, cb) {
        return cb(null, profile);
    }
));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

// Initialize Passport and restore authentication state, if any, from the session.
router.use(passport.initialize());
router.use(passport.session());

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
    passport.authenticate('google', {
        successRedirect: '/auth/google/success',
        failureRedirect: '/?err_message=Something went wrong with Google login'
    })
);

router.get('/google/success', async (req, res) => {
    console.log("Log in by google success");
    console.log(req.user.emails[0].value);

    const user = await accountService.findByEmail(req.user.emails[0].value);
    if (!user) {
        const hash_password = bcrypt.hashSync(req.user.emails[0].value, 8);
        const entity = {
            Email: req.user.emails[0].value,
            Password: hash_password,
            Name: req.user.displayName,
            PenName: req.user.displayName,
            Role: 1
        }
        const ret = await accountService.add(entity);

        // Save session
        const user = await accountService.findByEmail(req.user.emails[0].value);
        req.session.authUser = user;
        req.session.auth = true;

        // Load previous path
        let retUrl = req.session.retUrl || '/';
        retUrl = retUrl + "?success_message=Your password is your email";
        req.session.retUrl = null;

        //Access previous path
        res.redirect(retUrl);
    } else {
        // Save session
        req.session.authUser = user;
        req.session.auth = true;

        if (req.session.retUrl) {
            let retUrl = req.session.retUrl;
            req.session.retUrl = null;
            res.redirect(retUrl);
        } else {
            if (user.Role === 4) {
                res.redirect('/admin');
            } else if (user.Role === 3) {
                res.redirect('/editor');
            } else if (user.Role === 2) {
                res.redirect('/reporter');
            } else {
                res.redirect('/');
            }
        }
    }
});

export default router;