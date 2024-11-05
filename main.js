import express from 'express';
import {dirname} from 'path';
import { fileURLToPath } from 'url';
import { engine } from 'express-handlebars';
const app = express();

app.engine('hbs', engine({
    extname: 'hbs',
    partialsDir: './views/partials'
}));
app.set('view engine', 'hbs');
app.set('views', './views');



const __dirname = dirname(fileURLToPath(import.meta.url));

// Serve static files from the "public" directory
app.use(express.static('public'));

app.get('/test', function(req,res){ 
    res.sendFile(__dirname+'/test.html');
})

app.get('/', (req,res) => {
    res.render('homepage');
})

app.get('/admin',(req,res) => {
    res.render('admin', {
        layout: false,
        Buttons: [
            { label: 'Article', url: '/admin/article', icon: 'bi bi-file-earmark' },
            { label: 'Category', url: '/admin/category', icon: 'bi bi-archive' },
            { label: 'Tag', url: '/admin/tags', icon: 'bi bi-tag' }
        ],
        userDropdownButtons: [
            { label: 'Subscriber', url: '/admin/subscriber', icon: 'bi bi-person-check' },
            { label: 'Writer', url: '/admin/writer', icon: 'bi bi-journal-text' },
            { label: 'Editor', url: '/admin/editor', icon: 'bi bi-pencil' }
        ]
    });
})

app.get('/editor',(req,res) => {
    res.render('editor', {
        layout: false,
        Buttons: [
            { label: 'your info', url: '/admin/dashboard', icon: 'bi bi-file-earmark' },
            { label: 'Draft Article', url: '/admin/users', icon: 'bi bi-archive' },
        ]
    });
})


function serverStartedHandler() {
    console.log('Server is listening on http://localhost:3000');
}
app.listen(3000, serverStartedHandler);