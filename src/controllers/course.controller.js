import courseDetailService from "../services/course.service.js";

const getCourseDetailPage = async(req, res) => {
    console.log(req.params)
    const courseInfo = await courseDetailService.getCourseBySlug(req.params.slug);
    let chapter = await Promise.all(courseInfo.map(async ({id}) => {
        return await courseDetailService.getAllChapterInCourse(id);
    } )) ;
   
    res.render("vwCourses/detail", { 
        layout: "main",
        courseInfo,
         chapter: chapter[0],
    });
};

const getAllCoursesByCategories =  async (id) => {
    const courses = await db('courses').where('cat_id', id);
    if (courses.length === 0) return null;
    return courses;
}

export default {
    getAllCoursesByCategories,
    getCourseDetailPage,
};