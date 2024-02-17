const express = require('express');
const handlebars = require('express-handlebars');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const path = require('path');

const routes = require('./routes');
const { authMiddleware } = require('./middlewares/authMiddleware');

const app = express();
const port = 3000;

app.use(express.static(path.resolve('src/public')));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(authMiddleware);

app.engine('hbs', handlebars.engine({
    extname: 'hbs',
}));
app.set('view engine', 'hbs');
app.set('views', path.resolve('src/views'));

app.use(routes);

mongoose.connect(`mongodb://127.0.0.1:27017/wizard-creatures-wiki`)
    .then(() => {
        console.log('DB is connected')

        app.listen(port, () => { console.log(`App is listening on http://localhost:${port}`) });
    })
    .catch(err => {
        console.log('Cannot connect to DB...');
        console.log(err.message);
    });


