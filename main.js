import express from 'express';
import session from 'express-session';
import hbs_sections from 'express-handlebars-sections';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { engine } from 'express-handlebars';

import { format, formatDate } from 'date-fns';

import reporterRouter from './routes/reporter.route.js';
import editorRouter from './routes/editor.route.js';
import adminRouter from './routes/admin.route.js';
import newsRouter from './routes/news.route.js';
import accountRouter from './routes/account.route.js';

import newsService from './services/news.service.js';
import categoriesService from './services/category.service.js';
import { equal } from 'assert';

const app = express();

app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: 'SECRET_KEY',
    resave: false,
    saveUninitialized: true,
    cookie: {}
}))

let check = false
app.engine('hbs', engine({
    extname: 'hbs',
    partialsDir: './views/partials',
    helpers: {
        isEqual: function (value1, value2) {
            return value1 === value2;
        },
        setVar: function (value1) {
            check = value1;
            return '';
        },
        getVar: function () {
            return check;
        },
        equal: function (value1, value2) {
            return value1 === value2;
        },
        greater: function (value1, value2) {
            return value1 > value2;
        },
        lower: function (value1, value2) {
            return value1 < value2;
        },
        and: function (value1, value2) {
            return value1 && value2;
        },
        timeAgo: function (value) {
            const now = new Date();
            const past = new Date(value);
            const diff = now - past;
            const diffInMinutes = Math.floor(diff / (1000 * 60));
            const diffInHours = Math.floor(diff / (1000 * 60 * 60));
            const diffInDays = Math.floor(diff / (1000 * 60 * 60 * 24));
            const diffInMonths = Math.floor(diffInDays / 30);

            if (diffInMinutes < 60) {
                return `${diffInMinutes} minutes ago`;
            } else if (diffInHours < 24) {
                return `${diffInHours} hours ago`;
            } else if (diffInDays < 30) {
                return `${diffInDays} days ago`;
            } else {
                return `${diffInMonths} months ago`;
            }
        },
        or: function (value1, value2) {
            return value1 || value2;
        },
        mod: function (value1, value2) {
            return value1 % value2;
        },
        add: function (value1, value2) {
            return value1 + value2;
        },
        length: function (value) {
            return value.length;
        },
        slice: function (array, start, end) {
            if (!array) return [];
            return array.slice(start, end);
        },
        filterCategories1: function (items, categoryName, options) {
            if (!items) return '';
            const filteredItems = items.filter(item => item.CatParentName === categoryName).slice(0, 3);
            const result = filteredItems.map(item => options.fn(item)).join('');
            return result;
        },
        filterCategories2: function (items, categoryName, options) {
            if (!items) return '';
            const filteredItems = items.filter(item => item.CatParentName === categoryName).slice(3, 6);
            const result = filteredItems.map(item => options.fn(item)).join('');
            return result;
        },
        section: hbs_sections(),
        formatDate: function (value) {
            return format(value, 'dd/MM/yyyy');
        },
        formatDate2: function (value) {
            return format(value, 'dd-MM-yyyy HH:mm');
        },
        nameRole: function (value) {
            if (value === 1) {
                return 'Reader';
            } else if (value === 2) {
                return 'Reporter';
            } else if (value === 3) {
                return 'Editor';
            } else if (value === 4) {
                return 'Administrator';
            }
        }
    }
}));
app.set('view engine', 'hbs');
app.set('views', './views');



const __dirname = dirname(fileURLToPath(import.meta.url));

// Serve static files from the "public" directory
app.use(express.static('public'));
app.use('/static', express.static('static'))

// Load Account's session
app.use(async function (req, res, next) {
    if (req.session.auth === null || req.session.auth === undefined) {
        req.session.auth = false;
    }

    res.locals.auth = req.session.auth;
    res.locals.authAccount = req.session.authAccount;
    next();
});

