import knexObj from "knex";
import dotenv from "dotenv";

dotenv.config();

const db = knexObj({
    client: "pg",
    connection: process.env.PG_CONNECTION_STRING,
});

const categories = [
    {
        cat_name: "IT",
        slug: "/IT",
        children: [
            {
                cat_name: "Web development",
                slug: "/web-development",
            },
            {
                cat_name: "Mobile development",
                slug: "/mobile-development",
            },
            {
                cat_name: "Java development",
                slug: "/java-development",
            },
        ],
    },
    {
        cat_name: "Design",
        slug: "/design",
        children: [
            {
                cat_name: "Web design",
                slug: "/web-design",
            },
            {
                cat_name: "Logo design",
                slug: "/logo-design",
            },
        ],
    },
];

// Chạy lần đầu rồi cmt lại
// resetDatabase().then(() => addSampleData());

export async function resetDatabase() {
    await db.schema
        .withSchema("public")
        .dropTableIfExists("watch_list")
        .dropTableIfExists("courses_own")
        .dropTableIfExists("ratings")
        .dropTableIfExists("study_progress")
        .dropTableIfExists("lessons")
        .dropTableIfExists("chapters")
        .dropTableIfExists("courses")
        .dropTableIfExists("categories")
        .dropTableIfExists("federated_credentials")
        .dropTableIfExists("users");

    await Promise.all([createUsersTable(), createCategoriesTable()]);
    await createCourseTable();
    await Promise.all([
        createFederatedCredentialsTable(),
        createRatingTable(),
        createWatchListTable(),
        createCoursesOwnTable(),
        createChapterTable(),
        createLessonTable(),
        createStudyProgressTable(),
    ]);
    console.log("RESET DB");
}

async function insertCategory(category) {
    let cat = await db("categories")
        .select("cat_id")
        .where("cat_name", category.cat_name);
    if (cat.length === 0) {
        cat = await db("categories").returning("cat_id").insert(category);
    }
    return cat[0]["cat_id"];
}

function addSampleData() {
    categories.forEach(async (category) => {
        const { cat_name, slug } = category;
        const cat_id = await insertCategory({ cat_name, slug });
        if (category.children) {
            category.children.forEach((child) => {
                const { cat_name, slug } = child;
                insertCategory({ cat_name, slug, parent_cat_id: cat_id });
            });
        }
    });
}

function createFederatedCredentialsTable() {
    return db.schema
        .withSchema("public")
        .createTable("federated_credentials", function (table) {
            table.increments().primary();
            table.integer("user_id").unsigned().notNullable();
            table.string("provider").notNullable();
            table.string("subject").notNullable();

            // Khoá ngoại
            table.foreign("user_id").references("id").inTable("users");
        });
}

function createUsersTable() {
    return db.schema
        .withSchema("public")
        .createTable("users", function (table) {
            table.increments().primary();
            table.string("email").notNullable();
            table.string("password");
            table
                .enum("role", ["STUDENT", "TEACHER", "ADMIN"])
                .defaultTo("STUDENT");
            table.string("fullname");
            table.boolean("is_verified").defaultTo(false);
            table.timestamps(true, true);
        });
}

function createCourseTable() {
    return db.schema
        .withSchema("public")
        .createTable("courses", function (table) {
            table.increments().primary();
            table.string("name").notNullable(); // Tên khoá học
            table.string("thumbnail").notNullable(); // Ảnh đại diện (lớn)
            table.string("brief_description").notNullable(); // Mô tả ngắn gọn nội dung khoá học
            table.string("detailed_description").notNullable(); // Mô tả chi tiết nội dung khoá học
            table.string("preview_video").notNullable(); // Video xem trước
            table
                .tinyint("avg_rating")
                .unsigned()
                .defaultTo(0)
                .checkBetween([0, 5]); // Điểm đánh giá tb
            table.integer("old_price").unsigned().defaultTo(0); // Giá cũ
            table.integer("price").unsigned().defaultTo(0); // Giá hiện hành
            table.boolean("is_complete").defaultTo(false); //  Khoá học đã hoàn thành chưa

            table.string("slug").notNullable(); // Đường dẫn khoá học
            table.integer("students_rating").defaultTo(0).unsigned(); // Số lượng học viên đánh giá
            table.integer("students_learning").defaultTo(0).unsigned(); // Số lượng học viên đăng ký học
            table.integer("cat_id").unsigned().notNullable(); // Thông tin lĩnh vực
            table.integer("teacher_id").unsigned().notNullable(); // Thông tin giảng viên
            table.timestamps(true, true); // Trường created_at và updated_at

            // Khoá ngoại
            table.foreign("cat_id").references("cat_id").inTable("categories");
            table.foreign("teacher_id").references("id").inTable("users");
        });
}

