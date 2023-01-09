import indexRouter from "../routes/index.route.js";
import authRouter from "../routes/auth.route.js";
import teacherRoute from "../routes/teacher.route.js";
import adminRoute from "../routes/admin.route.js";
import studentRoute from "../routes/student.route.js";
// import myCoursesRoute from "../routes/my_courses.route.js";

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.set("X-Auth-Required", "true");
    req.session.retUrl = req.originalUrl;
    res.redirect("/login");
}

function ensureAdmin(req, res, next) {
    if (req.user.role === "ADMIN") {
        return next();
    }
    req.user;
    res.redirect("/");
}

function ensureStudent(req, res, next) {
    if (req.user.role === "STUDENT") {
        if (req.user.isVerified !== true) {
            return res.redirect("/auth/verification");
        }
        return next();
    }
    res.redirect("/");
}

function ensureTeacher(req, res, next) {
    if (req.user.role === "TEACHER") {
        if (req.user.isVerified !== true) {
            return res.redirect("/auth/verification");
        }
        return next();
    }
    res.redirect("/");
}

export default function (app) {
    app.use("/", indexRouter);

    app.use("/", authRouter);

    app.all("/student*", ensureAuthenticated);
    app.all("/student*", ensureStudent);
    app.use("/student", studentRoute);

    // app.all("/my-courses*", ensureAuthenticated);
    // app.all("/my-courses*", ensureStudent);
    // app.use("/my-courses", myCoursesRoute);

    // app.use("/profile*", ensureAuthenticated);
    // /* Teacher route */
    // app.all("/teacher*", ensureAuthenticated);
    // app.all("/teacher*", ensureTeacher);
    app.use("/teacher", teacherRoute);
    app.use("/admin", adminRoute);
}
