import accountController from "../controllers/account.controller.js";
import usersService from "../services/users.service.js";
const getAccountSettingPage = async (req, res) => {
    const result = req?.result;
    req.session.passport.user = req.result.user;
    req.user = req.result.user;

    res.render("student/account_setting",
        {
            result,
        });
}

const getChangePasswordPage = (req, res) => {
    const result = req?.result;
    req.result = null;

    res.render("student/change_password", {
        result
    });
}

const enrollCourse = async (req, res) => {
    const userId = req.user.id;
    const courseId = req.body.id;
    await usersService.enrollCourse(userId, courseId);

    return res.redirect(req.headers.referer || req.headers.referer);
}

export default {
    getAccountSettingPage,
    getChangePasswordPage,
    enrollCourse,
}