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
    res.render("home");
});

// router.get("/teacher", function (req, res, next) {
//     res.render("teacher/index", { layout: "teacherLayout" });
// });
//
// router.get("/teacher/teacher-profile", function (req, res, next) {
//     res.render("teacher/teacher-profile", { layout: "teacherLayout" });
// });
// router.get("/teacher/course", function (req, res, next) {
//     res.render("teacher/course", { layout: "teacherLayout" });
// });
//
// router.get('/courses', function(req, res, next) {
//   res.render('courses');
// });

export default router;
