
const getAccountSettingPage = (req, res) => {
    res.render("student/account_setting");
}

const getChangePasswordPage = (req, res) => {
    res.render("student/change_password");
}

const changePassword = (req, res) => {
    const oldPass = req.body.oldPass;
    const newPass = req.body.newPass;

    return res.render("student/change-password", {

    });
}
export default {
    getAccountSettingPage,
    getChangePasswordPage,
    changePassword
}