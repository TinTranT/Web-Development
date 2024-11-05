import express from 'express';
import {dirname} from 'path';
import { fileURLToPath } from 'url';
import { engine } from 'express-handlebars';
const app = express();

app.engine('hbs', engine({
    extname: 'hbs',
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


function serverStartedHandler() {
    console.log('Server is listening on http://localhost:3000');
}
app.listen(3000, serverStartedHandler);