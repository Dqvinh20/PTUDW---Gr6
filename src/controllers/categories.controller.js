import categoriesService from "../services/categories.service.js";
import courseDetailService from "../services/course.service.js";

// const getCategoryPage = async(req, res) => {
//     const catInfo = await categoriesService.getAllCategories(req.params.slug);
//     console.log(catInfo);
//     res.render("vwCategory/categories.hbs", { 
//         layout: "main",
//         catInfo
//     });
// };

const getCourses = async(req, res) => {
    const courses = await categoriesService.getCoursesByCatId(req.params.slug);
    res.render("vwCategory/categories.hbs", { 
        layout: "main",
        courses
    });
};

export default {
    getCourses,
    // getCategoryPage,
};