// app.get('/test', function(req,res){ 
//     res.sendFile(__dirname+'/test.html');
// })

//middleware
app.use(async (req, res, next) => {
    const listNews = await newsService.findall();
    res.locals.lcListNews = listNews;
    next();
});

app.get('/', async (req, res) => {
    const featuredNews = await newsService.featuredNews();
    const hotNews = await newsService.hotNews();
    const latestNews = await newsService.latestNews();
    const hotCategoriesNews = await newsService.hotCategories();
    const hotCategoriesParent = await newsService.hotCategoriesParent();
    // console.log(hotNews);
    res.render('homepage', {
        layout: 'main',
        featuredNews: featuredNews,
        hotNews: hotNews,
        latestNews: latestNews,
        hotCategoriesNews: hotCategoriesNews,
        hotCategoriesParent: hotCategoriesParent,
        Buttons: [
            { label: 'Article', url: '/admin/article', icon: 'bi bi-file-earmark' },
            { label: 'Category', url: '/admin/category', icon: 'bi bi-archive' },
            { label: 'Tag', url: '/admin/tags', icon: 'bi bi-tag' },
            { label: 'User', url: '/admin/user', icon: 'bi bi-person', id: '1' }
        ],
        DropdownButtons: [
            { label: 'Subscriber', url: '/admin/subscriberlist', icon: 'bi bi-person-check', id: '1' },
            { label: 'Writer', url: '/admin/writerlist', icon: 'bi bi-journal-text', id: '1' },
            { label: 'Editor', url: '/admin/editorlist', icon: 'bi bi-pencil', id: '1' }
        ],
        err_message: req.query.err_message
    });
})

// app.get('/admin',(req,res) => {
//     res.render('admin', {
//         layout: false,
//         Buttons: [
//             { label: 'Article', url: '/admin/article', icon: 'bi bi-file-earmark' },
//             { label: 'Category', url: '/admin/category', icon: 'bi bi-archive' },
//             { label: 'Tag', url: '/admin/tags', icon: 'bi bi-tag' }
//         ],
//         userDropdownButtons: [
//             { label: 'Subscriber', url: '/admin/subscriberlist', icon: 'bi bi-person-check' },
//             { label: 'Writer', url: '/admin/writerlist', icon: 'bi bi-journal-text' },
//             { label: 'Editor', url: '/admin/editorlist', icon: 'bi bi-pencil' }
//         ]
//     });
// })

// app.get('/editor',(req,res) => {
//     res.render('editor', {
//         layout: false,
//         Buttons: [
//             { label: 'your info', url: '/editor/info', icon: 'bi bi-file-earmark' },
//             { label: 'Draft Article', url: '/editor/draft', icon: 'bi bi-archive' },
//         ]
//     });
// })
// app.get('/reporter',(req,res)=>{
//     res.render('vwReporter/mainreporter', {
//         layout: false,
//         Buttons: [
//             { label: 'Article', url: '/admin/article', icon: 'bi bi-file-earmark' },
//             { label: 'Category', url: '/admin/category', icon: 'bi bi-archive' },
//             { label: 'Tag', url: '/admin/tags', icon: 'bi bi-tag' }
//         ],
//         userDropdownButtons: [
//             { label: 'Subscriber', url: '/admin/subscriberlist', icon: 'bi bi-person-check' },
//             { label: 'Writer', url: '/admin/writerlist', icon: 'bi bi-journal-text' },
//             { label: 'Editor', url: '/admin/editorlist', icon: 'bi bi-pencil' }
//         ]
//     });

// })
app.use(express.urlencoded({ extended: true }));
app.use('/admin', adminRouter);
app.use('/editor', editorRouter);
app.use('/reporter', reporterRouter);
app.use('/news', newsRouter);
app.use('/account', accountRouter);
function serverStartedHandler() {
    console.log('Server is listening on http://localhost:5555');
}
app.listen(5555, serverStartedHandler);