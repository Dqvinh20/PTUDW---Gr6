import express from "express";
import homeMdw from "../middlewares/locals.mdw.js";

const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
    // if (req.session.auth) {
    //     if (req.session.passport.user.role === "STUDENT"){
    //         return res.render("student/index");
    //     }
    // }
    res.render("home", {
        layout: "main"
    });
});

export default router;
