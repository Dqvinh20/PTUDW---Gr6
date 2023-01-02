import {engine} from "express-handlebars";
import {dirname, join} from "path";
import hbs_sections from 'express-handlebars-sections';
import {fileURLToPath} from "url";

export default function (app) {
    const __dirname = dirname(fileURLToPath(import.meta.url));

    // Set view engine
    app.engine('hbs', engine({
        extname: ".hbs",
        defaultLayout: "main.layout.hbs",
        helpers: {
            section: hbs_sections(),
        }
    }));

    app.set('view engine', 'hbs');
    app.set('views', join(__dirname, '../views'));
}