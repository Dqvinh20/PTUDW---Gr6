import express from 'express';
import { engine } from 'express-handlebars';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import indexRouter from './routes/index.route.js';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

// Set view engine
app.engine('hbs', engine({
    extname: ".hbs",
    defaultLayout: "main",
}));
app.set('view engine', 'hbs');
app.set('views', join(__dirname, 'views'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/public', express.static(join(__dirname, '../public')));

app.use('/', indexRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Server is listening at " + port);
})