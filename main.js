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
app.get('/test', function(req,res){ 
    res.sendFile(__dirname+'/test.html');
})

function serverStartedHandler() {
    console.log('Server is listening on http://localhost:3000');
}
app.listen(3000, serverStartedHandler);