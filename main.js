import express from 'express';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { engine } from 'express-handlebars';
import reporterRouter from './routes/reporter.route.js';
import editorRouter from './routes/editor.route.js';
import adminRouter from './routes/admin.route.js';
import newsRouter from './routes/news.route.js';
const app = express();

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
        }
    }
}));
app.set('view engine', 'hbs');
app.set('views', './views');



const __dirname = dirname(fileURLToPath(import.meta.url));

// Serve static files from the "public" directory
app.use(express.static('public'));
app.use('/static', express.static('static'))

app.use('/static', express.static('static'));

// app.get('/test', function(req,res){ 
//     res.sendFile(__dirname+'/test.html');
// })

app.get('/', (req, res) => {
    res.render('homepage', {
        layout: 'main',
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
        ]
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
app.use('/editor', editorRouter)
app.use('/reporter', reporterRouter)
app.use('/news', newsRouter)
function serverStartedHandler() {
    console.log('Server is listening on http://localhost:5555');
}
app.listen(5555, serverStartedHandler);