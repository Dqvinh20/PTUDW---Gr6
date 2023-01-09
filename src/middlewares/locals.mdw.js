import { downloadImg } from "../utils/helpers.js";
import db from "../utils/db.js";

const categoriesMdw = async (req, res, next) => {
    // if (!req.locals.partials) req.locals.partials = {};
    // const loadData = () =>
    //   Promise.resolve([
    //     {
    //       title: "IT",
    //       path: "/IT",
    //       children: [
    //         {
    //           title: "Web development",
    //           path: "/IT/web-development",
    //           children: []
    //         },
    //         {
    //           title: "Mobile development",
    //           path: "/IT/mobile-development",
    //           children: []
    //         }
    //       ]
    //     },
    //     {
    //       title: "Design",
    //       path: "/design",
    //       children: [
    //         {
    //           title: "Web design",
    //           path: "/design/web-design",
    //           children: []
    //         },
    //         {
    //           title: "Logo design",
    //           path: "/design/logo-design",
    //           children: []
    //         }
    //       ]
    //     },
    //     {
    //       title: "Marketing",
    //       path: "/marketing",
    //       children: [
    //         {
    //           title: "Digital marketing",
    //           path: "/marketing/digital-marketing",
    //           children: []
    //         },
    //         {
    //           title: "Content marketing",
    //           path: "/marketing/content-marketing",
    //           children: []
    //         }
    //       ]
    //     },
    //     {
    //       title: "Music",
    //       path: "/music",
    //       children: [
    //         {
    //           title: "Instruments",
    //           path: "/music/instruments",
    //           children: []
    //         },
    //         {
    //           title: "Vocal",
    //           path: "/music/vocal",
    //           children: []
    //         }
    //       ]
    //     },
    //   ]);
    const loadData = async () => {
        const pri_cat = await db("categories").whereNull("parent_cat_id");

        const categories = await Promise.all(
            pri_cat.map(async (cat) => {
                cat.children = await db("categories").where(
                    "parent_cat_id",
                    cat.cat_id
                );
                return cat;
            })
        );
        return categories;
    };
    // const categories = await loadData();
    res.locals.categories = await loadData();
    next();
};

const loggedUser = async (req, res, next) => {
    // console.log(req.user);
    if (req.session.auth) {
        res.locals.auth = req.session.auth;
        res.locals.authUser = req.user;
    }
    next();
};

export default function (app) {
    app.use(loggedUser);
    app.use(categoriesMdw);
}
