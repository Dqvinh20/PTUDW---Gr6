import db from "../utils/db.js";

const getAllCourses = async () => {
    const courses = await db('courses').select();
    if (courses.length === 0) return null;
    return courses
}

const add = async (course) => {
    return db('courses').insert(course);
}

export default {
    getAllCourses,
    add,
}