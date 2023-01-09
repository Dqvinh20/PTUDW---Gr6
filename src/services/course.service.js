import db from "../utils/db.js";
export default {
    getCourseByTeacherId(id) {
        return db.select("*").table("courses").where("teacher_id", id);
    },
    getCourseById(id) {
        return db.select("*").table("courses").where("id", id);
    },
    getCourseBySlug(slug) {
        slug = "/course/" + slug + "/";
        console.log(slug);
        return db.select("*").table("courses").where("slug", slug);
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
    async getAllCourses() {
        const courses = await db("courses").select();
        if (courses.length === 0) return null;
        return courses;
    },

    async add(course) {
        return db("courses").insert(course);
    },
    async getAllChapterInCourse(courseId) {
        let chapters = await this.getChapterByCourseId(courseId);
        chapters = await Promise.all(
            chapters.map(async (chapter) => {
                chapter.lessons = await db("lessons")
                    .where("chapter_id", chapter.id)
                    .orderBy("lesson_position", "asc");
                return chapter;
            })
        );
        return chapters;
    },
    async getTeacherByCourseId(teacherId) {

        return db('users').where('id', teacherId).first();
    },
    
    async getPopularCoursesInLastWeek(){
        const courses = db("courses")
        .join("categories", {"categories.cat_id": "courses.cat_id"})
        .join("users", {"courses.teacher_id" : "users.id"})
        .where("users.role", "TEACHER")
        .orderBy("avg_rating")
        .select(["courses.*", "categories.cat_name", "users.fullname"]);
        if (courses.length === 0) return null;
        
         return (await courses).reverse().slice(0, 4);

    },
    async getNewestCourses(){
        const courses = db("courses")
        .join("categories", {"categories.cat_id": "courses.cat_id"})
        .join("users", {"courses.teacher_id" : "users.id"})
        .where("users.role", "TEACHER")
        .orderBy("created_at")
        .select(["courses.*", "categories.cat_name", "users.fullname"]);
        if (courses.length === 0) return null;
        
         return (await courses).reverse().slice(0, 11);

    },
    async getMostViewCourses(){
        const courses = await db("courses").select().orderBy("avg_rating").limit(9,1);
        console.log(courses);
        if (courses.length === 0) return null;
        return courses;
    },
    async getNewestCourses(){
        const courses = await db("courses").select().orderBy("created_at").limit(9,1);
        if (courses.length === 0) return null;
        return courses;
    }

};
