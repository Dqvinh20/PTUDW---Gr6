import accountController from "../controllers/account.controller.js";

const getAccountSettingPage = (req, res) => {
    const result = req?.result;
    req.result = null;

    res.render("student/account_setting",
        {
            result
        });
}

const getChangePasswordPage = (req, res) => {
    const result = req?.result;
    req.result = null;

    res.render("student/change_password", {
        result
    });
}

export default {
    getAccountSettingPage,
    getChangePasswordPage,
}