import express from "express";
const router = express.Router();
import studentController from "../controllers/student.controller.js";

// router.use(studentController.setLayout);
//
/* GET edit account page */
router.get("/edit-account", studentController.getAccountSettingPage);

/* GET change password page */
router.get("/change-password", studentController.getAccountSettingPage);
router.post("/change-password", studentController.getAccountSettingPage);

export default router;
