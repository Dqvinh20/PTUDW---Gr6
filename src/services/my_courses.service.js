import db from "../utils/db.js";

// for (let i = 1; i < 50; i++) {
//     await db('courses_own').insert({student_id: 1, course_id: i});
// }

const getMyLearningCourse = async (studentId, offset, limit) => {
    const courses = db('courses')
        .join('courses_own', {'courses_own.course_id': "courses.id"})
        .where('courses_own.student_id', studentId);
    if (offset) courses.offset(offset);
    if (limit) courses.limit(limit);
    await courses;
    if (courses.length === 0) return null;
    return courses;
}

const countAll = async (studentId) => {
    const result = await db('courses_own')
        .where("student_id", studentId)
        .count();
    return result[0].count;
}

export default {
    getMyLearningCourse,
    countAll,
}