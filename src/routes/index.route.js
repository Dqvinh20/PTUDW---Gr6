import express from "express";
import categoryModel from "../services/catelogies.service.js";
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

router.get('/courses', function(req, res, next) {
  res.render('courses');
});
// router.use(async function(req,res,next){
//     const data = await categoryModel.findAllWithDetails();
//     res.locals.lcCategories = data.rows;
//     console.log(res.locals.lcCategories)
//     next()
// })
router.get('/admin', function(req, res, next) {
    res.render("admin/index", { layout: "adminLayout" });
});
router.get('/admin/catologies', async (req, res, next)=> {
    const total = await categoryModel.findAll();
    console.log(total)
    res.render("admin/catelogy", { 
        layout: "adminLayout",
        catelogies: total
        });
});
router.get('/admin/users', function(req, res, next) {
    res.render("admin/studentAdmin", { layout: "adminLayout" });
});
router.get('/admin/teachers', function(req, res, next) {
    res.render("admin/teacherAdmin", { layout: "adminLayout" });
});
export default router;