function createCategoriesTable() {
    return db.schema
        .withSchema("public")
        .createTable("categories", function (table) {
            table.increments("cat_id").primary();
            table.string("cat_name").notNullable(); // Tên của category đó
            table.string("slug").notNullable(); // Đường dẫn trang web đến category
            table.integer("parent_cat_id").nullable().unsigned(); // Id của category cha
            table.timestamps(true, true); // Trường created_at và updated_at

            // Khoá ngoại
            table
                .foreign("parent_cat_id")
                .references("cat_id")
                .inTable("categories");
        });
}

function createCoursesOwnTable() {
    return db.schema
        .withSchema("public")
        .createTable("courses_own", function (table) {
            table.integer("student_id").unsigned().notNullable().ch;
            table.integer("course_id").unsigned().notNullable();
            table.primary(["student_id", "course_id"]); // Khoá chính
            table.timestamps(true, true); // Trường created_at và updated_at

            // Khoá ngoại
            table.foreign("student_id").references("id").inTable("users");

            table.foreign("course_id").references("id").inTable("courses");
        });
}

function createWatchListTable() {
    return db.schema
        .withSchema("public")
        .createTable("watch_list", function (table) {
            table.integer("student_id").unsigned().notNullable();
            table.integer("course_id").unsigned().notNullable();
            table.primary(["student_id", "course_id"]); // Khoá chính
            table.timestamps(true, true); // Trường created_at và updated_at

            // Khoá ngoại
            table.foreign("student_id").references("id").inTable("users");

            table.foreign("course_id").references("id").inTable("courses");
        });
}

function createRatingTable() {
    return db.schema.createTable("ratings", function (table) {
        table.increments().primary();
        table.integer("student_id").unsigned().notNullable();
        table.integer("course_id").unsigned().notNullable();
        table
            .tinyint("rating_point")
            .unsigned()
            .defaultTo(0)
            .notNullable()
            .checkBetween([0, 5]);
        table.string("comment").defaultTo("");
        table.timestamps(true, true);

        // Khoá ngoại
        table.foreign("student_id").references("id").inTable("users");
        table.foreign("course_id").references("id").inTable("courses");
    });
}

function createChapterTable() {
    return db.schema.createTable("chapters", function (table) {
        table.increments().primary();
        table.string("name").notNullable();
        table.integer("position").notNullable();
        table.integer("course_id").unsigned().notNullable();
        table.integer("duration").unsigned().notNullable().defaultTo(0);
        table.integer("lesson_count").unsigned().notNullable().defaultTo(0);
        table.timestamps(true, true);

        // Khoá ngoại
        table.foreign("course_id").references("id").inTable("courses");
    });
}

function createLessonTable() {
    return db.schema.createTable("lessons", function (table) {
        table.increments().primary();
        table.string("name").notNullable(); // Tên bài học
        table.string("video_url").notNullable(); // Video của bài học
        table.integer("chapter_id").notNullable(); // Chương
        table.boolean("is_previewable").notNullable().defaultTo("false"); // Được xem trước
        table.integer("lesson_position").notNullable(); // Vị trí trong chương đó
        table.integer("duration").notNullable().defaultTo(0); // Độ dài bài học
        table.timestamps(true, true);

        // Khoá ngoại
        table.foreign("chapter_id").references("id").inTable("chapters");
    });
}

function createStudyProgressTable() {
    return db.schema.createTable("study_progress", function (table) {
        table.integer("student_id").unsigned().notNullable(); // Học sinh đang học
        table.integer("lesson_id").unsigned().notNullable(); // Bài đang học
        table.boolean("is_done").notNullable().defaultTo("false"); // Trạng thái bài học đã học xong hay chưa
        table.integer("video_position").unsigned().nullable(); // Vị trí video đang xem
        table.timestamps(true, true);

        // Khoá ngoại
        table.foreign("student_id").references("id").inTable("users");
        table.foreign("lesson_id").references("id").inTable("lessons");
    });
}

export default db;
