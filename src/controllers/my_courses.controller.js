import MyCoursesService from "../services/my_courses.service.js";

const getWatchListPage = async (req, res) => {
    res.render('student/watch_list', {
        layout: "main",
    });
}

const getLearningPage = async (req, res) => {
    const currentPage = req.params.page || 1;
    const maxCoursePerRow = 4;
    const maxCoursePerPage = 10;
    const offset = (currentPage - 1) * maxCoursePerPage;
    let count = await MyCoursesService.countAll(req.user.id);
    let courses = await MyCoursesService.getMyLearningCourse(req.user.id, offset, maxCoursePerPage);
    const row = [];
    while(courses.length) row.push(courses.splice(0, maxCoursePerRow));
    res.render('student/learning', {
        layout: "main",
        currentPage,
        pages: Math.ceil(count / maxCoursePerPage),
        row,
    });
}


export default {
    getLearningPage,
    getWatchListPage
}