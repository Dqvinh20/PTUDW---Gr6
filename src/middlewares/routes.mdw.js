import indexRouter from "../routes/index.route.js";
import authRouter from "../routes/auth.route.js";
import teacherRoute from "../routes/teacher.route.js";
import studentRoute from "../routes/student.route.js";
import myCoursesRoute from "../routes/my_courses.route.js";

import {ensureAuthenticated, ensureStudent, ensureVerifiedEmail, ensureAdmin} from "./ensure.mdw.js";

export default function (app) {
    app.use("/", indexRouter);
    app.use("/", authRouter);

    app.all("/student*", ensureAuthenticated);
    app.all("/student*", ensureStudent);
    app.all("/student*", ensureVerifiedEmail);
    app.use("/student", studentRoute);

    app.all("/my-courses*", ensureAuthenticated);
    app.all("/my-courses*", ensureStudent);
    app.use("/my-courses", myCoursesRoute)

    // app.use("/profile*", ensureAuthenticated);
    // /* Teacher route */
    // app.all("/teacher*", ensureAuthenticated);
    // app.all("/teacher*", ensureTeacher);
    // app.use("/teacher", teacherRoute);

    app.use("*", function (req, res) {
        return res.render("errors/404", { layout: "errors"});

    })
}
