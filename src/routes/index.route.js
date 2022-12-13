import express from "express";
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home');
});

router.get('/courses', function(req, res, next) {
  res.render('courses');
});

export default router;
