import knexObj from "knex";
import udemyApi from "../utils/udemyApi.js";
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

const courses = [
    {
        name: "The Complete Python Bootcamp From Zero to Hero in Python",
        brief_description:
            "Learn Python like a Professional Start from the basics and go all the way to creating your own applications and games",
        thumbnail: "https://img-c.udemycdn.com/course/750x422/567828_67d0.jpg",
        slug: "/course/complete-python-bootcamp",
        avg_rating: 4.6002073,
        students_rating: 447271,
        students_learning: 1660477,
        price: 279000,
        old_price: 2199000,
        preview_video:
            "https://mp4-c.udemycdn.com/2018-03-08_20-09-30-1365492dea1831a772c3ed1dd9cf3b66/2/WebHD_720p.mp4?Expires=1672733931&Signature=bZuDOch2uxAivDw8cWG2vpvJpBnApUl28W9tHJ5wtmywG~hkArOMJWFyMpCYQ4PqgwbiEdftUk~fQyRFgVQfs~mN1eA0DQc1hkGMsnXA7S1HqwJLvh5gCD3x3oqSFMC5~xhKE8WzYEKt6BpJUnxjBMqn45SH3vISG94TP9Bgelhl6loQXh3VDPMXj16vZ7c2mekW75NdxZ6LhzmCeAWS~QkhF4wokp49X27OltCs3H-7eFKX-Eys1A4Hz3vhXQ6BOA-ik4q-hRnnU~co61gcUC90NqG0oou~OgXABqrqbzYoadDhl7LP3Db8dagnAs-NohPYJpYYpoki1P3leumEmA__&Key-Pair-Id=APKAITJV77WS5ZT7262A",
        cat_id: 1,
    },
];

// Ch???y l???n ?????u r???i cmt l???i
// resetDatabase().then(async () => {
//     addSampleData();
//     await udemyApi.getCourseFromUdemy(50).then((courses) => {
//         let i = 1;
//         return Promise.all(courses.map(async (value) => {
//             let temp = await db('courses').where('name', value.name);
//             if (temp.length !== 0) return;
//             value.cat_id = i++;
//             value.teacher_id = 2;
//             if (i == 8){
//                 i = 1;
//             }
//             return db('courses').insert(value);
//         }));
//     })
//     console.log("DONE");
// });

export async function resetDatabase() {
    await db.schema
        .withSchema("public")
        .dropTableIfExists("watch_list")
        .dropTableIfExists("courses_own")
        .dropTableIfExists("ratings")
        .dropTableIfExists("study_progress")
        .dropTableIfExists("lessons")
        .dropTableIfExists("chapters")
        .dropTableIfExists("courses");
    // .dropTableIfExists("categories")
    // .dropTableIfExists("federated_credentials")
    // .dropTableIfExists("users")

    // await Promise.all([createUsersTable(), createCategoriesTable()]);
    await createCourseTable();
    await Promise.all([
        // createFederatedCredentialsTable(),
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

    courses.forEach(async (course) => {
        const ret = await db("courses").where("name", course.name);
        if (ret.length !== 0) return;
        await db("courses").insert(course);
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

            // Kho?? ngo???i
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
            table.string("name").notNullable().index("Search Name"); // T??n kho?? h???c
            table.string("thumbnail").notNullable(); // ???nh ?????i di???n (l???n)
            table.specificType("brief_description", "varchar").notNullable(); // M?? t??? ng???n g???n n???i dung kho?? h???c
            table.specificType("detail_description", "varchar").nullable(); // M?? t??? chi ti???t n???i dung kho?? h???c
            table.specificType("preview_video", "varchar").nullable(); // Video xem tr?????c
            table
                .double("avg_rating")
                .unsigned()
                .defaultTo(0)
                .checkBetween([0, 5]); // ??i???m ????nh gi?? tb
            table.integer("old_price").unsigned().defaultTo(0); // Gi?? c??
            table.integer("price").unsigned().defaultTo(0); // Gi?? hi???n h??nh
            table.boolean("is_complete").defaultTo(false); //  Kho?? h???c ???? ho??n th??nh ch??a

            table.string("slug").notNullable(); // ???????ng d???n kho?? h???c
            table.integer("students_rating").defaultTo(0).unsigned(); // S??? l?????ng h???c vi??n ????nh gi??
            table.integer("students_learning").defaultTo(0).unsigned(); // S??? l?????ng h???c vi??n ????ng k?? h???c
            table.integer("cat_id").unsigned().nullable(); // Th??ng tin l??nh v???c
            table.integer("teacher_id").unsigned().nullable(); // Th??ng tin gi???ng vi??n
            table.timestamps(true, true); // Tr?????ng created_at v?? updated_at

            // Kho?? ngo???i
            table.foreign("cat_id").references("cat_id").inTable("categories");
            table.foreign("teacher_id").references("id").inTable("users");

            // table.index('name', "Search Name", 'gin');
        });
}

function createCategoriesTable() {
    return db.schema
        .withSchema("public")
        .createTable("categories", function (table) {
            table.increments("cat_id").primary();
            table.string("cat_name").notNullable(); // T??n c???a category ????
            table.string("slug").notNullable(); // ???????ng d???n trang web ?????n category
            table.integer("parent_cat_id").nullable().unsigned(); // Id c???a category cha
            table.timestamps(true, true); // Tr?????ng created_at v?? updated_at

            // Kho?? ngo???i
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
            table.primary(["student_id", "course_id"]); // Kho?? ch??nh
            table.timestamps(true, true); // Tr?????ng created_at v?? updated_at

            // Kho?? ngo???i
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
            table.primary(["student_id", "course_id"]); // Kho?? ch??nh
            table.timestamps(true, true); // Tr?????ng created_at v?? updated_at

            // Kho?? ngo???i
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

        // Kho?? ngo???i
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

        // Kho?? ngo???i
        table.foreign("course_id").references("id").inTable("courses");
    });
}

function createLessonTable() {
    return db.schema.createTable("lessons", function (table) {
        table.increments().primary();
        table.string("name").notNullable(); // T??n b??i h???c
        table.string("video_url").notNullable(); // Video c???a b??i h???c
        table.integer("chapter_id").notNullable(); // Ch????ng
        table.boolean("is_previewable").notNullable().defaultTo("false"); // ???????c xem tr?????c
        table.integer("lesson_position").notNullable(); // V??? tr?? trong ch????ng ????
        table.integer("duration").notNullable().defaultTo(0); // ????? d??i b??i h???c
        table.timestamps(true, true);

        // Kho?? ngo???i
        table.foreign("chapter_id").references("id").inTable("chapters");
    });
}

function createStudyProgressTable() {
    return db.schema.createTable("study_progress", function (table) {
        table.integer("student_id").unsigned().notNullable(); // H???c sinh ??ang h???c
        table.integer("lesson_id").unsigned().notNullable(); // B??i ??ang h???c
        table.boolean("is_done").notNullable().defaultTo("false"); // Tr???ng th??i b??i h???c ???? h???c xong hay ch??a
        table.integer("video_position").unsigned().nullable(); // V??? tr?? video ??ang xem
        table.timestamps(true, true);

        // Kho?? ngo???i
        table.foreign("student_id").references("id").inTable("users");
        table.foreign("lesson_id").references("id").inTable("lessons");
    });
}

export default db;
