import categoriesService from "../services/categories.service.js";

const getCourses = async(req, res) => {
    let name = req.params.slug;
    name = name.replace("-", " ");
    const courses = await categoriesService.getCoursesByCatId(req.params.slug);
    res.render("vwCategory/categories.hbs", { 
        layout: "main",
        courses,
        name
    });
};

export default {
    getCourses,
};