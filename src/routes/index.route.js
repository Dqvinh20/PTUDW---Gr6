import express from "express";
import homeMdw from "../middlewares/locals.mdw.js";

const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
    if (req.session.auth) {
        console.log(req.user.role);
        if (req.user.role === "TEACHER") {
            return res.redirect("/teacher/teacher-profile");
        }
        if (req.session.passport.user.role === "ADMIN") {
            return res.render("teacher/teacher-profile", {
                layout: "adminLayout",
            });
        }
    }

    res.render("home");
});

export default router;
