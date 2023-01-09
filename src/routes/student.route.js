import express from "express";
const router = express.Router();
import studentController from '../controllers/student.controller.js';
import accountController from "../controllers/account.controller.js";

/* GET edit account page */
router.get('/edit-account', studentController.getAccountSettingPage);
router.post('/edit-account',
    accountController.editAccount,
    studentController.getAccountSettingPage);

/* GET change password page */
router.get('/change-password', studentController.getChangePasswordPage);
router.post('/change-password',
    accountController.changePassword,
    studentController.getChangePasswordPage);

export default router;