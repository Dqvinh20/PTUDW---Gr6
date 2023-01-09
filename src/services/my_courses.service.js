import db from "../utils/db.js";

// for (let i = 1; i < 50; i++) {
//     await db('courses_own').insert({student_id: 1, course_id: i});
// }
// for (let i = 1; i < 50; i++) {
//     await db('watch_list').insert({student_id: 1, course_id: i});
// }

const getMyLearningCourse = async (studentId, offset, limit) => {
    const courses = db('courses')
        .join('courses_own', {'courses_own.course_id': "courses.id"})
        .join('categories', {'categories.cat_id' : 'courses.cat_id'})
        .where('courses_own.student_id', studentId)
        .select(["courses.*", "categories.cat_name", "categories.parent_cat_id"]);
    if (offset) courses.offset(offset);
    if (limit) courses.limit(limit);
    await courses;
    if (courses.length === 0) return null;
    return courses;
}

const getMyWatchList = async (studentId, offset, limit) => {
    const courses = db('courses')
        .join('watch_list', {'watch_list.course_id': "courses.id"})
        .join('categories', {'categories.cat_id' : 'courses.cat_id'})
        .where('watch_list.student_id', studentId)
        .select(["courses.*", "categories.cat_name", "categories.parent_cat_id"]);
    if (offset) courses.offset(offset);
    if (limit) courses.limit(limit);
    await courses;
    if (courses.length === 0) return null;
    return courses;
}

const removeFromWatchList = async (studentId, id) => {
    return db('watch_list')
            .where('student_id', studentId)
            .andWhere("course_id", id)
            .del();
}

const addToWatchList = async (studentId, id) => {
    return db('watch_list').insert({'student_id' : studentId, 'course_id': id});
}

const countAllLearningCourses = async (studentId) => {
    const result = await db('courses_own')
        .where("student_id", studentId)
        .count();
    return result[0].count;
}

export default {
    getMyLearningCourse,
    getMyWatchList,
    removeFromWatchList,
    countAllLearningCourses,
    addToWatchList
}