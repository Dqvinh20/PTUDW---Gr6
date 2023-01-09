import db from "../utils/db.js";
export default {
    getCourseByTeacherId(id) {
        return db.select("*").table("courses").where("teacher_id", id);
    },
    getCourseById(id) {
        return db.select("*").table("courses").where("id", id);
    },
    isAvailable(courseName, teacherId) {
        return db
            .select("*")
            .table("courses")
            .where("name", courseName)
            .where("teacher_id", teacherId)
            .first();
    },
    addCourse(course, teacherId) {
        return db("courses")
            .insert({
                name: course.name,
                brief_description: course.brief_description,
                thumbnail: course.thumbnail,
                preview_video: course.preview_video,
                price: course.price,
                detail_description: course.detailed_description,
                teacher_id: teacherId,
                cat_id: course.cat_id,
                slug: course.slug,
            })
            .returning("*");
    },
    getSlug(cat_id) {
        return db
            .select("slug")
            .table("categories")
            .where("cat_id", cat_id)
            .first();
    },
    getChapterByCourseId(id) {
        return db
            .select("*")
            .table("chapters")
            .where("course_id", id)
            .orderBy("position", "asc");
    },
    async addChapter(id, chapterName, position) {
        const chapter = await db("chapters").where({
            name: chapterName,
            course_id: id,
        });
        if (chapter.length != 0) {
            return chapter[0];
        }
        return (
            await db("chapters")
                .insert({
                    course_id: id,
                    name: chapterName,
                    position: position,
                })
                .returning("id")
        )[0];
    },
    getPosition(id) {
        return db
            .select("position")
            .table("chapters")
            .where("course_id", id)
            .orderBy("position", "desc")
            .first();
    },
    getLessonPosition(id) {
        return db
            .select("lesson_position")
            .table("lessons")
            .where("chapter_id", id)
            .orderBy("lesson_position", "desc")
            .first();
    },
    addLesson(lessonName, lessonUrl, chapter_id, position) {
        return db("lessons")
            .insert({
                name: lessonName,
                video_url: lessonUrl,
                chapter_id: chapter_id,
                lesson_position: position,
            })
            .returning("*");
    },
    updateCourse(id, course) {
        return db("courses")
            .where("id", id)
            .update({
                name: course.name,
                brief_description: course.brief_description,
                detail_description: course.detailed_description,
                is_complete: course.is_complete,
            })
            .returning("*");
    },
};
