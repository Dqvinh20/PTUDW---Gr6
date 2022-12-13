import express from "express";
const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
    res.render("home");
});

router.get("/teacher", function (req, res, next) {
    res.render("teacher/index", { layout: "teacherLayout" });
});

router.get("/teacher/teacher-profile", function (req, res, next) {
    res.render("teacher/teacher-profile", { layout: "teacherLayout" });
});
router.get("/teacher/course", function (req, res, next) {
    res.render("teacher/course", { layout: "teacherLayout" });
});

export default router;
